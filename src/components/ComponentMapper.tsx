import ComponentEnum from "./ComponentEnum";
import FunctionAnimated from "./graphic/FunctionAnimated";
import Function from "./graphic/Function"
import uuid from "react-uuid";
import BaseControl from "./controls/BaseControl";
import FunctionControl from "./controls/FunctionControl";
import { DispactherAction } from "./StoreContext";
import BaseState from "./states/BaseState";
import FunctionState from "./states/FunctionState";

export function createDefaultState(type: ComponentEnum) : BaseState {
    const id = uuid();
    const obj: BaseState = {
        id: id,
        type: type,
        position: {
            x: 50,
            y: 100
        }
    }
    switch (type) {
        case ComponentEnum.FUNCTION:
            const obj2: FunctionState = {...obj, f: ""};
            return obj2;
        case ComponentEnum.FUNCTION_ANIM:
            return obj;
        default:
            console.error(`No default state specified for component ${type}`);
            obj.type = ComponentEnum.UNKOWN;
            return obj;
    }
}

export function getComponent(state: BaseState, dispacth: DispactherAction) {
    switch (state.type) {
        case ComponentEnum.FUNCTION:
            return (<Function state={state as FunctionState} dispatch={dispacth} key={state.id}></Function>);
        case ComponentEnum.FUNCTION_ANIM:
            return (<FunctionAnimated state={state} dispatch={dispacth} key={state.id}></FunctionAnimated>);
        default:
            alert(`No getComponent specified for ${state.type}`);
    }
}

export function getModifier(state: BaseState, dispacth: DispactherAction) {
    switch (state.type) {
        case ComponentEnum.FUNCTION:
            return (<FunctionControl state={state as FunctionState} dispatch={dispacth} key={state.id}></FunctionControl>);
        case ComponentEnum.FUNCTION_ANIM:
            return (<BaseControl state={state} dispatch={dispacth} key={state.id}></BaseControl>);
        default:
            alert(`No getComponent specified for ${state.type}`);
    }
}

// todo: handle nested objects
export function isContained(ids: string[], state: BaseState) {
    return ids.includes(state.id);
}