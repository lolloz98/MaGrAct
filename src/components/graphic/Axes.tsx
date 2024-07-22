import { Circle, Group, Line, Text } from "react-konva";
import { useContext } from 'react';
import { TimeContext } from '../TimeContext';
import { DispactherAction } from "../StoreContext";
import BaseState from "../states/BaseState";
import { getCommonProps, getDraggableProps, getLineColorProps, getPositionAndScaleProps, getPositionProps, getScaleProps } from "../Utils";
import FunctionState from "../states/FunctionState";
import { evaluate, isNaN } from "mathjs";


export default function Axes({ state, dispatch }: { state: FunctionState, dispatch: DispactherAction }) {
    const x_bounds = state.x_axis.bounds;
    const y_bounds = state.y_axis.bounds;
    const x_axis: number[] = [x_bounds.min, 0, x_bounds.max, 0]
    const y_axis: number[] = [0, y_bounds.min, 0, y_bounds.max]
    const t = useContext(TimeContext);

    const step = 0.05;

    const points_of_points: number[][] = [[]];
    for (let x = -4; x < 4; x += step) {
        const scope = {
            x: x
        };
        const y = evaluate(state.fn, scope);
        if (isNaN(y)) {
            points_of_points.push([]);
        } else {
            points_of_points[points_of_points.length - 1].push(x);
            points_of_points[points_of_points.length - 1].push(y);
        }
    }

    const groupProps = {
        ...getDraggableProps(state, dispatch),
        ...getCommonProps(state, t),
        ...getPositionProps(state)
    };

    const axisCommonProps = {
        ...getCommonProps(state, t)
    }

    const fnProps = {
        ...getCommonProps(state, t),
        ...getLineColorProps(state, t),
        ...getScaleProps(state)
    }

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

    // todo remove nest
    return (<Group
        {...groupProps}
    >   
        <Line
            {...axisCommonProps}
            visible={state.x_axis.visible}
            points={x_axis}
            stroke='#ffffffff'
            scaleX={state.scale.x}
            scaleY={state.x_axis.thickness}
            x={0}
            y={0}
        />
        <Line
            {...axisCommonProps}
            visible={state.y_axis.visible}
            points={y_axis}
            stroke='white'
            scaleX={state.y_axis.thickness}
            scaleY={state.scale.y}
            x={0}
            y={0}
        />
        {fns}
    </Group>);
}