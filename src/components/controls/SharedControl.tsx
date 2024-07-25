import { Button, Checkbox, Collapse, FormControlLabel, FormGroup, Stack, Typography } from "@mui/material";
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
import MyGroupState from "../states/MyGroupState";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { isMyGroup } from "../../App";

export function SharedBaseControl({ state, dispatch }: { state: BaseState, dispatch: DispactherAction }) {
    const [open, setOpen] = useState(false);

    return (
        <Stack>
            <Button size="small" startIcon={open ? <ExpandLess /> : <ExpandMore />} onClick={() => setOpen(!open)}>Base Controls</Button>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <Stack direction={"column"} spacing={1}>
                    {
                        state.parent ? <Button onClick={() => {
                            dispatch({ type: 'select_from_list', id: state.parent ?? "0" })
                        }} endIcon={(<OpenInNewIcon />)} color="secondary" style={{ textTransform: 'none' }}>Go to Parent</Button> : undefined
                    }
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
                    {
                        isMyGroup(state) ? undefined :
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
                    }
                    <DefaultColorPicker state={state} dispatch={dispatch}
                        label={isMyGroup(state) ? "Gizmos Color" : "Color"} />
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
                    dispatch({ type: 'modify', id: state.id, modifiers: [(s) => s.title = val] });
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
                    <Stack direction={"row"} spacing={1} paddingBottom={2}>
                        <MyNumbericInput label="Unit scale" variant="outlined" helperText={"NOT affect stroke width"}
                            dispatch={dispatch}
                            state={state} get={(state) => {
                                return getAxis(state as FunctionState).unit_scale
                            }}
                            set={(a: BaseState, n: number) => getAxis(a as FunctionState).unit_scale = n} style={{ width: "50%" }} />
                        <FormGroup style={{ width: "50%" }}>
                            <FormControlLabel control={<Checkbox />} checked={getAxis(state).flip} label="Flip axis" onChange={(e) => {
                                dispatch({ type: 'modify', id: state.id, modifiers: [(s) => getAxis(s as FunctionState).flip = (e.target as HTMLInputElement).checked] });
                            }} />
                        </FormGroup>
                    </Stack>
                    <Stack direction={"row"} spacing={1}>
                        <MyNumbericInput label="Min Value" variant="outlined"
                            dispatch={dispatch}
                            state={state} get={(state) => {
                                return getAxis(state as FunctionState).bounds.min
                            }}
                            set={(a: BaseState, n: number) => getAxis(a as FunctionState).bounds.min = n} />
                        <MyNumbericInput label="Max Value" variant="outlined"
                            dispatch={dispatch}
                            state={state} get={(state) => {
                                return getAxis(state as FunctionState).bounds.max
                            }}
                            set={(a: BaseState, n: number) => getAxis(a as FunctionState).bounds.max = n} />
                    </Stack>
                    <Stack direction={"row"} spacing={1}>
                        <MyNumbericInput label="Thickness" variant="outlined"
                            dispatch={dispatch}
                            state={state} get={(state) => {
                                return getAxis(state as FunctionState).thickness
                            }}
                            set={(a: BaseState, n: number) => getAxis(a as FunctionState).thickness = n} />
                        <MyColorPicker state={state} dispatch={dispatch} label={`${title} Color`}
                            getColor={(a: BaseState) => getAxis(a as FunctionState).color}
                            setColor={(a: BaseState, n: string) => getAxis(a as FunctionState).color = n} />
                    </Stack>
                    <Stack direction={"row"} spacing={1}>
                        <MyNumbericInput label="Marks: Each" variant="outlined"
                            dispatch={dispatch}
                            state={state} get={(state) => {
                                return getAxis(state as FunctionState).marks.each
                            }}
                            set={(a: BaseState, n: number) => getAxis(a as FunctionState).marks.each = n} />
                        <FormGroup>
                            <FormControlLabel control={<Checkbox />} checked={getAxis(state).marks.visible} label="Marks: Visible" onChange={(e) => {
                                dispatch({ type: 'modify', id: state.id, modifiers: [(s) => getAxis(s as FunctionState).marks.visible = (e.target as HTMLInputElement).checked] });

                            }} />
                        </FormGroup>
                    </Stack>
                    <Stack direction={"row"} spacing={1}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox />} checked={getAxis(state).visible} label="Visible" onChange={(e) => {
                                dispatch({ type: 'modify', id: state.id, modifiers: [(s) => getAxis(s as FunctionState).visible = (e.target as HTMLInputElement).checked] });
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
                        <MyNumbericInput label="Stroke Width" variant="outlined"
                            dispatch={dispatch}
                            state={state} get={(state) => {
                                return (state as FunctionState).strokeWidth
                            }}
                            set={(a: BaseState, n: number) => (a as FunctionState).strokeWidth = n} />
                    </Stack>
                    <Stack direction={"row"} spacing={1}>
                        <MyNumbericInput label="Min X" variant="outlined"
                            dispatch={dispatch}
                            state={state} get={(state) => {
                                return (state as FunctionState).x_bounds.min
                            }}
                            set={(a: BaseState, n: number) => (a as FunctionState).x_bounds.min = n} />
                        <MyNumbericInput label="Max X" variant="outlined"
                            dispatch={dispatch}
                            state={state} get={(state) => {
                                return (state as FunctionState).x_bounds.max
                            }}
                            set={(a: BaseState, n: number) => (a as FunctionState).x_bounds.max = n} />
                    </Stack>
                    <Stack direction={"row"} spacing={1}>
                        <MyNumbericInput label="Min Y" variant="outlined"
                            dispatch={dispatch}
                            state={state} get={(state) => {
                                return (state as FunctionState).y_bounds.min
                            }}
                            set={(a: BaseState, n: number) => (a as FunctionState).y_bounds.min = n} />
                        <MyNumbericInput label="Max Y" variant="outlined"
                            dispatch={dispatch}
                            state={state} get={(state) => {
                                return (state as FunctionState).y_bounds.max
                            }}
                            set={(a: BaseState, n: number) => (a as FunctionState).y_bounds.max = n} />
                    </Stack>
                    <MyNumbericInput label="Granularity" variant="outlined" helperText={"The smaller the more definition on fn"}
                        dispatch={dispatch}
                        state={state} get={(state) => {
                            return (state as FunctionState).granularity
                        }}
                        set={(a: BaseState, n: number) => (a as FunctionState).granularity = n} />
                </Stack>
            </Collapse>
        </Stack>
    )
}

export function SharedMyGroupControl({ state, dispatch }: {
    state: MyGroupState,
    dispatch: DispactherAction
}) {
    const [open, setOpen] = useState(false);

    return (
        <Stack>
            <Button size="small" startIcon={open ? <ExpandLess /> : <ExpandMore />} onClick={() => setOpen(!open)}>Common Group Controls</Button>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <Stack direction={"column"} spacing={1}>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox />} checked={state.isGizmosVisible} label="Gizmos Visible" onChange={(e) => {
                            dispatch({ type: 'modify', id: state.id, modifiers: [(s) => (s as MyGroupState).isGizmosVisible = (e.target as HTMLInputElement).checked] });
                        }} />
                    </FormGroup>
                    <Typography>Children</Typography>
                    {
                        state.children.map((c) => {
                            return (
                                <Button key={c.id} onClick={() => {
                                    dispatch({ type: 'select_from_list', id: c.id })
                                }} endIcon={(<OpenInNewIcon />)} color="secondary" style={{ textTransform: 'none' }}>{c.title}</Button>
                            )
                        })
                    }
                </Stack>
            </Collapse>
        </Stack>
    )
}