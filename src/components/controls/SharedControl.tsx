import { Button, Collapse, Stack } from "@mui/material";
import MyCustomInput from "../inputs/MyCustomInput";
import BaseState from "../states/BaseState";
import { DispactherAction } from "../StoreContext";
import { useState } from "react";
import { isNumeric } from "../Utils";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import MyNumbericInput from "../inputs/MyNumericInput";
import MyColorPicker from "../inputs/MyColorPicker";

export function SharedBaseControl({ state, dispatch }: { state: BaseState, dispatch: DispactherAction }) {
    const [open, setOpen] = useState(false);

    return (
        <Stack>
            <Button size="small" startIcon={open ? <ExpandLess /> : <ExpandMore />} onClick={() => setOpen(!open)}>Base Controls</Button>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <Stack direction={"column"} spacing={1}>
                    <Stack direction={"row"} spacing={1}>
                        <MyNumbericInput label="Position_X" variant="outlined" 
                         dispatch={dispatch}
                         state={state} get={() => state.position.x} 
                         set={(a: BaseState, n: number) => a.position.x = n} />
                        <MyNumbericInput label="Position_Y" variant="outlined" 
                         dispatch={dispatch}
                         state={state} get={() => state.position.y} 
                         set={(a: BaseState, n: number) => a.position.y = n} />
                    </Stack>
                    <Stack direction={"row"} spacing={1}>
                        <MyNumbericInput label="Scale_X" variant="outlined" 
                         dispatch={dispatch}
                         state={state} get={() => state.scale.x} 
                         set={(a: BaseState, n: number) => a.scale.x = n} />
                        <MyNumbericInput label="Scale_Y" variant="outlined" 
                         dispatch={dispatch}
                         state={state} get={() => state.scale.y} 
                         set={(a: BaseState, n: number) => a.scale.y = n} />
                    </Stack>
                    <Stack direction={"row"} spacing={1}>
                        <MyNumbericInput label="Time_Start" variant="outlined" 
                         dispatch={dispatch}
                         state={state} get={() => state.time_constraint.start} 
                         set={(a: BaseState, n: number) => a.time_constraint.start = n} />
                        <MyNumbericInput label="Time_End" variant="outlined" 
                         dispatch={dispatch}
                         state={state} get={() => state.time_constraint.end} 
                         set={(a: BaseState, n: number) => a.time_constraint.end = n} />
                    </Stack>
                    <Stack direction={"row"} spacing={1}>
                        <MyNumbericInput label="Anim start duration" variant="outlined" 
                         dispatch={dispatch}
                         state={state} get={() => state.animation.start_duration} 
                         set={(a: BaseState, n: number) => a.animation.start_duration = n} />
                        <MyNumbericInput label="Anim end duration" variant="outlined" 
                         dispatch={dispatch}
                         state={state} get={() => state.animation.end_duration} 
                         set={(a: BaseState, n: number) => a.animation.end_duration = n} />
                    </Stack>
                    <MyColorPicker state={state} dispatch={dispatch} label="Color"/>

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