export function isNumeric(str: string) {
    return !isNaN(+str) &&
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}