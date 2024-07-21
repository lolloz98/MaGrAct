import Konva from "konva";
import BaseState from "./states/BaseState";
import { DispactherAction } from "./StoreContext";
import { KonvaEventObject } from "konva/lib/Node";

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

export function computeColorDissolvenceAnimation(state: BaseState, curTime: number): string {
    let color = state.color;
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
        strokeWidth: 0.1
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
            const newState = {...state};
            newState.position.x = e.target.x();
            newState.position.y = e.target.y();
            dispatch({ type: "modify", state: newState })
        })
    };
}

export function getCommonProps(state: BaseState, currentTime: number) {
    return {
        visible: currentTime >= state.time_constraint.start && currentTime < state.time_constraint.end,
        name: state.id,
        onClick: () => console.debug(`${state.type} clicked: ${state.id}`)
    }
};