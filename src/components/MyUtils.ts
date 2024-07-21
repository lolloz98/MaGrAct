// it appears that when we get dimens from re-flex there are some conversion problems
// this solves the issue
export function convertDimen(d: number | undefined) {
    return !d || isNaN(d) ? 0: d;
}