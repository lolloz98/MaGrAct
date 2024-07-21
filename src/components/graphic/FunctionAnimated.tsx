import { Line } from "react-konva";
import { useContext } from 'react';
import { TimeContext } from '../TimeContext';
import BaseState from "../states/BaseState";
import { DispactherAction } from "../StoreContext";
import { getCommonProps, getDraggableProps, getLineColorProps, getPositionAndScaleProps } from "../Utils";


export default function FunctionAnimated({ state, dispatch }: { state: BaseState, dispatch: DispactherAction }) {
    const t = useContext(TimeContext);
    const f = (x: number) => Math.cos(x);
    const bounds = {
        x_min: -3,
        x_max: 3
    }

    // here we use a constant step, but for sure it's not best solution
    // it would be better to use something tight to the first and second derivative
    const step = 0.1;

    const points: number[] = []
    const last = (bounds.x_max - bounds.x_min) * t / (state.time_constraint.end - state.time_constraint.start) + bounds.x_min;
    for (let i = bounds.x_min; i <= last; i += step) {
        points.push(i);
        points.push(f(i));
    }


    const props = {
        ...getCommonProps(state, t),
        ...getDraggableProps(state, dispatch),
        ...getPositionAndScaleProps(state),
        ...getLineColorProps(state, t)
    }
    
    return (<Line
        points={points}
        {...props}
    />);
}