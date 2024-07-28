import { createContext } from 'react';
import BaseState from './states/BaseState';
import { Patches } from 'mutative';

export interface MyStore {
    parent: Map<string, string> // each object has a parent, by navigating this object we can navigate to it
    components: Array<BaseState>
    selected: Array<string>,
    titles: Set<string>,
    selected_from_list?: string,
    step: number,
    maxTicks: number,
    tick: number
}

export type StoreAction = {
    type: "delete",
    id: string
} | {
    type: "add",
    state: BaseState,
    index: number, parent: string
} | {
    type: "modify",
    id: string,
    modifiers: ((state: BaseState) => void)[]
} | {
    type: "reset"
} | {
    type: 'changeSelection',
    ids: string[] | []
} | { type: 'reorder', id: string, destinationId: string, index: number } |
{ type: 'select_from_list', id: string} | { type: 'set_max_ticks', maxTicks: number } |
{ type: 'set_tick', tick: number } |
{ type: 'load_from_file', newStore: MyStore } |
{ type: 'copy', state: BaseState } | { type: 'patch', patches: Patches};

export type DispactherAction = React.Dispatch<StoreAction>;

export const initState: MyStore = {
    parent: new Map<string, string>(),
    components: [],
    selected: [],
    titles: new Set<string>(),
    step: 10, // in millis
    maxTicks: 1000,
    tick: 0
};

export const MyStoreContext = createContext<MyStore>(initState);
