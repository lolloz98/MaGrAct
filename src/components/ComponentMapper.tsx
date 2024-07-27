import ComponentEnum from "./ComponentEnum";
import FunctionAnimated from "./graphic/FunctionAnimated";
import uuid from "react-uuid";
import BaseControl from "./controls/BaseControl";
import FunctionControl from "./controls/FunctionControl";
import { DispactherAction, MyStore } from "./StoreContext";
import BaseState, { getDefaultBaseState } from "./states/BaseState";
import FunctionState, { getDefaultFunctionState } from "./states/FunctionState";
import { ReactElement } from "react";
import { NodeModel } from "@minoru/react-dnd-treeview";
import MyKatex from "./graphic/MyKatex";
import KatexState, { getDefaultKatexState } from "./states/KatexState";
import KatexControl from "./controls/KatexControl";
import Function from './graphic/Function';
import MyGroupControl from "./controls/MyGroupControl";
import MyGroupState, { getDefaultMyGroupState } from "./states/MyGroupState";
import MyGroup from "./graphic/MyGroup";
import XOfTAndYOfXState, { getDefaultXOfTAndYOfXState } from "./states/XOfTAndYOfXState";
import XOfTAndYOfX from "./graphic/XOfTAndYOfX";
import XOfTAndYOfXControl from "./controls/XOfTAndYOfXControl";
import CircleState, { getDeafultCircleState } from "./states/CircleState";
import CircleGraphic from "./graphic/CircleGraphic";
import CircleControl from "./controls/CircleControl";
import TransformGroup from "./graphic/TransformGroup";
import GroupTransformState, { getDefaultGroupTransformState } from "./states/GroupTransformState";
import GroupTransformControl from "./controls/GroupTransformControl";

export function createDefaultState(type: ComponentEnum, title: string | undefined, maxTime: number): BaseState {
    const id = uuid();
    const obj = getDefaultBaseState(id, type, title, maxTime);
    switch (type) {
        case ComponentEnum.FUNCTION:
            return getDefaultFunctionState(obj);
        case ComponentEnum.FUNCTION_ANIM:
            return obj;
        case ComponentEnum.LATEX:
            obj.scale.x = 1;
            obj.scale.y = 1;
            return getDefaultKatexState(obj);
        case ComponentEnum.GROUP:
            return getDefaultMyGroupState(obj);
        case ComponentEnum.GROUP_TRANSFORM:
            return getDefaultGroupTransformState(obj);
        case ComponentEnum.X_OF_T_AND_Y_OF_X:
            return getDefaultXOfTAndYOfXState(obj);
        case ComponentEnum.CIRCLE:
            return getDeafultCircleState(obj);
        default:
            console.error(`No default state specified for component ${type}`);
            obj.type = ComponentEnum.UNKOWN;
            return obj;
    }
}

function getTreeElem(state: BaseState, parent: Map<string, string>) {
    return {
        id: state.id,
        parent: parent.get(state.id) ?? 0,
        droppable: state.isParent ?? false,
        text: state.title,
        data: state
    };
}

export type MyTreeElement = NodeModel<BaseState>;

function getJsxOrUndefined(jsx: ReactElement, state: BaseState, curTime: number) {
    if (curTime < state.time_constraint.start || curTime > state.time_constraint.end) {
        return undefined;
    }
    return jsx;
}

function getCompForGroup(state: MyGroupState, dispacth: DispactherAction, children: ReactElement[]) {
    switch (state.type) {
        case ComponentEnum.GROUP:
            return (<MyGroup state={state as MyGroupState} dispatch={dispacth} key={state.id}>{children}</MyGroup>)
        case ComponentEnum.GROUP_TRANSFORM:
            return (<TransformGroup state={state as GroupTransformState} dispatch={dispacth} key={state.id}>{children}</TransformGroup>)
    }
    throw Error(`${state.type} not found in getCompForGroup`)
}

export function getComponent(state: BaseState, dispacth: DispactherAction, store: MyStore, curTime: number): {
    jsx?: ReactElement,
    treeEl: MyTreeElement[],
    selectedEl?: BaseState
} {
    let treeEl: MyTreeElement[] = [getTreeElem(state, store.parent)];
    let selectedEl = undefined;
    let jsx = undefined;
    if (state.id === store.selected_from_list) {
        selectedEl = state;
    }
    switch (state.type) {
        case ComponentEnum.FUNCTION:
            jsx = getJsxOrUndefined(
                (<Function state={state as FunctionState} dispatch={dispacth} key={state.id}></Function>),
                state,
                curTime
            );
            break;
        case ComponentEnum.FUNCTION_ANIM:
            jsx = getJsxOrUndefined(
                (<FunctionAnimated state={state} dispatch={dispacth} key={state.id}></FunctionAnimated>),
                state,
                curTime);
            break;
        case ComponentEnum.LATEX:
            jsx = getJsxOrUndefined(
                (<MyKatex state={state as KatexState} dispatch={dispacth} key={state.id} />),
                state,
                curTime);
            break;
        case ComponentEnum.GROUP:
        case ComponentEnum.GROUP_TRANSFORM:
            const children = [];
            for (const c of (state as MyGroupState).children) {
                const cc = getComponent(c, dispacth, store, curTime);
                if (cc.jsx !== undefined) children.push(cc.jsx);
                treeEl = treeEl.concat(cc.treeEl);
                if (cc.selectedEl !== undefined) {
                    selectedEl = cc.selectedEl;
                }
            }
            jsx = getJsxOrUndefined(
                getCompForGroup(state as MyGroupState, dispacth, children),
                state,
                curTime);
            break;
        case ComponentEnum.X_OF_T_AND_Y_OF_X:
            jsx = getJsxOrUndefined(
                (<XOfTAndYOfX state={state as XOfTAndYOfXState} dispatch={dispacth} key={state.id}/>),
                state,
                curTime);
            break;
        case ComponentEnum.CIRCLE:
            jsx = getJsxOrUndefined(
                (<CircleGraphic state={state as CircleState} dispatch={dispacth} key={state.id}/>),
                state,
                curTime);
            break;
        default:
            alert(`No getComponent specified for ${state.type}`);
    }
    return {
        jsx: jsx,
        treeEl: treeEl,
        selectedEl: selectedEl
    }
}

export function getModifier(state: BaseState, dispacth: DispactherAction) {
    switch (state.type) {
        case ComponentEnum.FUNCTION:
            return (<FunctionControl state={state as FunctionState} dispatch={dispacth} key={state.id} />);
        case ComponentEnum.FUNCTION_ANIM:
            return (<BaseControl state={state} dispatch={dispacth} key={state.id}></BaseControl>);
        case ComponentEnum.LATEX:
            return (<KatexControl state={state as KatexState} dispatch={dispacth} key={state.id} />);
        case ComponentEnum.GROUP:
            return (<MyGroupControl state={state as MyGroupState} dispatch={dispacth} key={state.id} />);
        case ComponentEnum.GROUP_TRANSFORM:
            return (<GroupTransformControl state={state as GroupTransformState} dispatch={dispacth} key={state.id} />);
        case ComponentEnum.X_OF_T_AND_Y_OF_X:
            return (<XOfTAndYOfXControl state={state as XOfTAndYOfXState} dispatch={dispacth} key={state.id} />);
        case ComponentEnum.CIRCLE:
            return (<CircleControl state={state as CircleState} dispatch={dispacth} key={state.id} />);
        default:
            alert(`No getModifier specified for ${state.type}`);
    }
}

// todo: handle nested objects
export function isContained(ids: string[], state: BaseState) {
    return ids.includes(state.id);
}