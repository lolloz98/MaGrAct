import saveAs from "file-saver";
import { MyStore } from "../StoreContext";


function replacer(key: string, value: any) {
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

export function mySaveAs(myStore: MyStore, fileName: string) {
    const blob = new Blob([toJson(myStore)], {type: "text/plain;charset=utf-8"});
    saveAs(blob, fileName);
}