import BaseState from "./BaseState";

export default interface FunctionState extends BaseState {
    fn: string,
    strokeWidth: number,
    x_axis: Axis,
    y_axis: Axis,
    x_bounds: {
        min: number,
        max: number
    },
    y_bounds: {
        min: number,
        max: number
    }
};

export interface Axis {
    unit_scale: number,
    flip: boolean,
    bounds: {
        min: number,
        max: number
    },
    thickness: number,
    visible: boolean,
    marks: {
        visible: boolean,
        each: number
    },
    color: string
}

export function getDefaultAxis(flip: boolean): Axis {
    return {
        unit_scale: 100,
        flip: flip,
        bounds: {
            min: -4,
            max: 4
        },
        thickness: 4,
        visible: true,
        marks: {
            visible: true,
            each: 1
        },
        color: "#ffffffff"
    }
}

export function getDefaultFunctionState(state: BaseState): FunctionState {
    state.scale.x = 1;
    state.scale.y = 1;
    return {
        fn: "cos(x)",
        strokeWidth: 8,
        x_axis: getDefaultAxis(false),
        y_axis: getDefaultAxis(true),
        x_bounds: {
            min: -4,
            max: 4
        },
        y_bounds: {
            min: -4,
            max: 4
        },
        ...state
    };
}