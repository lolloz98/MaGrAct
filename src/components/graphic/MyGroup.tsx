import { ReactNode, useContext } from "react";
import MyGroupState from "../states/MyGroupState";
import { DispactherAction } from "../StoreContext";
import { Circle, Group } from "react-konva";
import { getCommonProps, getDraggableProps, getPositionAndScaleProps } from "../Utils";
import { TimeContext } from "../TimeContext";

export default function MyGroup({ state, dispatch, children }: { 
    state: MyGroupState, 
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
            {children}
            <Circle
                {...commonProps}
                visible={state.isGizmosVisible}
                scaleX={1 / state.scale.x}
                scaleY={1 / state.scale.y}
                radius={10}
                fill={state.color}
                stroke={state.color}
                />
        </Group>
    )
}