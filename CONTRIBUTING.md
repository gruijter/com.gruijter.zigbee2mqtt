# Contributing to Zigbee2MQTT for Homey

Thank you for your interest in contributing! This guide covers the two main types of contributions.

---

## 1. Adding Missing Properties (Most Common)

This is the most requested type of contribution. New Zigbee devices often have properties that aren't yet mapped to Homey capabilities.

### For Non-Developers

If you don't code but want to request support for a device property, please **open an issue** with the following information:

**Required: Device Definition**
1. Open Zigbee2MQTT web app
2. Go to your device page
3. Click **Dev Console**
4. Click **Show definition**
5. Copy and paste the full JSON in your issue

This definition contains the `exposes` array with all properties, their types, value ranges, and access permissions — everything a developer needs to add support.

**Helpful: Device State**
1. Open Zigbee2MQTT web app
2. Go to your device page
3. Go to the **State** tab
4. Copy the state values

**Issue template:**

```
**Device:** [Manufacturer and model name]
**Missing property:** [The Z2M property name you want supported]
**Expected Homey capability:** [What you expect it to do in Homey]

**Device Definition:**
```json
[Paste definition here]
```

**Device State:**
```json
[Paste state here]
```
```

---

### For Developers

**Files to edit:**

1. **`src/capabilitymap.ts`** — The main file where Z2M properties are mapped to Homey capabilities. This is usually the only file you need to modify.

2. **`.homeycompose/capabilities/*.json`** — Only if you need to add a custom capability that doesn't exist in Homey.

3. **`.homeycompose/flow/triggers/*.json`** — Only for custom capabilities that need flow triggers.

4. **`.homeycompose/flow/actions/*.json`** — Only for settable custom capabilities that need flow actions.

**Mapping syntax:**

```typescript
// Single capability (simple)
property_name: ['homey_capability', (v) => transformedValue, (v) => ({ property_name: reverseTransform })],

// Multi-capability (for properties that map to multiple Homey capabilities)
property_name: (expose) => ({
  caps: ['cap1', 'cap2'],
  z2mToHomey: (z2mValue, z2mState) => ({ cap1: val1, cap2: val2 }),
  homeyToZ2m: (values, getCapValue) => ({ property_name: payload }),
}),
```

See the comment block at the top of `capabilitymap.ts` for detailed syntax documentation.

---

**Real-world example: Adding an enum property (`pilot_wire_mode`)**

Given this device definition expose:

```json
{
  "access": 3,
  "property": "pilot_wire_mode",
  "type": "enum",
  "values": ["comfort", "eco", "frost_protection", "off", "comfort_-1", "comfort_-2"]
}
```

**Step 1:** Add the mapping in `src/capabilitymap.ts`:

```typescript
pilot_wire_mode: ['pilot_wire_mode', (v) => v, (v) => ({ pilot_wire_mode: v })],
```

**Step 2:** Since `pilot_wire_mode` is a custom capability (not built-in to Homey), create `.homeycompose/capabilities/pilot_wire_mode.json`:

```json
{
  "type": "enum",
  "title": { "en": "Pilot Wire Mode", "fr": "Mode Fil Pilote" },
  "values": [
    { "id": "comfort", "title": { "en": "Comfort", "fr": "Confort" } },
    { "id": "eco", "title": { "en": "Eco", "fr": "Éco" } },
    { "id": "frost_protection", "title": { "en": "Frost Protection", "fr": "Protection Antigel" } },
    { "id": "off", "title": { "en": "Off", "fr": "Éteint" } },
    { "id": "comfort_-1", "title": { "en": "Comfort -1", "fr": "Confort -1" } },
    { "id": "comfort_-2", "title": { "en": "Comfort -2", "fr": "Confort -2" } }
  ],
  "uiComponent": "picker",
  "getable": true,
  "setable": true
}
```

**Step 3:** Since it's settable (`access: 3`), create a flow action in `.homeycompose/flow/actions/pilot_wire_mode.json`:

```json
{
  "title": { "en": "Set Pilot Wire Mode", "fr": "Définir le Mode Fil Pilote" },
  "titleFormatted": { "en": "Set Pilot Wire Mode to [[val]]" },
  "args": [
    { "type": "device", "name": "device", "filter": "driver_id=device|group&capabilities=pilot_wire_mode" },
    { "type": "dropdown", "name": "val", "values": [
      { "id": "comfort", "title": { "en": "Comfort" } },
      { "id": "eco", "title": { "en": "Eco" } }
      // ... other values
    ]}
  ]
}
```

> **Tip:** For read-only properties (`access: 1`), you only need steps 1-2. For properties using existing Homey capabilities, you only need step 1.

**Key resources to gather before coding:**

1. **Device Definition** — Found in Zigbee2MQTT web app:
   - Go to your device page
   - Open **Dev Console**
   - Click **Show definition**
   
   This JSON contains everything you need to add a property:
   - `exposes[]` — All available properties with their `property` name (the key for capabilityMap)
   - `type` — Property type (numeric, binary, enum, composite...)
   - `access` — Read/write permissions (1=read, 2=write, 7=read+write)
   - `value_min`/`value_max` — Value ranges for numeric properties
   - `values[]` — Possible values for enum properties
   - `features[]` — Nested properties for composite types (like color with x/y)

2. **Device State** — Found in Zigbee2MQTT web app:
   - Go to your device page
   - Check the **State** tab
   - This shows the actual property values your device exposes

3. **Zigbee2MQTT Exposes Documentation** — https://www.zigbee2mqtt.io/guide/usage/exposes.html

**Submitting your contribution:**

1. Fork the repository
2. Create a branch for your changes
3. Edit `src/capabilitymap.ts` (and other files if needed)
4. Test with your device
5. Open a Pull Request with:
   - The device model/name
   - The property you added
   - The device definition JSON (for reference)

---

## 2. Code Fixes, Improvements, or Features

For bug fixes, code improvements, or new features:

1. **Open an issue first** to discuss your proposed change
2. Fork the repository and create a feature branch
3. Make your changes
4. Ensure TypeScript compiles without errors: `npm run build`
5. Test your changes thoroughly
6. Submit a Pull Request with a clear description of:
   - What problem you're solving
   - How you solved it
   - Any breaking changes

---

## Development Setup

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run Homey app (requires Homey CLI)
homey start
```

---

## Questions?

If you're unsure about anything, feel free to open an issue for discussion before starting work.
