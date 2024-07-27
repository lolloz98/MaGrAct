import { ReactElement, ReactNode, useContext } from "react";
import MyGroupState from "../states/MyGroupState";
import { DispactherAction } from "../StoreContext";
import { Circle, Group } from "react-konva";
import { getCommonProps, getDraggableProps, getPositionAndScaleProps } from "../Utils";
import { TimeContext } from "../TimeContext";
import { evaluate, isNaN } from "mathjs";
import GroupTransformState, { MyAnim } from "../states/GroupTransformState";

function ev(myAnim: MyAnim, inp: number): number {
    const { start, end, fn } = myAnim;
    if (inp < start) {
        return 0;
    }
    if (inp > end) {
        inp = end;
    }
    try {
        const y = evaluate(fn, { t: inp });
        if (y === undefined || isNaN(y) || y === Infinity) {
            console.warn(`f(t)=${fn} has not valid output for t=${inp}. Returning 0 as computed value`);
            return 0;
        }
        return y;
    } catch(e) {
        console.warn(`An error happened while computing f(t)=${fn} for t=${inp}. Returning 0 as computed value`);
        return 0;
    }
}

export default function TransformGroup({ state, dispatch, children }: { 
    state: GroupTransformState, 
    dispatch: DispactherAction, 
    children: ReactNode 
}) {
    const t = useContext(TimeContext);
    const commonProps = getCommonProps(state, t);
    const props = {
        ...commonProps,
        ...getPositionAndScaleProps(state),
        ...getDraggableProps(state, dispatch)
    }
    return (
        <Group {...props}>
            <Group {...commonProps}
                scaleX={1 + ev(state.scale_x_anim, t)}
                scaleY={1 + ev(state.scale_y_anim, t)}
                rotation={ev(state.rotate_anim, t)}
                x={ev(state.move_x_anim, t)}
                y={ev(state.move_y_anim, t)}
                >
                {children}
            </Group>
            <Circle
                fill={state.color}
                rotation={45}
                scaleX={1 / state.scale.x}
                scaleY={1 / state.scale.y}
                radius={15}
                />
        </Group>
    )
}