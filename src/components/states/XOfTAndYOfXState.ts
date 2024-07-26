import BaseState from "./BaseState";
import FunctionState, { getDefaultFunctionState } from "./FunctionState";

export default interface XOfTAndYOfXState extends FunctionState {
    xOft: string
}

export function getDefaultXOfTAndYOfXState(state: BaseState) {
    const s = getDefaultFunctionState(state);
    s.granularity = 0.01;
    return {
        ...s,
        xOft: "t"
    };
}