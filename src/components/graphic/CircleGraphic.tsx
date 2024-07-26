import { useContext } from "react";
import { DispactherAction } from "../StoreContext";
import { TimeContext } from "../TimeContext";
import { computeColorDissolvenceAnimation, getCommonProps, getDraggableProps, getPositionAndScaleProps } from "../Utils";
import { Circle } from "react-konva";
import CircleState from "../states/CircleState";

export default function CircleGraphic({ state, dispatch }: { state: CircleState, dispatch: DispactherAction }) {
    const t = useContext(TimeContext);
    const commonProps = getCommonProps(state, t);

    const groupProps = {
        ...getDraggableProps(state, dispatch),
        ...commonProps,
        ...getPositionAndScaleProps(state)
    };

    return (
        <Circle 
            {...groupProps}
            radius={state.radius}
            fill={computeColorDissolvenceAnimation(state, t, s => s.color)}
            key={state.id}
        />
    )
}