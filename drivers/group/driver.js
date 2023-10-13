/* eslint-disable prefer-destructuring */
/*
Copyright 2023, Robin de Gruijter (gruijter@hotmail.com)

This file is part of com.gruijter.zigbee2mqtt.

com.gruijter.zigbee2mqtt is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

com.gruijter.zigbee2mqtt is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with com.gruijter.zigbee2mqtt.  If not, see <http://www.gnu.org/licenses/>.
*/

'use strict';

const { Driver } = require('homey');
// const util = require('util');
const { capabilityMap, mapProperty, mapClassIcon } = require('../../capabilitymap');

// const setTimeoutPromise = util.promisify(setTimeout);

class MyDriver extends Driver {

	async onInit() {
		this.ds = {
			// groupCapabilities: capabilities,
			capabilityMap,
		};
		this.log('Device driver has been initialized');
	}

	async onUninit() {
		this.log('driver onUninit');
	}

	async onPair(session) {

		session.setHandler('list_devices', async () => {
			// get all groups from all bridges
			try {
				this.log('Pairing of new Attached group started');
				const bridgeDriver = this.homey.drivers.getDriver('bridge');
				await bridgeDriver.ready(() => null);
				const bridges = bridgeDriver.getDevices();
				if (!bridges || !bridges[0]) { throw Error('Cannot find bridge group in Homey. Bridge needs to be added first!'); }

				const groups = [];
				bridges.forEach((bridge) => {
					bridge.groups
						.forEach((item) => {

							const dev = bridge.devices.filter((dev) => dev.definition && dev.definition.exposes).find((dev) => dev.ieee_address == item.members[0].ieee_address);
							this.log(dev);

							const settings = {
								uid: item.id,
								friendly_name: item.friendly_name,
								bridge_uid: bridge.getData().id,
								members: item.members,
							};
							// map capabilities and group icons to Homey
							const { caps, capDetails } = mapProperty(dev);
							const { homeyClass, icon } = mapClassIcon(dev);
							settings.homeyclass = homeyClass;
							const group = {
								name: item.friendly_name,
								data: {
									id: item.id, // `zigbee2mqtt_${Math.random().toString(16).substring(2, 8)}`,
								},
								icon, // "/my_icon.svg", // relative to: /drivers/<driver_id>/assets/
								capabilities: [...caps],
								store: { item, capDetails },
								settings,
							};
							groups.push(group);
						});
				});
				// console.dir(groups, { depth: null });
				return Promise.all(groups);
			} catch (error) {
				this.error(error);
				return Promise.reject(error);
			}
		});

	}

}

module.exports = MyDriver;

/*  
{
	friendly_name: 'Hal',
	id: 1,
	members: [ [Object], [Object], [Object], [Object] ],
	scenes: []
},
{
	friendly_name: 'Overloop',
	id: 2,
	members: [ [Object], [Object], [Object], [Object] ],
	scenes: []
}
*/