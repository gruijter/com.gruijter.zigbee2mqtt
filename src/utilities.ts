/**
 * Converts hsb data to rgb object.
 * @param {number} hue Hue [0 - 1]
 * @param {number} sat Saturation [0 - 1]
 * @param {number} dim Brightness [0 - 1]
 * @returns {object} RGB object. [0 - 255]
 */
export const hsbToRgb = (hue: number, sat: number, dim: number = 1) => {
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
 * Converts hue and saturation to CIE xy chromaticity coordinates
 * @param {number} hue Hue [0 - 1]
 * @param {number} sat Saturation [0 - 1]
 * @returns {object} Object with x and y chromaticity coordinates [0-1]
 */
export const hsToXy = (hue: number, sat: number) => {
  // Convert HS to RGB (using full brightness)
  const { r, g, b } = hsbToRgb(hue, sat, 1);
  
  // Normalize to [0, 1]
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  
  // Apply inverse gamma correction (sRGB to linear)
  const inverseGamma = (c: number) => {
    if (c <= 0.04045) return c / 12.92;
    return Math.pow((c + 0.055) / 1.055, 2.4);
  };
  
  const rLinear = inverseGamma(red);
  const gLinear = inverseGamma(green);
  const bLinear = inverseGamma(blue);
  
  // Convert linear RGB to XYZ (sRGB D65 matrix)
  const X = rLinear * 0.4124 + gLinear * 0.3576 + bLinear * 0.1805;
  const Y = rLinear * 0.2126 + gLinear * 0.7152 + bLinear * 0.0722;
  const Z = rLinear * 0.0193 + gLinear * 0.1192 + bLinear * 0.9505;
  
  // Convert XYZ to xy chromaticity
  const sum = X + Y + Z;
  if (sum === 0) {
    // Return D65 white point for black
    return { x: 0.3127, y: 0.3290 };
  }
  
  const x = X / sum;
  const y = Y / sum;
  
  // Round to 4 decimal places for cleaner values
  return {
    x: Math.round(x * 10000) / 10000,
    y: Math.round(y * 10000) / 10000,
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
  
  // Convert XYZ to linear RGB (using sRGB D65 white point)
  let r = X * 3.2406 + Y * -1.5372 + Z * -0.4986;
  let g = X * -0.9689 + Y * 1.8758 + Z * 0.0415;
  let b = X * 0.0557 + Y * -0.2040 + Z * 1.0570;
  
  // Gamut mapping: if any component is negative, shift all towards white
  // This preserves hue and saturation better than simple clamping
  const minRgb = Math.min(r, g, b);
  if (minRgb < 0) {
    r -= minRgb;
    g -= minRgb;
    b -= minRgb;
  }
  
  // Normalize to [0,1] range (preserves saturation info)
  const maxRgb = Math.max(r, g, b, 0.0001);
  r /= maxRgb;
  g /= maxRgb;
  b /= maxRgb;
  
  // Apply gamma correction
  const gammaCorrect = (c: number) => {
    if (c <= 0.0031308) return 12.92 * c;
    return 1.055 * Math.pow(c, 1/2.4) - 0.055;
  };
  
  const red = gammaCorrect(r);
  const green = gammaCorrect(g);
  const blue = gammaCorrect(b);
  
  // Convert RGB to HSV
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  
  let hue = 0;
  if (delta !== 0) {
    if (max === red) {
      // Use proper modulo that handles negative values
      hue = 60 * (((((green - blue) / delta) % 6) + 6) % 6);
    } else if (max === green) {
      hue = 60 * ((blue - red) / delta + 2);
    } else {
      hue = 60 * ((red - green) / delta + 4);
    }
  }
  
  const saturation = max === 0 ? 0 : (delta / max) * 100;
  
  // Normalize hue to [0, 360) - ensure 360 becomes 0
  let finalHue = Math.round(hue) % 360;
  if (finalHue < 0) finalHue += 360;
  
  return {
    hue: finalHue,
    saturation: Math.round(saturation * 100) / 100
  };
};