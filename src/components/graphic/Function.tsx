import { Group, Line, Rect } from "react-konva";
import { useContext } from 'react';
import { TimeContext } from '../TimeContext';
import { DispactherAction } from "../StoreContext";
import { computeColorDissolvenceAnimation, getCommonProps, getDraggableProps, getLineColorProps, getPositionAndScaleProps, getPositionProps, getScaleProps, scaleAndFlipXandY } from "../Utils";
import FunctionState, { Axis } from "../states/FunctionState";
import { compile, evaluate, isNaN } from "mathjs";
import { AxisGraphic } from "./AxisGraphic";


export default function Function({ state, dispatch }: { state: FunctionState, dispatch: DispactherAction }) {
    const t = useContext(TimeContext);

    const step = window.innerWidth === 0? 0 : (state.x_bounds.max - state.x_bounds.min) / window.innerWidth;

    const expr = compile(state.fn);

    const points_of_points: number[][] = [[]];
    for (let x = state.x_bounds.min; x < state.x_bounds.max; x += step) {
        const scope = {
            x: x
        };
        try {
            const y = expr.evaluate(scope);
            if (y === undefined || isNaN(y) || y === Infinity || y < state.y_bounds.min || y > state.y_bounds.max) {
                points_of_points.push([]);
            } else {
                points_of_points[points_of_points.length - 1].push(scaleAndFlipXandY(x, state.x_axis));
                points_of_points[points_of_points.length - 1].push(scaleAndFlipXandY(y, state.y_axis));
            }
        } catch (e) {
            console.error("There was an error evaluating function", e);
            break;
        }
    }

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
        <Group {...commonProps}>
            {fns}
        </Group>
    </Group>);
}