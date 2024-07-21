export function isNumeric(str: string) {
    return !isNaN(+str) &&
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

// it appears that when we get dimens from re-flex there are some conversion problems
// this solves the issue
export function convertDimen(d: number | undefined) {
    return !d || isNaN(d) ? 0 : d;
}

function componentToHex(c: number) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

export function myRgbaToHexArr(rgba: number[]) {
    if(!(rgba && (rgba.length === 4 || rgba.length === 3))) {
        console.error(`rgbaToHex was provided a wrong rgba number array ${rgba}`)
        return "#000000";
    }
    const rgb = "#" + componentToHex(rgba[0]) + componentToHex(rgba[1]) + componentToHex(rgba[2]);
    if (rgba.length === 3) return rgb;
    return rgb + componentToHex(rgba[3]);
}

export function myRgbaToHex(rgba: { r: number, g: number, b: number, a: number | undefined}) {
    const rgb = "#" + componentToHex(rgba.r) + componentToHex(rgba.g) + componentToHex(rgba.b);
    if (rgba.a === undefined) return rgb;
    return rgb + componentToHex(rgba.a);
}

export function myHexToRgba(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: (isNaN(parseInt(result[4], 16))? 256 : parseInt(result[4], 16))
    } : null;
}

export function isRgba(str: string) {
    return myHexToRgba(str) !== null;
}

export function lerp(start: number, end: number, perc: number) {
    return Math.floor(start + (end - start) * perc);
}