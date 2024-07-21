import { Group, Line, Text } from "react-konva";
import { useContext } from 'react';
import { TimeContext } from '../TimeContext';
import FunctionState from "../states/FunctionState";
import { DispactherAction } from "../StoreContext";
import { hexToRgb } from "@mui/material";
import { computeColorDissolvenceAnimation, getCommonProps, getDraggableProps, getLineColorProps, getPositionAndScaleProps, lerp, myHexToRgba, myRgbaToHex } from "../Utils";


export default function Function({ state, dispatch }: { state: FunctionState, dispatch: DispactherAction }) {
    const timeC = useContext(TimeContext);
    const points: number[] = []
    const f = (x: number) => Math.sin(x);
    const bounds = {
        x_min: -3,
        x_max: 3
    }

    // here we use a constant step, but for sure it's not best solution
    // it would be better to use something tight to the first and second derivative
    const step = 0.01;

    // todo wrap this in useEffect
    for (let i = bounds.x_min; i <= bounds.x_max; i += step) {
        points.push(i);
        points.push(f(i));
    }

    const props = {
        ...getCommonProps(state, timeC),
        ...getDraggableProps(state, dispatch),
        ...getPositionAndScaleProps(state),
        ...getLineColorProps(state, timeC)
    }

    // todo remove nest
    return (
        <Line
            points={points}
            {...props}
        />);
}