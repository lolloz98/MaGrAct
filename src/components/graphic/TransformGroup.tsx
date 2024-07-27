import { ReactElement, ReactNode, useContext } from "react";
import MyGroupState from "../states/MyGroupState";
import { DispactherAction } from "../StoreContext";
import { Circle, Group } from "react-konva";
import { getCommonProps, getDraggableProps, getPositionAndScaleProps } from "../Utils";
import { TimeContext } from "../TimeContext";
import { evaluate, isNaN } from "mathjs";
import GroupTransformState, { MyAnim } from "../states/GroupTransformState";

function ev(myAnim: MyAnim, inp: number, def: number = 0): number {
    const { start, end, fn } = myAnim;
    if (inp < start) {
        return def;
    }
    if (inp > end) {
        inp = end;
    }
    try {
        const y = evaluate(fn, { t: inp, dt: inp - start });
        if (y === undefined || isNaN(y) || y === Infinity) {
            console.warn(`f(t)=${fn} has not valid output for t=${inp}. Returning ${def} as computed value`);
            return def;
        }
        return y;
    } catch(e) {
        console.warn(`An error happened while computing f(t)=${fn} for t=${inp}. Returning ${def} as computed value`);
        return def;
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
                scaleX={ev(state.scale_x_anim, t, 1)}
                scaleY={ev(state.scale_y_anim, t, 1)}
                rotation={ev(state.rotate_anim, t)}
                x={ev(state.move_x_anim, t)}
                y={ev(state.move_y_anim, t)}
                >
                {children}
                <Circle
                visible={state.isGizmosVisible}
                fill={state.color}
                rotation={45}
                scaleX={1 / state.scale.x}
                scaleY={1 / state.scale.y}
                radius={15}
                />
            </Group>
        </Group>
    )
}