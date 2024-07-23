import { Group, Line, Rect } from "react-konva";
import { useContext } from 'react';
import { TimeContext } from '../TimeContext';
import { DispactherAction } from "../StoreContext";
import { computeColorDissolvenceAnimation, getCommonProps, getDraggableProps, getLineColorProps, getPositionAndScaleProps, getPositionProps, getScaleProps } from "../Utils";
import FunctionState from "../states/FunctionState";
import { compile, evaluate, isNaN } from "mathjs";


function computeMarksPos(min: number, max: number, each: number, visible: boolean) {
    if (!visible) return [];
    const marks = [];
    for (let i = -each; i >= min; i -= each) {
        marks.push(i);
    }
    for (let i = each; i <= max; i += each) {
        marks.push(i);
    }
    return marks
}

export default function Function({ state, dispatch }: { state: FunctionState, dispatch: DispactherAction }) {
    const x_bounds = state.x_axis.bounds;
    const y_bounds = state.y_axis.bounds;
    const x_axis: number[] = [x_bounds.min, 0, x_bounds.max, 0]
    const y_axis: number[] = [0, y_bounds.min, 0, y_bounds.max]
    const t = useContext(TimeContext);

    const step = 0.05;

    // we mirror on y, because konva has the axis inverted
    const expr = compile(`-(${state.fn})`);

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
                points_of_points[points_of_points.length - 1].push(x);
                points_of_points[points_of_points.length - 1].push(y);
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
        ...getPositionProps(state)
    };

    const axisCommonProps = {
        ...commonProps
    }

    const fnProps = {
        ...commonProps,
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

    const x_col = computeColorDissolvenceAnimation(state, t, (state) => (state as FunctionState).x_axis.color);
    const y_col = computeColorDissolvenceAnimation(state, t, (state) => (state as FunctionState).y_axis.color);
    const x_marks_pos = computeMarksPos(state.x_axis.bounds.min, state.x_axis.bounds.max, state.x_axis.marks.each, state.x_axis.marks.visible)
    const y_marks_pos = computeMarksPos(state.y_axis.bounds.min, state.y_axis.bounds.max, state.y_axis.marks.each, state.y_axis.marks.visible)

    const x_marks = [];
    const y_marks = [];
    const mark_width = 40;
    const mark_thick = 4;

    for (let i = 0; i < x_marks_pos.length; i++) {
        x_marks.push((<Rect 
            {...commonProps}
            stroke={x_col}
            y={- mark_width / 2}
            x={(x_marks_pos[i]) * state.scale.x}
            strokeWidth={mark_thick / state.scale.x}
            height={mark_width} 
            visible={state.x_axis.marks.visible}
            scaleX={state.scale.x}
            key={i} />))
    }

    for (let i = 0; i < y_marks_pos.length; i++) {
        const thick = mark_thick / state.scale.y;
        const offset = y_marks_pos[i] > 0 ? thick/2 : -thick/2;
        y_marks.push((<Rect 
            {...commonProps}
            stroke={y_col}
            x={0}
            y={y_marks_pos[i] * state.scale.y + offset}
            strokeWidth={mark_width}
            height={thick} 
            visible={state.y_axis.marks.visible}
            scaleY={state.scale.y}
            key={i} />))
    }

    // todo remove nest
    return (<Group
        {...groupProps}
    >   
        <Group {...commonProps} visible={state.x_axis.visible}>
            <Line
                {...axisCommonProps}
                points={x_axis}
                stroke={x_col}
                scaleX={state.scale.x}
                scaleY={state.x_axis.thickness}
                x={0}
                y={0}
            />
            {x_marks}
        </Group>
        <Group {...commonProps} visible={state.y_axis.visible}>
            <Line
                {...axisCommonProps}
                points={y_axis}
                stroke={y_col}
                scaleX={state.y_axis.thickness}
                scaleY={state.scale.y}
                x={0}
                y={0}
            />
            {y_marks}
        </Group>
        <Group>
            {fns}
        </Group>
    </Group>);
}