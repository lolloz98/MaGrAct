import { Group, Line } from "react-konva";
import { useContext } from 'react';
import { TimeContext } from '../TimeContext';
import { DispactherAction } from "../StoreContext";
import { evalFnAndGetPoints, extractFunctionInfo, getCommonProps, getDraggableProps, getLineColorProps, getListOfPoints, getPositionAndScaleProps } from "../Utils";
import FunctionState from "../states/FunctionState";
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

    const xPoints = getListOfPoints({
        min: state.x_axis.bounds.min,
        max: state.x_axis.bounds.max, 
        granularity: state.granularity}
    );

    const points_of_points = evalFnAndGetPoints(
        state.fn, 
        { points: [xPoints], ...extractFunctionInfo(state.x_axis, state.x_bounds)}, 
        extractFunctionInfo(state.y_axis, state.y_bounds));

    const fns = [];
    for (let i = 0; i < points_of_points.length; i++) {
        fns.push((<Line
            points={points_of_points[i]}
            {...fnProps}
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