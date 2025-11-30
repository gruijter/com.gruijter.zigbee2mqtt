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
