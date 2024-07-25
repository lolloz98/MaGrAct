import { Group, Line, Rect } from "react-konva";
import { useContext } from 'react';
import { TimeContext } from '../TimeContext';
import { DispactherAction } from "../StoreContext";
import { computeColorDissolvenceAnimation, getCommonProps, getDraggableProps, getLineColorProps, getPositionAndScaleProps, getPositionProps, getScaleProps } from "../Utils";
import FunctionState, { Axis } from "../states/FunctionState";
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

    const step = window.innerWidth === 0? 0 : (state.x_bounds.max - state.x_bounds.min) / window.innerWidth;

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
                points_of_points[points_of_points.length - 1].push(x * state.x_axis.unit_scale);
                points_of_points[points_of_points.length - 1].push(y * state.y_axis.unit_scale);
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

    const axisCommonProps = {
        ...commonProps
    }

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

    const x_col = computeColorDissolvenceAnimation(state, t, (state) => (state as FunctionState).x_axis.color);
    const y_col = computeColorDissolvenceAnimation(state, t, (state) => (state as FunctionState).y_axis.color);

    function computeMarks(axis: Axis) {
        const mark_pos = computeMarksPos(axis.bounds.min, axis.bounds.max, axis.marks.each, axis.marks.visible);
        const thick = axis.thickness;
        const mark_width = axis.thickness * 6;
        const marks = [];
        for (let i = 0; i < mark_pos.length; i++) {
            marks.push((<Rect 
                {...commonProps}
                stroke={x_col}
                y={- mark_width / 2}
                x={(mark_pos[i]) * axis.unit_scale}
                strokeWidth={thick / axis.unit_scale}
                height={mark_width} 
                visible={axis.marks.visible}
                scaleX={axis.unit_scale}
                key={i} />))
        }
        return marks;
    }

    const x_marks = computeMarks(state.x_axis);
    const y_marks = computeMarks(state.y_axis);

    // todo remove nest
    return (<Group
        {...groupProps}
    >   
        <Group {...commonProps} visible={state.x_axis.visible}>
            <Line
                {...axisCommonProps}
                points={x_axis}
                stroke={x_col}
                scaleX={state.x_axis.unit_scale}
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
                scaleY={state.y_axis.unit_scale}
                x={0}
                y={0}
            />
            <Group {...commonProps} rotation={90}>
                {y_marks}
            </Group>
        </Group>
        <Group {...commonProps}>
            {fns}
        </Group>
    </Group>);
}