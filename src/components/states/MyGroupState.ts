import BaseState from "./BaseState";

export default interface MyGroupState extends BaseState {
    children: BaseState[]
}

export function getDefaultMyGroupState(state: BaseState): MyGroupState {
    state.isParent = true;
    return {
        ...state,
        children: []
    };
}