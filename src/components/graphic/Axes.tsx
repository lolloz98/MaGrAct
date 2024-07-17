import { Circle, Group, Line, Text } from "react-konva";
import { useContext } from 'react';
import { TimeContext } from '../TimeContext';
import { DispactherAction } from "../StoreContext";
import BaseState from "../states/BaseState";


export default function Axes({ state, dispatch }: { state: BaseState, dispatch: DispactherAction }) {
    const x_axis: number[] = [-100, 0, 100, 0]
    const y_axis: number[] = [0, -100, 0, 100]

    // todo remove nest
    return (<Group
        draggable
        onClick={() => console.log("group with axes clicked")}
        onDragEnd={(e) => {
            console.log("axes drag ended");
            const newState = {...state};
            newState.position.x = e.target.x();
            newState.position.y = e.target.y();
            dispatch({ type: "modify", state: newState })
        }}
        x={state.position.x}
        y={state.position.y}
        name={state.id}
    >   
        <Line
            onClick={() => console.log("x axis clicked")}
            points={x_axis}
            stroke='white'
            strokeWidth={10}
            name={state.id}
            x={0}
            y={0}
        />
        <Line
            onClick={() => console.log("y axis clicked")}
            points={y_axis}
            stroke='white'
            strokeWidth={10}
            name={state.id}
            x={0}
            y={0}
        />
        <Circle x={0} y={0} radius={5} fill={"blue"}></Circle>
        <Circle x={10} y={10} radius={5} fill={"red"}></Circle>

    </Group>);
}