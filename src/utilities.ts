/**
 * Converts hsb data to rgb object.
 * @param {number} hue Hue [0 - 1]
 * @param {number} sat Saturation [0 - 1]
 * @param {number} dim Brightness [0 - 1]
 * @returns {object} RGB object. [0 - 255]
 */
// eslint-disable-next-line import/prefer-default-export
export const hsbToRgb = (hue: number, sat: number, dim: number) => {
  let red;
  let green;
  let blue;
  const i = Math.floor(hue * 6);
  const f = hue * 6 - i;
  const p = dim * (1 - sat);
  const q = dim * (1 - f * sat);
  const t = dim * (1 - (1 - f) * sat);
  switch (i % 6) {
    case 0:
      red = dim;
      green = t;
      blue = p;
      break;
    case 1:
      red = q;
      green = dim;
      blue = p;
      break;
    case 2:
      red = p;
      green = dim;
      blue = t;
      break;
    case 3:
      red = p;
      green = q;
      blue = dim;
      break;
    case 4:
      red = t;
      green = p;
      blue = dim;
      break;
    case 5:
      red = dim;
      green = p;
      blue = q;
      break;
    default:
      red = dim;
      green = dim;
      blue = dim;
  }
  const r = Math.round(red * 255);
  const g = Math.round(green * 255);
  const b = Math.round(blue * 255);
  const rgbHexString = `${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  return {
    r,
    g,
    b,
    rgbHexString,
  };
};

/**
 * Converts CIE xyY color coordinates to hue and saturation
 * @param {number} x CIE x chromaticity coordinate [0-1]
 * @param {number} y CIE y chromaticity coordinate [0-1]
 * @param {number} Y Optional: Y luminance [0-1], defaults to 1.0
 * @returns {object} Object with hue [0-360] and saturation [0-100]
 */
export const xyYToHueSat = (x: number, y: number, Y: number = 1.0) => {
  // Convert xyY to XYZ
  const X = (x * Y) / y;
  const Z = ((1 - x - y) * Y) / y;
  
  // Convert XYZ to RGB (using sRGB D65 white point)
  const r = X * 3.2406 + Y * -1.5372 + Z * -0.4986;
  const g = X * -0.9689 + Y * 1.8758 + Z * 0.0415;
  const b = X * 0.0557 + Y * -0.2040 + Z * 1.0570;
  
  // Apply gamma correction
  const gammaCorrect = (c: number) => {
    if (c <= 0.0031308) return 12.92 * c;
    return 1.055 * Math.pow(c, 1/2.4) - 0.055;
  };
  
  let red = Math.max(0, Math.min(1, gammaCorrect(r)));
  let green = Math.max(0, Math.min(1, gammaCorrect(g)));
  let blue = Math.max(0, Math.min(1, gammaCorrect(b)));
  
  // Convert RGB to HSV
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  
  let hue = 0;
  if (delta !== 0) {
    if (max === red) {
      hue = 60 * (((green - blue) / delta) % 6);
    } else if (max === green) {
      hue = 60 * ((blue - red) / delta + 2);
    } else {
      hue = 60 * ((red - green) / delta + 4);
    }
  }
  if (hue < 0) hue += 360;
  
  const saturation = max === 0 ? 0 : (delta / max) * 100;
  
  return {
    hue: Math.round(hue),
    saturation: Math.round(saturation * 100) / 100
  };
};

/**
 * Converts RGB to HSV
 * @param {number} r Red [0-255]
 * @param {number} g Green [0-255]
 * @param {number} b Blue [0-255]
 * @returns {object} Object with hue [0-360], saturation [0-100], value [0-100]
 */
export const rgbToHsv = (r: number, g: number, b: number) => {
  r = r / 255;
  g = g / 255;
  b = b / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  
  let hue = 0;
  if (delta !== 0) {
    if (max === r) {
      hue = 60 * (((g - b) / delta) % 6);
    } else if (max === g) {
      hue = 60 * ((b - r) / delta + 2);
    } else {
      hue = 60 * ((r - g) / delta + 4);
    }
  }
  if (hue < 0) hue += 360;
  
  const saturation = max === 0 ? 0 : (delta / max) * 100;
  const value = max * 100;
  
  return {
    hue: Math.round(hue),
    saturation: Math.round(saturation * 100) / 100,
    value: Math.round(value * 100) / 100
  };
};