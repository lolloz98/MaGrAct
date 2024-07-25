import { useEffect, useMemo, useState } from "react";
import {
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
    List,
    ListItem,
    ListItemText,
    ListSubheader,
    Divider,
    Typography,
    ListItemButton,
} from "@mui/material";
import styles from './MoveDialog.module.css';
import { DispactherAction, MyStore } from "../StoreContext";
import BaseState from "../states/BaseState";
import { isMyGroup } from "../../App";
import MyGroupState from "../states/MyGroupState";
import { title } from "process";
import { myRange } from "../Utils";

type MoveDialogType = {
    id: string;
    title: string;
}

function e(c: BaseState): MoveDialogType {
    return { id: c.id, title: c.title };
}

function dfs(c: BaseState): MoveDialogType[] {
    if (!isMyGroup(c)) return [e(c)];
    let ret = [e(c)];
    for (const n of (c as MyGroupState).children) {
        ret = ret.concat(dfs(n));
    }
    return ret;
}

function dfsParent(c: BaseState, id: string): MoveDialogType[] {
    if (!isMyGroup(c) || c.id === id) return [];
    let ret = [e(c)];
    for (const n of (c as MyGroupState).children) {
        ret = ret.concat(dfsParent(n, id));
    }
    return ret;
}

function dfsSiblings(cs: BaseState[], newParentId: string): MoveDialogType[] {
    if (newParentId === "0") return cs;
    if (cs.length === 0) return [];
    let ret: MoveDialogType[] = [];
    for (const c of cs) {
        if (isMyGroup(c)) {
            if (c.id === newParentId) return (c as MyGroupState).children;
            ret = ret.concat(dfsSiblings((c as MyGroupState).children, newParentId));
            if (ret.length > 0) { break; }
        }
    }
    return ret;
}

function stringify(s: MoveDialogType | '') {
    if (s === '') return '';
    return JSON.stringify(s);
}

export default function MoveDialog({ state, onClose, dispatch }:
    { state: MyStore, onClose: () => void, dispatch: DispactherAction }) {
    const base = '';
    const [sel, setSel] = useState<MoveDialogType | ''>(base);
    const [siblingsList, setSiblingsList] = useState<MoveDialogType[]>([]);
    const [parentlist, setParentList] = useState<MoveDialogType[]>([]);
    const [completeList, setCompleteList] = useState<MoveDialogType[]>([]);

    const [newParent, setNewParent] = useState<MoveDialogType>({ id: "0", title: "(root)" });
    const [newPosition, setNewPosition] = useState<number>(0);
    // max number (exclusive)
    const [posConstraints, setNewPosConstraint] = useState<number>(1);



    const onChangeSel = (s: MoveDialogType | '', np: MoveDialogType) => {
        setNewPosition(0);
        if (s === base) {
            setSel(base);
            setSiblingsList([]);
            setParentList([]);
            setNewParent({ id: "0", title: "(root)" });
            setNewPosConstraint(1);
            return;
        }

        setNewParent(np);
        setSel(s);
        let nextParentList: MoveDialogType[] = [];
        for (const c of state.components) nextParentList = nextParentList.concat(dfsParent(c, s.id));
        setParentList(nextParentList);

        const nextSiblingList = dfsSiblings(state.components, np.id);
        setSiblingsList(nextSiblingList);

        if ((nextSiblingList.find(a => a.id === s.id) !== undefined)) {
            setNewPosConstraint(nextSiblingList.length);
        }
        else setNewPosConstraint(nextSiblingList.length + 1);
    }

    useEffect(() => {
        let complete: MoveDialogType[] = [];
        for (const c of state.components) {
            complete = complete.concat(dfs(c));
        }
        setCompleteList(complete);
        setSiblingsList(dfsSiblings(state.components, newParent.id))
    }, [state]);

    return (
        <Dialog open={true} onClose={onClose}>
            <DialogTitle>Change Position of an Item</DialogTitle>
            <DialogContent className={styles.content} sx={{
                '& .MuiTextField-root': { mt: 1 },
            }} style={{ overflowY: 'hidden' }}>
                <Stack direction={"row"} spacing={1} paddingTop={1} alignItems={"center"} justifyContent={'space-around'}>

                    <Stack direction={"column"} spacing={1} paddingTop={1} flex={2}>
                        <FormControl className={styles.select}>
                            <InputLabel id="item-to-move-label">Select Item to Move</InputLabel>
                            <Select label="Select Item to Move" labelId="item-to-move-label" onChange={(e) => onChangeSel(JSON.parse(e.target.value as string) as MoveDialogType, { id: "0", title: "(root)" })} value={stringify(sel)}>
                                {completeList
                                    .map((c) => (
                                        <MenuItem key={c.id} value={stringify({ id: c.id, title: c.title })}>
                                            {c.title}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                        <FormControl className={styles.select}>
                            <InputLabel id="new-parent-label">Select New Parent</InputLabel>
                            <Select label="Select New Parent" labelId="new-parent-label" onChange={(e) => onChangeSel(sel, JSON.parse(e.target.value as string) as MoveDialogType)} value={stringify(newParent)}>
                                <MenuItem value={stringify({ id: "0", title: "(root)" })}>(root)</MenuItem>
                                {parentlist
                                    .map((c) => (
                                        <MenuItem key={c.id} value={stringify({ id: c.id, title: c.title })}>
                                            {c.title}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                        <FormControl className={styles.select}>
                            <InputLabel id="new-position-label">Select New Position</InputLabel>
                            <Select label="Select New Position" labelId="new-position-label" onChange={(e) => setNewPosition(e.target.value as number)} value={newPosition}>
                                {myRange(0, posConstraints)
                                    .map((c) => (
                                        <MenuItem key={c} value={`${c}`}>
                                            {c}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </Stack>
                    <Stack direction={"column"} width={"50%"}>
                        <Typography>{`In New Parent`}</Typography>
                        <Divider />
                        <List style={{ maxHeight: 400, overflow: 'auto' }}>
                            {siblingsList.map((c, i) => {
                                return (<ListItemButton key={c.id} onClick={(e) => {
                                        onChangeSel({ id: c.id, title: c.title }, newParent);
                                    }}>
                                        <ListItemText key={c.id}
                                            primary={`${i} ${c.title}`}
                                        />
                                    </ListItemButton>)
                            })}
                        </List>
                    </Stack>
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={() => {
                        if (sel !== '' && newPosition < posConstraints) {
                            dispatch({ type: 'reorder', id: sel.id, destinationId: newParent.id, index: newPosition })
                            onClose();
                        } else {
                            alert("Make sure to compile a new parent, an item and a valid position");
                        }
                    }}
                >
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};
