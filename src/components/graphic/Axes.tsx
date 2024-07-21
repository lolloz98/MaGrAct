import { Circle, Group, Line, Text } from "react-konva";
import { useContext } from 'react';
import { TimeContext } from '../TimeContext';
import { DispactherAction } from "../StoreContext";
import BaseState from "../states/BaseState";
import { getCommonProps, getDraggableProps, getLineColorProps, getPositionAndScaleProps, getScaleProps } from "../Utils";


export default function Axes({ state, dispatch }: { state: BaseState, dispatch: DispactherAction }) {
    const x_axis: number[] = [-100, 0, 100, 0]
    const y_axis: number[] = [0, -100, 0, 100]
    const t = useContext(TimeContext);

    const step = 0.05;

    const dummy_function: number[] = [];
    for (let x = -4; x < 4; x += step) {
        dummy_function.push(x);
        dummy_function.push(Math.sin(x));
    }

    const groupProps = {
        ...getDraggableProps(state, dispatch),
        ...getCommonProps(state, t),
        ...getPositionAndScaleProps(state)
    };

    const axisCommonProps = {
        ...getCommonProps(state, t)
    }

    const fnProps = {
        ...getCommonProps(state, t),
        ...getLineColorProps(state, t)
    }


    // todo remove nest
    return (<Group
        {...groupProps}
    >   
        <Line
            {...axisCommonProps}
            points={x_axis}
            stroke='#ffffffff'
            strokeWidth={state.scale.x === 0? 0 : 4 / state.scale.x}
            x={0}
            y={0}
        />
        <Line
            {...axisCommonProps}
            points={y_axis}
            stroke='white'
            strokeWidth={state.scale.y === 0? 0 : 4 / state.scale.y}
            x={0}
            y={0}
        />
        <Line
            points={dummy_function}
            {...fnProps}
            x={0}
            y={0}
        />
    </Group>);
}