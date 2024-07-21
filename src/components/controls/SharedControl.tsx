import { Button, Collapse, Stack } from "@mui/material";
import MyCustomInput from "../inputs/MyCustomInput";
import BaseState from "../states/BaseState";
import { DispactherAction } from "../StoreContext";
import { useState } from "react";
import { isNumeric } from "../Utils";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';

export function SharedBaseControl({ state, dispatch }: { state: BaseState, dispatch: DispactherAction }) {
    const [open, setOpen] = useState(false);

    return (
        <Stack>
            <Button size="small" startIcon={open ? <ExpandLess /> : <ExpandMore />} onClick={() => setOpen(!open)}>Base Controls</Button>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <Stack direction={"column"} spacing={1}>
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
                    <Stack direction={"row"} spacing={1}>
                        <MyCustomInput label="Scale_X" variant="outlined" onMyChange={
                            (e) => {
                                const val = (e.target as HTMLInputElement).value;
                                if (isNumeric(val)) {
                                    const newState = { ...state };
                                    newState.scale.x = +val;
                                    dispatch({ type: 'modify', state: newState });
                                }
                            }
                        } state={`${state.scale.x}`} />
                        <MyCustomInput label="Scale_Y" variant="outlined" onMyChange={
                            (e) => {
                                const val = (e.target as HTMLInputElement).value;
                                if (isNumeric(val)) {
                                    const newState = { ...state };
                                    newState.scale.y = +val;
                                    dispatch({ type: 'modify', state: newState });
                                }
                            }
                        } state={`${state.scale.y}`} />
                    </Stack>
                    <Stack direction={"row"} spacing={1}>
                        <MyCustomInput label="Time_Start" variant="outlined" onMyChange={
                            (e) => {
                                const val = (e.target as HTMLInputElement).value;
                                if (isNumeric(val)) {
                                    const newState = { ...state };
                                    newState.time_constraint.start = +val;
                                    dispatch({ type: 'modify', state: newState });
                                }
                            }
                        } state={`${state.time_constraint.start}`} />
                        <MyCustomInput label="Time_End" variant="outlined" onMyChange={
                            (e) => {
                                const val = (e.target as HTMLInputElement).value;
                                if (isNumeric(val)) {
                                    const newState = { ...state };
                                    newState.time_constraint.end = +val;
                                    dispatch({ type: 'modify', state: newState });
                                }
                            }
                        } state={`${state.time_constraint.end}`} />
                    </Stack>
                </Stack>
            </Collapse>
        </Stack>
    )
}

export function SharedTitleControl({ state, dispatch }: { state: BaseState, dispatch: DispactherAction }) {
    return (
        <Stack direction={"column"}>
            <Button startIcon={<DeleteIcon />} onClick={() => dispatch({ type: "delete", id: state.id })} />
            <MyCustomInput label="Title" variant="outlined" onMyChange={
                (e) => {
                    const val = (e.target as HTMLInputElement).value;
                    const newState = { ...state };
                    newState.title = val;
                    dispatch({ type: 'modify', state: newState });
                }
            } state={`${state.title}`} />
        </Stack>
    )
}