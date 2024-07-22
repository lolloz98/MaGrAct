import BaseState from "./BaseState";

export default interface FunctionState extends BaseState {
    fn: string,
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

export function getDefaultAxis(): Axis {
    return {
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
    return {
        fn: "cos(x)",
        x_axis: getDefaultAxis(),
        y_axis: getDefaultAxis(),
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