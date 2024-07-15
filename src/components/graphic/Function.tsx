import { Group, Line, Text } from "react-konva";
import { useContext } from 'react';
import { TimeContext } from '../TimeContext';
import FunctionState from "../states/FunctionState";
import { DispactherAction } from "../StoreContext";


export default function Function({ state, dispatch }: { state: FunctionState, dispatch: DispactherAction }) {
    const timeC = useContext(TimeContext);
    const points: number[] = []
    const f = (x: number) => Math.sin(x / 100) * 100;
    const bounds = {
        x_min: 0,
        x_max: 2500
    }

    // here we use a constant step, but for sure it's not best solution
    // it would be better to use something tight to the first and second derivative
    const step = 0.1;

    for (let i = bounds.x_min; i <= bounds.x_max; i += step) {
        points.push(i);
        points.push(f(i));
    }

    // todo remove nest
    return (<Group
        onClick={() => console.log("group with normal function clicked")}
    >
        <Line
            onClick={() => console.log("normal function clicked")}
            points={points}
            draggable
            onDragEnd={(e) => {
                const newState = {...state};
                newState.position.x = e.target.x();
                newState.position.y = e.target.y();
                dispatch({ type: "modify", state: newState })
            }}
            stroke='blue'
            strokeWidth={30}
            name={state.id}
            x={state.position.x}
            y={state.position.y}
        />
        <Text text={`${timeC}`} offsetX={-500} fontSize={15} fill={"white"} />
    </Group>);
}