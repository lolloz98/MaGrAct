import BaseState from "./BaseState";

export default interface KatexState extends BaseState {
    fn: string
}

export function getDefaultKatexState(state: BaseState) {
    return {
        ...state,
        fn: "\\cos x"
    };
}