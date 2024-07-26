import BaseState from "./BaseState";

export default interface CircleState extends BaseState {
    radius: number
};

export function getDeafultCircleState(state: BaseState) {
    state.scale.x = state.scale.y = 1;
    return {
        radius: 20,
        ...state
    };
}