import type { KeyValue, KeyValueAny, Tz, Zh } from "./types";
/**
 * Class representing color in RGB space
 */
export declare class ColorRGB {
    /**
     * red component (0..1)
     */
    red: number;
    /**
     * green component (0..1)
     */
    green: number;
    /**
     * blue component (0..1)
     */
    blue: number;
    /**
     * Create RGB color
     */
    constructor(red: number, green: number, blue: number);
    /**
     * Create RGB color from object
     * @param rgb - object with properties red, green and blue
     * @returns new ColoRGB object
     */
    static fromObject(rgb: {
        red: number;
        green: number;
        blue: number;
    }): ColorRGB;
    /**
     * Create RGB color from hex string
     * @param hex -hex encoded RGB color
     * @returns new ColoRGB object
     */
    static fromHex(hex: string): ColorRGB;
    /**
     * Return this color with values rounded to given precision
     * @param precision - decimal places to round to
     */
    rounded(precision: number): ColorRGB;
    /**
     * Convert to Object
     * @returns object with properties red, green and blue
     */
    toObject(): {
        red: number;
        green: number;
        blue: number;
    };
    /**
     * Convert to HSV
     *
     * @returns color in HSV space
     */
    toHSV(): ColorHSV;
    /**
     * Convert to CIE
     * @returns color in CIE space
     */
    toXY(): ColorXY;
    /**
     * Returns color after sRGB gamma correction
     * @returns corrected RGB
     */
    gammaCorrected(): ColorRGB;
    /**
     * Returns color after reverse sRGB gamma correction
     * @returns raw RGB
     */
    gammaUncorrected(): ColorRGB;
    /**
     * Create hex string from RGB color
     * @returns hex hex encoded RGB color
     */
    toHEX(): string;
}
/**
 *  Class representing color in CIE space
 */
export declare class ColorXY {
    /** X component (0..1) */
    x: number;
    /** Y component (0..1) */
    y: number;
    /**
     * Create CIE color
     */
    constructor(x: number, y: number);
    /**
     * Create CIE color from object
     * @param xy - object with properties x and y
     * @returns new ColorXY object
     */
    static fromObject(xy: {
        x: number | string;
        y: number | string;
    }): ColorXY;
    /**
     * Create XY object from color temp in mireds
     * @param mireds - color temp in mireds
     * @returns color in XY space
     */
    static fromMireds(mireds: number): ColorXY;
    /**
     * Converts color in XY space to temperature in mireds
     * @returns color temp in mireds
     */
    toMireds(): number;
    /**
     * Converts CIE color space to RGB color space
     * From: https://github.com/usolved/cie-rgb-converter/blob/master/cie_rgb_converter.js
     */
    toRGB(): ColorRGB;
    /**
     * Convert to HSV
     * @returns color in HSV space
     */
    toHSV(): ColorHSV;
    /**
     * Return this color with value rounded to given precision
     * @param precision - decimal places to round to
     */
    rounded(precision: number): ColorXY;
    /**
     * Convert to object
     * @returns object with properties x and y
     */
    toObject(): {
        x: number;
        y: number;
    };
}
/**
 * Class representing color in HSV space
 */
export declare class ColorHSV {
    /** hue component (0..360) */
    hue: number;
    /** saturation component (0..100) */
    saturation: number;
    /** value component (0..100) */
    value: number;
    /**
     * Create color in HSV space
     */
    constructor(hue: number, saturation?: number, value?: number);
    /**
     * Create HSV color from object
     */
    static fromObject(hsv: {
        hue?: number;
        saturation?: number;
        value: number;
    }): ColorHSV;
    /**
     * Create HSV color from HSL
     * @param hsl - color in HSL space
     * @returns color in HSV space
     */
    static fromHSL(hsl: {
        hue: number;
        saturation: number;
        lightness: number;
    }): ColorHSV;
    /**
     * Return this color with value rounded to given precision
     * @param precision - decimal places to round to
     */
    rounded(precision: number): ColorHSV;
    /**
     * Convert to object
     * @param short - return h, s, v instead of hue, saturation, value
     * @param includeValue - omit v(alue) from return
     */
    toObject(short?: boolean, includeValue?: boolean): {
        h?: number;
        hue?: number;
        s?: number;
        saturation?: number;
        v?: number;
        value?: number;
    };
    /**
     * Convert RGB color
     * @returns
     */
    toRGB(): ColorRGB;
    /**
     * Create CIE color from HSV
     */
    toXY(): ColorXY;
    /**
     * Create Mireds from HSV
     * @returns color temp in mireds
     */
    toMireds(): number;
    /**
     * Returns color with missing properties set to defaults
     * @returns HSV color
     */
    complete(): ColorHSV;
    /**
     * Interpolates hue value based on correction map through ranged linear interpolation
     * @param hue - hue to be corrected
     * @param correctionMap -  array of hueIn -\> hueOut mappings; example: `[ {"in": 20, "out": 25}, {"in": 109, "out": 104}]`
     * @returns corrected hue value
     */
    static interpolateHue(hue: number, correctionMap: KeyValueAny[]): number;
    /**
     * Applies hue interpolation if entity has hue correction data
     * @param hue - hue component of HSV color
     * @returns corrected hue component of HSV color
     */
    static correctHue(hue: number, meta: Tz.Meta): number;
    /**
     * Returns HSV color after hue correction
     * @param meta - entity meta object
     * @returns hue corrected color
     */
    hueCorrected(meta: Tz.Meta): ColorHSV;
    /**
     * Returns HSV color after gamma and hue corrections
     * @param meta - entity meta object
     * @returns corrected color in HSV space
     */
    colorCorrected(meta: Tz.Meta): ColorHSV;
}
export declare class Color {
    hsv: ColorHSV;
    xy: ColorXY;
    rgb: ColorRGB;
    /**
     * Create Color object
     * @param hsv - ColorHSV instance
     * @param rgb - ColorRGB instance
     * @param xy - ColorXY instance
     */
    constructor(hsv: ColorHSV, rgb: ColorRGB, xy: ColorXY);
    /**
     * Create Color object from converter's value argument
     * @param value - converter value argument
     * @returns Color object
     */
    static fromConverterArg(value: any): Color;
    /**
     * Returns true if color is HSV
     */
    isHSV(): boolean;
    /**
     * Returns true if color is RGB
     */
    isRGB(): boolean;
    /**
     * Returns true if color is XY
     */
    isXY(): boolean;
}
/**
 * Sync all color attributes
 * NOTE: behavior can be disable by setting the 'color_sync' device/group option
 * @param newState - state with only the changed attributes set
 * @param oldState - state from the cache with all the old attributes set
 * @param endpoint - with lightingColorCtrl cluster
 * @param options - meta.options for the device or group
 * @param epPostfix - postfix from the end point name. This string will be appended to the result keys unconditionally.
 * @returns state with color, color_temp, and color_mode set and synchronized from newState's attributes
 *          (other attributes are not included make sure to merge yourself)
 */
export declare function syncColorState(newState: KeyValueAny, oldState: KeyValueAny, endpoint: Zh.Endpoint | Zh.Group, options: KeyValue, epPostfix?: string): KeyValueAny;
//# sourceMappingURL=color.d.ts.map