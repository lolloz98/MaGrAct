import { Button, Checkbox, Collapse, FormControlLabel, FormGroup, Stack } from "@mui/material";
import MyCustomInput from "../inputs/MyCustomInput";
import BaseState from "../states/BaseState";
import { DispactherAction } from "../StoreContext";
import { useState } from "react";
import { isNumeric } from "../Utils";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import MyNumbericInput from "../inputs/MyNumericInput";
import MyColorPicker, { DefaultColorPicker } from "../inputs/MyColorPicker";
import FunctionState, { Axis } from "../states/FunctionState";
import MyTextInput from "../inputs/MyTextInput";

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
                    <DefaultColorPicker state={state} dispatch={dispatch} label="Color"/>

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

export function SharedAxisControl({ state, getAxis, dispatch, title }: { 
    state: FunctionState, 
    dispatch: DispactherAction,
    getAxis: (state: FunctionState) => Axis,
    title: string
}) {
    const [open, setOpen] = useState(false);

    return (
        <Stack>
            <Button size="small" startIcon={open ? <ExpandLess /> : <ExpandMore />} onClick={() => setOpen(!open)}>{title}</Button>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <Stack direction={"column"} spacing={1}>
                    <Stack direction={"row"} spacing={1}>
                        <MyNumbericInput label="Min Value" variant="outlined" 
                         dispatch={dispatch}
                         state={state} get={(state) =>{ 
                            return getAxis(state as FunctionState).bounds.min
                        }} 
                         set={(a: BaseState, n: number) => getAxis(a as FunctionState).bounds.min = n} />
                        <MyNumbericInput label="Max Value" variant="outlined" 
                         dispatch={dispatch}
                         state={state} get={(state) =>{ 
                            return getAxis(state as FunctionState).bounds.max
                        }} 
                         set={(a: BaseState, n: number) => getAxis(a as FunctionState).bounds.max = n} />
                    </Stack>
                    <Stack direction={"row"} spacing={1}>
                        <MyNumbericInput label="Thickness" variant="outlined" 
                         dispatch={dispatch}
                         state={state} get={(state) =>{ 
                            return getAxis(state as FunctionState).thickness
                        }} 
                         set={(a: BaseState, n: number) => getAxis(a as FunctionState).thickness = n} />
                        <MyColorPicker state={state} dispatch={dispatch} label={`${title} Color`}
                            getColor={(a: BaseState) => getAxis(a as FunctionState).color } 
                            setColor={(a: BaseState, n: string) => getAxis(a as FunctionState).color = n }/>
                    </Stack>   
                    <Stack direction={"row"} spacing={1}>
                        <MyNumbericInput label="Marks: Each" variant="outlined" 
                         dispatch={dispatch}
                         state={state} get={(state) =>{ 
                            return getAxis(state as FunctionState).marks.each
                        }} 
                         set={(a: BaseState, n: number) => getAxis(a as FunctionState).marks.each = n} />
                        <FormGroup>
                            <FormControlLabel control={<Checkbox defaultChecked />} label="Marks: Visible" onChange={(e) => {
                                const newState = {...state};
                                getAxis(newState as FunctionState).marks.visible = (e.target as HTMLInputElement).checked;
                                dispatch({ type: 'modify', state: newState })
                            }} />
                        </FormGroup>
                    </Stack>    
                    <Stack direction={"row"} spacing={1}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox defaultChecked />} label="Visible" onChange={(e) => {
                                const newState = {...state};
                                getAxis(newState as FunctionState).visible = (e.target as HTMLInputElement).checked;
                                dispatch({ type: 'modify', state: newState })
                            }} />
                        </FormGroup>
                    </Stack>                  
                </Stack>
            </Collapse>
        </Stack>
    )
}

export function SharedFunctionControl({ state, dispatch }: { 
    state: FunctionState, 
    dispatch: DispactherAction
}) {
    const [open, setOpen] = useState(false);

    return (
        <Stack>
            <Button size="small" startIcon={open ? <ExpandLess /> : <ExpandMore />} onClick={() => setOpen(!open)}>Main Function</Button>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <Stack direction={"column"} spacing={1}>
                    <Stack direction={"row"} spacing={1}>
                        <MyTextInput state={state} dispatch={dispatch} 
                            label={"Function"} get={(a) => (a as FunctionState).fn} set={(a, nf) => (a as FunctionState).fn = nf} />
                    </Stack>
                    <Stack direction={"row"} spacing={1}>
                        <MyNumbericInput label="Min X" variant="outlined" 
                         dispatch={dispatch}
                         state={state} get={(state) =>{ 
                            return (state as FunctionState).x_bounds.min
                        }} 
                         set={(a: BaseState, n: number) => (a as FunctionState).x_bounds.min = n} />
                        <MyNumbericInput label="Max X" variant="outlined" 
                         dispatch={dispatch}
                         state={state} get={(state) =>{ 
                            return (state as FunctionState).x_bounds.max
                        }} 
                         set={(a: BaseState, n: number) => (a as FunctionState).x_bounds.max = n} />
                    </Stack>
                    <Stack direction={"row"} spacing={1}>
                        <MyNumbericInput label="Min Y" variant="outlined" 
                         dispatch={dispatch}
                         state={state} get={(state) =>{ 
                            return (state as FunctionState).y_bounds.min
                        }} 
                         set={(a: BaseState, n: number) => (a as FunctionState).y_bounds.min = n} />
                        <MyNumbericInput label="Max Y" variant="outlined" 
                         dispatch={dispatch}
                         state={state} get={(state) =>{ 
                            return (state as FunctionState).y_bounds.max
                        }} 
                         set={(a: BaseState, n: number) => (a as FunctionState).y_bounds.max = n} />
                    </Stack>                
                </Stack>
            </Collapse>
        </Stack>
    )
}