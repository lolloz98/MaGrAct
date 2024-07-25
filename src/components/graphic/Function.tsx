import { Group, Line, Rect } from "react-konva";
import { useContext } from 'react';
import { TimeContext } from '../TimeContext';
import { DispactherAction } from "../StoreContext";
import { computeColorDissolvenceAnimation, evalFnAndGetPoints, getCommonProps, getDraggableProps, getLineColorProps, getPositionAndScaleProps, getPositionProps, getScaleProps, scaleAndFlipXandY } from "../Utils";
import FunctionState, { Axis } from "../states/FunctionState";
import { compile, evaluate, isNaN } from "mathjs";
import { AxisGraphic } from "./AxisGraphic";


export default function Function({ state, dispatch }: { state: FunctionState, dispatch: DispactherAction }) {
    const t = useContext(TimeContext);

    const commonProps = getCommonProps(state, t);

    const groupProps = {
        ...getDraggableProps(state, dispatch),
        ...commonProps,
        ...getPositionAndScaleProps(state)
    };

    const fnProps = {
        ...commonProps,
        ...getLineColorProps(state, t)
    }

    const points_of_points = evalFnAndGetPoints(state.fn, state.x_axis, state.y_axis);

    const fns = [];
    for (let i = 0; i < points_of_points.length; i++) {
        fns.push((<Line
            points={points_of_points[i]}
            {...fnProps}
            x={0}
            y={0}
            key={i}
        />))
    }

    return (<Group
        {...groupProps}
    >   
        <AxisGraphic axis={state.x_axis} state={state} dir={'x'} />
        <AxisGraphic axis={state.y_axis} state={state} dir={'y'} />
        {fns}
    </Group>);
}