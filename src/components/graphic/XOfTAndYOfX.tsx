import { useContext } from "react";
import { TimeContext } from "../TimeContext";
import { evalFnAndGetPoints, extractFunctionInfo, getCommonProps, getDraggableProps, getLineColorProps, getListOfPoints, getPositionAndScaleProps } from "../Utils";
import FunctionState from "../states/FunctionState";
import { DispactherAction } from "../StoreContext";
import XOfTAndYOfXState from "../states/XOfTAndYOfXState";
import { Group, Line } from "react-konva";
import { AxisGraphic } from "./AxisGraphic";
import { min } from "mathjs";

export default function XOfTAndYOfX({ state, dispatch }: { state: XOfTAndYOfXState, dispatch: DispactherAction }) {
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

    let tTillPoints: number[] = [];
    if (t >= state.time_constraint.start)
        tTillPoints = getListOfPoints({
            min: state.time_constraint.start,
            max: min(t, state.time_constraint.end), 
            granularity: state.granularity}
        );

    // transformations for x will happen when we compute y!
    const xForT = extractFunctionInfo(state.x_axis, state.x_bounds);
    xForT.unit = 1;
    xForT.flip = false;

    const xPoints = evalFnAndGetPoints(
        state.xOft, 
        { points: [tTillPoints], unit: 1, flip: false}, 
        xForT, true, (i) => ({ t: i }));

    const points_of_points = evalFnAndGetPoints(
        state.fn,
        { points: xPoints, ...extractFunctionInfo(state.x_axis, state.x_bounds) },
        extractFunctionInfo(state.y_axis, state.y_bounds)
    );

    const fns = [];

    // todo: here we should display only points up to t if sticky. If not only last point
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
        <AxisGraphic key={"x_axis"} axis={state.x_axis} state={state} dir={'x'} />
        <AxisGraphic key={"y_axis"} axis={state.y_axis} state={state} dir={'y'} />
        {fns}
    </Group>);
}