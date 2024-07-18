import { Button, Collapse, Input, Stack, TextField } from "@mui/material";
import { DispactherAction, MyStore } from "../StoreContext";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from "react";
import { isNumeric } from "../Utils";
import BaseState from "../states/BaseState";
import MyCustomInput from "./MyCustomInput";


export default function BaseControl({ state, dispatch }: { state: BaseState, dispatch: DispactherAction }) {
    const [open, setOpen] = useState(false);

    return (
        <Stack border={1} borderRadius={2}>
            <Button startIcon={<DeleteIcon />} onClick={() => dispatch({ type: "delete", id: state.id })} />
            <MyCustomInput label="Title" variant="outlined" onMyChange={
                (e) => {
                    const val = (e.target as HTMLInputElement).value;
                    const newState = { ...state };
                    newState.title = val;
                    dispatch({ type: 'modify', state: newState });
                }
            } state={`${state.title}`} />
            <Button size="small" startIcon={open ? <ExpandLess /> : <ExpandMore />} onClick={() => setOpen(!open)}>Base Controls</Button>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <Stack direction={"row"} spacing={1}>
                    <MyCustomInput label="Position_X" variant="outlined" onMyChange={
                        (e) => {
                            const val = (e.target as HTMLInputElement).value;
                            if (isNumeric(val)) {
                                const newState = { ...state };
                                newState.position.x = +val;
                                dispatch({ type: 'modify', state: newState });
                            }
                        }
                    } state={`${state.position.x}`} />
                    <MyCustomInput label="Position_Y" variant="outlined" onMyChange={
                        (e) => {
                            const val = (e.target as HTMLInputElement).value;
                            if (isNumeric(val)) {
                                const newState = { ...state };
                                newState.position.y = +val;
                                dispatch({ type: 'modify', state: newState });
                            }
                        }
                    } state={`${state.position.y}`} />
                </Stack>
            </Collapse>
        </Stack>
    )
}