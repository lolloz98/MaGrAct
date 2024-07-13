import { createContext } from 'react';
import { BaseState } from './ComponentMapper';

export interface MyStore {
    parent: Map<string, string> // each object has a parent, by navigating this object we can navigate to it
    components: Array<BaseState>
}

export const MyStoreContext = createContext<MyStore>({
    parent: new Map<string, string>(),
    components: []
});
