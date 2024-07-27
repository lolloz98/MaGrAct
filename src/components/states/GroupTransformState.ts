import BaseState from "./BaseState";
import MyGroupState, { getDefaultMyGroupState } from "./MyGroupState";

export interface MyAnim {
    start: number,
    end: number,
    fn: string
}

export default interface GroupTransformState extends MyGroupState {
    move_x_anim: MyAnim,
    move_y_anim: MyAnim,
    scale_x_anim: MyAnim,
    scale_y_anim: MyAnim,
    rotate_anim: MyAnim
}


export function getDefaultGroupTransformState(state: BaseState) {
    const defAnim = {
        start: state.time_constraint.start,
        end: state.time_constraint.end,
        fn: "0"
    };
    return {
        ...getDefaultMyGroupState(state),
        move_x_anim: { ...defAnim },
        move_y_anim: { ...defAnim },
        scale_x_anim: { ...defAnim, fn: "1"  },
        scale_y_anim: { ...defAnim, fn: "1"  },
        rotate_anim: { ...defAnim }
    }
}