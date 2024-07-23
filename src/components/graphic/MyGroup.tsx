import { ReactElement, ReactNode, useContext } from "react";
import MyGroupState from "../states/MyGroupState";
import { DispactherAction } from "../StoreContext";
import { Group } from "react-konva";
import { getCommonProps, getPositionAndScaleProps } from "../Utils";
import { TimeContext } from "../TimeContext";

export default function MyGroup({ state, dispatch, children }: { 
    state: MyGroupState, 
    dispatch: DispactherAction, 
    children: ReactNode 
}) {
    const t = useContext(TimeContext);
    const props = {
        ...getCommonProps(state, t),
        ...getPositionAndScaleProps(state)
    }
    return (
        <Group {...props}>
            {children}
        </Group>
    )
}