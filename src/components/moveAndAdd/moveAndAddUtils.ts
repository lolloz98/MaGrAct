import { useEffect, useState } from "react";
import { isMyGroup } from "../../App";
import BaseState from "../states/BaseState";
import MyGroupState from "../states/MyGroupState";
import { MyStore } from "../StoreContext";

export type MoveDialogType = {
    id: string;
    title: string;
}

export function convertStateToMoveDialog(c: BaseState): MoveDialogType {
    return { id: c.id, title: c.title };
}

/**
 * dfs starting from state c
 */
export function dfs(c: BaseState): MoveDialogType[] {
    if (!isMyGroup(c)) return [convertStateToMoveDialog(c)];
    let ret = [convertStateToMoveDialog(c)];
    for (const n of (c as MyGroupState).children) {
        ret = ret.concat(dfs(n));
    }
    return ret;
}

/**
 * Find all eligible parents for state c
 */
export function eligibleParentsForState(c: BaseState, id: string): MoveDialogType[] {
    if (!isMyGroup(c) || c.id === id) return [];
    let ret = [convertStateToMoveDialog(c)];
    for (const n of (c as MyGroupState).children) {
        ret = ret.concat(eligibleParentsForState(n, id));
    }
    return ret;
}

/**
 * Find out list in which there is newParentId and return it
 */
export function findListContainingIdRecursive(cs: BaseState[], id: string): MoveDialogType[] {
    if (id === "0") return cs;
    if (cs.length === 0) return [];
    let ret: MoveDialogType[] = [];
    for (const c of cs) {
        if (isMyGroup(c)) {
            if (c.id === id) return (c as MyGroupState).children;
            ret = ret.concat(findListContainingIdRecursive((c as MyGroupState).children, id));
            if (ret.length > 0) { break; }
        }
    }
    return ret;
}

export function useListingItems(state: MyStore, initSelected: MoveDialogType | '') {
    const [selected, setSelected] = useState<MoveDialogType | ''>(initSelected);
    const [newParent, setNewParent] = useState<MoveDialogType>({ id: "0", title: "(root)" });
    const [newParentSiblingsList, setNewParentSiblingsList] = useState<MoveDialogType[]>([]);
    const [eligibleParents, setEligibleParents]= useState<MoveDialogType[]>([]);
    const [completeList, setCompleteList] = useState<MoveDialogType[]>([]);

    // the position of insertion for a new item should always be < than this
    const [posConstraints, setNewPosConstraint] = useState<number>(1);
    const [pos, setPos] = useState<number>(0);


    const onChange = (newSelected: MoveDialogType | '', newParent: MoveDialogType) => {
        setPos(0);
        if (newSelected === '') {
            setSelected('');
            setNewParentSiblingsList([]);
            setEligibleParents([]);
            setNewParent({ id: "0", title: "(root)" });
            setNewPosConstraint(1);
            return;
        }
        setSelected(newSelected);
        setNewParent(newParent);
        let nextParentList: MoveDialogType[] = [];
        for (const c of state.components) nextParentList = nextParentList.concat(eligibleParentsForState(c, newSelected.id));
        setEligibleParents(nextParentList);

        const nextSiblingList = findListContainingIdRecursive(state.components, newParent.id);
        setNewParentSiblingsList(nextSiblingList);

        if ((nextSiblingList.find(a => a.id === newSelected.id) !== undefined)) {
            setNewPosConstraint(nextSiblingList.length);
        }
        else setNewPosConstraint(nextSiblingList.length + 1);
    }

    const onChangePos = (newPos: number) => {
        if (newPos < posConstraints) {
            setPos(newPos);
        } else {
            console.warn(`Position not changing to ${newPos} because greater than ${posConstraints}`)
        }
    }

    useEffect(() => {
        let complete: MoveDialogType[] = [];
        for (const c of state.components) {
            complete = complete.concat(dfs(c));
        }
        setCompleteList(complete);
        onChange(initSelected, newParent);
    }, [state]);

    return {selected, newParent, completeList, newParentSiblingsList, eligibleParents, posConstraints, pos, onChange, onChangePos};
}

export function stringifyMoveDialog(s: MoveDialogType | '') {
    if (s === '') return '';
    return JSON.stringify(s);
}
