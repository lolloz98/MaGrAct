import { useContext } from "react";
import { Axis } from "../states/FunctionState";
import { TimeContext } from "../TimeContext";
import BaseState from "../states/BaseState";
import { computeColorDissolvenceAnimation, getCommonProps } from "../Utils";
import { Group, Line, Rect } from "react-konva";

function computeMarksPos(min: number, max: number, each: number, visible: boolean) {
    if (!visible) return [];
    const marks = [];
    for (let i = Math.floor(min / each) * each; i <= max; i += each) {
        if (i !== 0) marks.push(i);
    }
    return marks
}

export function AxisGraphic({ axis, state, dir  }: { axis: Axis, state: BaseState, dir: 'x' | 'y' }) {
    const maxi = axis.flip? -axis.bounds.min: axis.bounds.max;
    const mini = axis.flip? -axis.bounds.max: axis.bounds.min;
    const points = [mini, 0, maxi, 0];
    const t = useContext(TimeContext);
    const commonProps = getCommonProps(state, t);
    const color = computeColorDissolvenceAnimation(state, t, () => axis.color);

    function computeMarks(axis: Axis) {
        const mark_pos = computeMarksPos(mini, maxi, axis.marks.each, axis.marks.visible);
        const thick = axis.thickness;
        const mark_width = axis.thickness * 6;
        const marks = [];
        for (let i = 0; i < mark_pos.length; i++) {
            marks.push((<Rect 
                {...commonProps}
                stroke={color}
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

    return (
        <Group {...commonProps} visible={axis.visible} rotation={dir == 'x' ? 0 : 90}>
            <Line
                {...commonProps}
                points={points}
                stroke={color}
                scaleX={axis.unit_scale}
                scaleY={axis.thickness}
                x={0}
                y={0}
            />
            {computeMarks(axis)}
        </Group>
    )

}