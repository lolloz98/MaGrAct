import { MyStore } from "../StoreContext";


export function replacer(_key: string, value: any) {
    if(value instanceof Map) {
        return {
            dataType: 'Map',
            value: Array.from(value.entries()),
        };
    } else if (value instanceof Set) {
        return {
            dataType: 'Set',
            value: Array.from(value.values())
        }
    } else {
        return value;
    }
}

export function toJson(myStoreStr: MyStore): string {
    return JSON.stringify(myStoreStr, replacer);
}