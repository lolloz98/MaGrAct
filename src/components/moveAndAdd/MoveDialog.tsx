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
import { dfs, eligibleParentsForState, findListContainingIdRecursive, MoveDialogType, useListingItems } from "./moveAndAddUtils";

function stringify(s: MoveDialogType | '') {
    if (s === '') return '';
    return JSON.stringify(s);
}

export default function AddOrMoveDialog({ state, onClose, dispatch }:
    { state: MyStore, onClose: () => void, dispatch: DispactherAction }) {
    
    const {selected, 
        newParent, 
        completeList, 
        newParentSiblingsList, 
        eligibleParents, 
        posConstraints, 
        pos, onChange, onChangePos} = useListingItems(state, '');

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
                            <Select label="Select Item to Move" labelId="item-to-move-label" onChange={(e) => onChange(JSON.parse(e.target.value as string) as MoveDialogType, { id: "0", title: "(root)" })} value={stringify(selected)}>
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
                            <Select label="Select New Parent" labelId="new-parent-label" onChange={(e) => onChange(selected, JSON.parse(e.target.value as string) as MoveDialogType)} value={stringify(newParent)}>
                                <MenuItem value={stringify({ id: "0", title: "(root)" })}>(root)</MenuItem>
                                {eligibleParents
                                    .map((c) => (
                                        <MenuItem key={c.id} value={stringify({ id: c.id, title: c.title })}>
                                            {c.title}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                        <FormControl className={styles.select}>
                            <InputLabel id="new-position-label">Select New Position</InputLabel>
                            <Select label="Select New Position" labelId="new-position-label" onChange={(e) => onChangePos(e.target.value as number)} value={pos}>
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
                            {newParentSiblingsList.map((c, i) => {
                                return (<ListItemButton key={c.id} onClick={(e) => {
                                    onChange({ id: c.id, title: c.title }, newParent);
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
                        if (selected !== '' && pos < posConstraints) {
                            dispatch({ type: 'reorder', id: selected.id, destinationId: newParent.id, index: pos })
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
