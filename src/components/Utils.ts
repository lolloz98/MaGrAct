export function isNumeric(str: string) {
    return !isNaN(+str) &&
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

// it appears that when we get dimens from re-flex there are some conversion problems
// this solves the issue
export function convertDimen(d: number | undefined) {
    return !d || isNaN(d) ? 0: d;
}