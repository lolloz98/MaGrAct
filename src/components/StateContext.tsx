import { createContext } from 'react';
import { BaseState } from './ComponentMapper';

export interface MyStore {
    parent: Map<string, string> // each object has a parent, by navigating this object we can navigate to it
    components: Array<BaseState>
    selected: Array<string>
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
};

export type DispactherAction = React.Dispatch<StoreAction>;

export const initState = {
    parent: new Map<string, string>(),
    components: [],
    selected: []
};

export const MyStoreContext = createContext<MyStore>(initState);
