import BaseState from "./BaseState";

export default interface MyGroupState extends BaseState {
    children: BaseState[],
    isOpen: boolean,
    isGizmosVisible: boolean
}

export function getDefaultMyGroupState(state: BaseState): MyGroupState {
    state.isParent = true;
    state.position.x = 0;
    state.position.y = 0;
    state.scale.x = 1;
    state.scale.y = 1;
    state.animation.start_duration = 0;
    state.animation.end_duration = 0;
    return {
        ...state,
        children: [],
        isOpen: false,
        isGizmosVisible: true
    };
}