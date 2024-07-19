import ComponentEnum from "./ComponentEnum";
import FunctionAnimated from "./graphic/FunctionAnimated";
import Function from "./graphic/Function"
import uuid from "react-uuid";
import BaseControl from "./controls/BaseControl";
import FunctionControl from "./controls/FunctionControl";
import { DispactherAction } from "./StoreContext";
import BaseState from "./states/BaseState";
import FunctionState from "./states/FunctionState";
import Axes from "./graphic/Axes";
import { ReactElement } from "react";
import { NodeModel } from "@minoru/react-dnd-treeview";

export function createDefaultState(type: ComponentEnum) : BaseState {
    const id = uuid();
    const obj: BaseState = {
        id: id,
        title: type,
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
        case ComponentEnum.AXES:
            return obj;
        default:
            console.error(`No default state specified for component ${type}`);
            obj.type = ComponentEnum.UNKOWN;
            return obj;
    }
}

export type MyTreeElement = NodeModel<BaseState>;
export function getComponent(state: BaseState, dispacth: DispactherAction): {
    jsx?: ReactElement,
    treeEl: MyTreeElement
} {
    const treeEl: MyTreeElement = {
        id: state.id,
        parent: state.parent ?? 0,
        droppable: state.isParent ?? false,
        text: state.title,
        data: state
    };
    let jsx = undefined;
    switch (state.type) {
        case ComponentEnum.FUNCTION:
            jsx = (<Function state={state as FunctionState} dispatch={dispacth} key={state.id}></Function>);
            break;
        case ComponentEnum.FUNCTION_ANIM:
            jsx = (<FunctionAnimated state={state} dispatch={dispacth} key={state.id}></FunctionAnimated>);
                    break;
        case ComponentEnum.AXES:
            jsx = (<Axes state={state} dispatch={dispacth} key={state.id}></Axes>);
            break;
        default:
            alert(`No getComponent specified for ${state.type}`);
    }
    return {
        jsx: jsx,
        treeEl: treeEl
    }
}

export function getModifier(state: BaseState, dispacth: DispactherAction) {
    switch (state.type) {
        case ComponentEnum.FUNCTION:
            return (<FunctionControl state={state as FunctionState} dispatch={dispacth} key={state.id}></FunctionControl>);
        case ComponentEnum.FUNCTION_ANIM:
            return (<BaseControl state={state} dispatch={dispacth} key={state.id}></BaseControl>);
        case ComponentEnum.AXES:
            return (<BaseControl state={state} dispatch={dispacth} key={state.id}></BaseControl>);
        default:
            alert(`No getComponent specified for ${state.type}`);
    }
}

// todo: handle nested objects
export function isContained(ids: string[], state: BaseState) {
    return ids.includes(state.id);
}