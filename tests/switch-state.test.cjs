const assert = require('node:assert/strict');
const Module = require('node:module');
const { mock, test } = require('node:test');

// The SDK is provided by Homey at runtime. Load the compiled app and driver locally.
const load = Module._load;
const sdk = { App: class {}, Device: class {} };
const loader = mock.method(Module, '_load', function loadModule(name, ...args) {
  return name === 'homey' ? sdk : load.call(this, name, ...args);
});
const Device = require('../.homeybuild/drivers/Zigbee2MQTTDevice').default;
const App = require('../.homeybuild/app');
loader.mock.restore();

function outlet() {
  const device = new Device();
  const writes = [];
  const published = [];
  const listeners = {};
  const timers = new Set();
  const capabilityMappings = {};
  for (const [property, capability] of Object.entries({
    state: 'onoff', state_l1: 'onoff.l1', linkquality: 'measure_linkquality',
  })) {
    capabilityMappings[property] = { expose: { type: 'binary', access: 7 }, homeyCapabilities: [capability] };
  }
  Object.assign(device, {
    deviceTopic: 'z2m/test',
    store: { storeVersion: 2, capabilityMappings },
    homey: {
      setTimeout(fn) { timers.add(fn); return fn; },
      clearTimeout(fn) { timers.delete(fn); },
    },
    bridge: { client: { connected: true, publishAsync: async (topic, payload) => published.push([topic, payload]) } },
    getName: () => 'Test',
    getCapabilities: () => ['onoff', 'onoff.l1', 'measure_linkquality'],
    hasCapability: () => true,
    getCapabilityValue: () => true,
    setCapabilityValue: async (cap, value) => { writes.push([cap, value]); },
    registerCapabilityListener: (cap, callback) => { listeners[cap] = callback; },
    log() {},
    error(error) { throw error; },
  });
  return { device, listeners, writes, published, timers };
}

test('Homey off, stale ON, confirmed OFF does not trigger a timer Flow that turns the outlet back on', async () => {
  const { device, listeners, writes, published, timers } = outlet();
  await device.registerListeners();
  const update = device.setCapabilityValue;
  device.setCapabilityValue = async (cap, value) => {
    await update(cap, value);
    if (cap === 'onoff' && value) await listeners.onoff(true);
  };
  await listeners.onoff(false);
  await device.handleDeviceStateMessage({ linkquality: 86, state: 'ON', state_l1: 'ON' });
  await device.handleDeviceStateMessage({ state: 'OFF' });
  assert.deepEqual(writes.filter(([cap]) => cap === 'onoff'), [['onoff', false]]);
  assert.ok(writes.some(([cap, value]) => cap === 'measure_linkquality' && value === 86));
  assert.ok(writes.some(([cap, value]) => cap === 'onoff.l1' && value));
  assert.deepEqual(published, [['z2m/test/set', '{"state":"OFF"}']]);
  assert.equal(timers.size, 0);
  await device.handleDeviceStateMessage({ state: 'ON' });
  assert.deepEqual(writes.at(-1), ['onoff', true]);
});

test('a missing confirmation restores the last actual report without publishing a retry', async () => {
  const { device, writes, published, timers } = outlet();
  await device.setCapabilityCommand('onoff.l1', true, 'flow');
  await device.handleDeviceStateMessage({ state_l1: 'OFF' });
  assert.deepEqual(writes, []);
  const [expire] = timers;
  expire();
  assert.deepEqual(writes, [['onoff.l1', false]]);
  assert.equal(published.length, 1);
  await device.handleDeviceStateMessage({ state_l1: 'ON' });
  assert.deepEqual(writes.at(-1), ['onoff.l1', true]);
});

test('a failed earlier publish cannot cancel a newer command, including a custom payload', async () => {
  const { device, writes, timers } = outlet();
  const first = Promise.withResolvers();
  const publish = device.bridge.client.publishAsync;
  device.bridge.client.publishAsync = () => first.promise;
  const old = device.setCapabilityCommand('onoff', false, 'flow');
  device.bridge.client.publishAsync = publish;
  await device.setCustomPayload('{"state":"ON"}', 'flow');
  first.reject(new Error('publish failed'));
  await assert.rejects(old, /publish failed/);
  await device.handleDeviceStateMessage({ state: 'OFF' });
  assert.deepEqual(writes, []);
  await device.handleDeviceStateMessage({ state: 'ON' });
  assert.deepEqual(writes, [['onoff', true]]);
  assert.equal(timers.size, 0);
});

test('publish failure reconciles a deferred report and teardown cancels outstanding timers', async () => {
  const { device, timers, writes } = outlet();
  const first = Promise.withResolvers();
  const publish = device.bridge.client.publishAsync;
  device.bridge.client.publishAsync = () => first.promise;
  const command = device.setCapabilityCommand('onoff', false, 'flow');
  await device.handleDeviceStateMessage({ state: 'ON' });
  first.reject(new Error('publish failed'));
  await assert.rejects(command, /publish failed/);
  assert.deepEqual(writes, [['onoff', true]]);
  assert.equal(timers.size, 0);
  device.bridge.client.publishAsync = publish;
  await device.setCustomPayload('{"state":"OFF","state_l1":"ON"}', 'flow');
  assert.equal(timers.size, 2);
  device.destroyListeners();
  assert.equal(timers.size, 0);
});

test('each action registers once and a custom payload publish failure reaches the Flow', async () => {
  const app = new App();
  const listeners = new Map();
  app.log = () => {};
  app.manifest = { flow: { actions: require('../app.json').flow.actions } };
  app.homey = { flow: { getActionCard: (id) => ({
    registerRunListener(listener) {
      assert.ok(!listeners.has(id), id);
      listeners.set(id, listener);
    },
  }) } };
  app.registerFlowListeners();
  const { device, published } = outlet();
  const run = listeners.get('custom_payload_set');
  const val = ' { "state": "TOGGLE" } ';
  await run({ device, val });
  assert.deepEqual(published, [['z2m/test/set', val]]);
  device.bridge.client.connected = false;
  await assert.rejects(run({ device, val }), /Bridge is not connected/);
});
