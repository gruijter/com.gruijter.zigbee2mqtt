# Contributing to Zigbee2MQTT for Homey

Thank you for your interest in contributing!

## Quick Reference

| I want to... | Go to |
|--------------|-------|
| Request support for a device property | [Request Device Support](#1-request-device-support-non-developers) |
| Add a property mapping myself | [Add a Property](#2-add-a-property-developers) |
| Fix a bug or add a feature | [Code Changes](#3-code-changes) |

## 1. Request Device Support (Non-Developers)

If you don't code but want to request support for a device property, **open an issue** with the following information.

### Getting the Device Definition (Required)

1. Open Zigbee2MQTT web app
2. Go to your device page
3. Click **Dev Console** → **Show definition**
4. Copy the full JSON

This contains the `exposes` array with all properties, their types, value ranges, and access permissions.

### Getting the Device State (Helpful)

1. Open Zigbee2MQTT web app
2. Go to your device page → **State** tab
3. Copy the state values

### Issue Template

~~~
Device: [Manufacturer and model name]
Missing property: [The Z2M property name you want supported]
Expected Homey capability: [What you expect it to do in Homey]

Device Definition:
```json
[Paste definition here]
```

Device State:
```json
[Paste state here]
```
~~~

## 2. Add a Property (Developers)

To add support for a Z2M property, you'll map it to a Homey capability. Most properties only require editing one file — the more complex cases need custom capability definitions.

### Files Overview

| File | When to edit |
|------|--------------|
| `src/capabilitymap.ts` | Always — maps Z2M properties to Homey capabilities |
| `.homeycompose/capabilities/*.json` | Only for custom capabilities not built into Homey |
| `.homeycompose/flow/actions/*.json` | Only for settable custom capabilities |
| `.homeycompose/flow/triggers/*.json` | Only for custom capabilities needing flow triggers |

### Mapping Syntax

```typescript
// Single capability (simple)
property_name: ['homey_capability', (v) => capValue, (v) => ({ property_name: z2mValue })],

// Multi-capability (maps to multiple Homey capabilities)
property_name: (expose) => ({
  caps: ['cap1', 'cap2'],
  z2mToHomey: (z2mValue, z2mState) => ({ cap1: val1, cap2: val2 }),
  homeyToZ2m: (values) => ({ property_name: payload }),
}),
```

See the comment block at the top of `capabilitymap.ts` for detailed syntax documentation.

### Example: Adding `pilot_wire_mode`

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

**Step 2:** Create the custom capability `.homeycompose/capabilities/pilot_wire_mode.json`:

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

**Step 3:** Since it's settable (`access: 3`), create `.homeycompose/flow/actions/pilot_wire_mode.json`:

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

> **Tip:** For read-only properties (`access: 1`), skip step 3. For built-in Homey capabilities, only step 1 is needed.

### Understanding the Device Definition

The device definition JSON (from Dev Console → Show definition) contains:

| Field | Description |
|-------|-------------|
| `exposes[].property` | The property name (key for capabilityMap) |
| `exposes[].type` | Property type: `numeric`, `binary`, `enum`, `composite` |
| `exposes[].access` | Permissions: `1`=read, `2`=write, `3` or `7`=read+write |
| ... |  |

📖 [Zigbee2MQTT Exposes Documentation](https://www.zigbee2mqtt.io/guide/usage/exposes.html)

### Submitting Your PR

1. Fork the repository
2. Create a branch for your changes
3. Edit the necessary files
4. Test with your device
5. Open a Pull Request with:
   - Device model/name
   - Property you added
   - Device definition JSON (for reference)

## 3. Code Changes

For bug fixes, improvements, or new features:

1. **Open an issue first** to discuss your proposed change
2. Fork the repository and create a feature branch
3. Make your changes
4. Ensure TypeScript compiles: `npm run build`
5. Test thoroughly
6. Submit a Pull Request describing:
   - What problem you're solving
   - How you solved it
   - Any breaking changes

## Development Setup

```bash
npm install          # Install dependencies
npm run build        # Build TypeScript
homey app run        # Run app (requires Homey CLI)
```

## Questions?

Open an issue for discussion before starting work.
