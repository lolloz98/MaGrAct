import { createContext } from 'react';
import BaseState from './states/BaseState';

export interface MyStore {
    parent: Map<string, string> // each object has a parent, by navigating this object we can navigate to it
    components: Array<BaseState>
    selected: Array<string>,
    titles: Set<string>,
    selected_from_list?: BaseState
}

export type StoreAction = {
    type: "delete",
    id: string
} | {
    type: "add",
    state: BaseState
} | {
    type: "modify",
    state: BaseState
} | {
    type: "reset"
} | {
    type: 'changeSelection',
    ids: string[] | []
} | { type: 'reorder', id: string, destinationId?: string, index: number } |
{ type: 'select_from_list', state: BaseState};

export type DispactherAction = React.Dispatch<StoreAction>;

export const initState = {
    parent: new Map<string, string>(),
    components: [],
    selected: [],
    titles: new Set<string>(),
    selected_from_list: undefined
};

export const MyStoreContext = createContext<MyStore>(initState);
