import ComponentEnum from "./ComponentEnum";
import FunctionAnimated from "./FunctionAnimated";
import Function from "./Function"
import uuid from "react-uuid";
import BaseModifier from "./BaseModifier";
import FunctionModifier, { FunctionState } from "./FunctionModifier";
import { DispactherAction } from "./StateContext";

export interface BaseState {
    id: string,
    type: ComponentEnum,
    offset: {
        x: number,
        y: number
    }
}

export function createDefaultState(type: ComponentEnum) : BaseState {
    const id = uuid();
    const obj: BaseState = {
        id: id,
        type: type,
        offset: {
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

export function getComponent(state: BaseState) {
    switch (state.type) {
        case ComponentEnum.FUNCTION:
            return (<Function state={state} key={state.id}></Function>);
        case ComponentEnum.FUNCTION_ANIM:
            return (<FunctionAnimated state={state} key={state.id}></FunctionAnimated>);
        default:
            alert(`No getComponent specified for ${state.type}`);
    }
}

export function getModifier(state: BaseState, dispacth: DispactherAction) {
    switch (state.type) {
        case ComponentEnum.FUNCTION:
            return (<FunctionModifier state={state as FunctionState} dispatch={dispacth} key={state.id}></FunctionModifier>);
        case ComponentEnum.FUNCTION_ANIM:
            return (<BaseModifier state={state} dispatch={dispacth} key={state.id}></BaseModifier>);
        default:
            alert(`No getComponent specified for ${state.type}`);
    }
}

// todo: handle nested objects
export function isContained(ids: string[], state: BaseState) {
    return ids.includes(state.id);
}