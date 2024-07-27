import { MyStore } from "../StoreContext";

export function reviver(key: string, value: any) {
    if(typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
      if (value.dataType === 'Set') {
        return new Set(value.value);
      }
    }
    return value;
  }

export function fromJson(myStoreStr: string): MyStore | undefined {
    return JSON.parse(myStoreStr, reviver);
}