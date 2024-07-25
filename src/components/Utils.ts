import Konva from "konva";
import BaseState from "./states/BaseState";
import { DispactherAction } from "./StoreContext";
import { KonvaEventObject } from "konva/lib/Node";
import FunctionState, { Axis, Bounds } from "./states/FunctionState";
import { compile, evaluate } from "mathjs";
import { isNaN as mathjsIsNan } from 'mathjs';

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
    if (c > 255) c = 255;
    var hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
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

export function computeColorDissolvenceAnimation(state: BaseState, curTime: number, getColor: ((state: BaseState) => string) = (s) => s.color): string {
    let color = getColor(state);
    const startTime = state.time_constraint.start;
    const endTime = state.time_constraint.end;
    const animStartDuration = state.animation.start_duration;
    const animEndDuration = state.animation.end_duration;
    if (curTime >= startTime && curTime < startTime + animStartDuration && animStartDuration !== 0) {
        const rgba = myHexToRgba(color);
        if (rgba !== null) {
            rgba.a = lerp(0, rgba.a, (curTime - startTime) / animStartDuration)
            color = myRgbaToHex(rgba);
        }
    }
    if (curTime < endTime && curTime > endTime - animEndDuration && animEndDuration !== 0) {
        const rgba = myHexToRgba(color);
        if (rgba !== null) {
            rgba.a = lerp(0, rgba.a, (endTime - curTime) / animEndDuration)
            color = myRgbaToHex(rgba);
        }
    }
    return color;
}

export function getLineColorProps(state: BaseState, currentTime: number) {
    return {
        stroke: computeColorDissolvenceAnimation(state, currentTime),
        strokeWidth: (state as FunctionState)? (state as FunctionState).strokeWidth : 0.1
    };
}

export function getPositionProps(state: BaseState) {
    return {
        x: state.position.x,
        y: state.position.y,
    };
} 

export function getScaleProps(state: BaseState) {
    return {
        scaleX: state.scale.x,
        scaleY: state.scale.y
    };
}

export function getPositionAndScaleProps(state: BaseState) {
    return {
        ...getPositionProps(state),
        ...getScaleProps(state)
    };
}

export function getDraggableProps(state: BaseState, dispatch: DispactherAction) {
    return {
        draggable: true,
        onDragEnd: ((e: KonvaEventObject<DragEvent>) => {
            e.cancelBubble = true;
            dispatch({ type: "modify", id: state.id, modifiers: [(s) => { s.position.x = e.target.x(); s.position.y = e.target.y()}] })
        })
    };
}

export function isVisible(state: BaseState, currentTime: number) {
    return currentTime >= state.time_constraint.start && currentTime < state.time_constraint.end;
}

export function getCommonProps(state: BaseState, currentTime: number) {
    return {
        visible: isVisible(state, currentTime),
        name: state.id,
        onClick: () => console.debug(`${state.type} clicked: ${state.id}`)
    }
};

export function scaleAndFlipXandY(val: number, modifiers: AxisModifications) {
    return modifiers.flip? -val * modifiers.unit: val * modifiers.unit;
}


export function myRange(min: number, max: number, step: number = 1) {
    const len = max - min;
    const arr = [];
    for (let i = 0; i < len; i += step) {
        arr.push(min + i);
    }
    return arr;
}

/**
 * @param fn function string
 * @param x AxisModification is useful only if onlyOutput is false
 * @returns list of lists of connected point in the shape [x_0, y_0, x_1, y_1...]. If only output then [[y_0, y_1 ...]...]
 * A list of lists is returned so that we can disconnect functions if the value computed for a certain x is out of bounds.
 * @onError returns empty list
 */
export function evalFnAndGetPoints(fn: string, x: ((Bounds & {granularity: number}) | number[]) & AxisModifications, y: Bounds & AxisModifications, onlyOutput: boolean = false) {
    let in_val = [];
    if ((x as Bounds).max !== undefined) {
        const b = x as (Bounds & {granularity: number});
        in_val = myRange(b.min, b.max, b.granularity);
    } else {
        in_val = (x as number[]);
    }

    const expr = compile(fn);

    const points_of_points: number[][] = [[]];
    for (const x_val of in_val) {
        const scope = {
            x: x_val
        };
        try {
            const y_val = expr.evaluate(scope);
            if (y_val === undefined || isNaN(y_val) || y_val === Infinity || y_val < y.min || y_val > y.max) {
                points_of_points.push([]);
            } else {
                if (!onlyOutput) points_of_points[points_of_points.length - 1].push(scaleAndFlipXandY(x_val, x));
                points_of_points[points_of_points.length - 1].push(scaleAndFlipXandY(y_val, y));
            }
        } catch (e) {
            console.error(`There was an error evaluating f(${x_val}), f(x)=${fn}:`, e);
            return [];
        }
    }
    return points_of_points;
}

export interface AxisModifications {
    flip: boolean,
    unit: number
}

export function extractFromAxis(a: Axis): Bounds & AxisModifications {
    return {
        min: a.bounds.min,
        max: a.bounds.max,
        unit: a.unit_scale,
        flip: a.flip
    };
}
