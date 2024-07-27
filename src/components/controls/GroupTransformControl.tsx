import { Button, Collapse, FormControlLabel, FormGroup, Stack } from "@mui/material";
import { DispactherAction } from "../StoreContext";
import BaseState from "../states/BaseState";
import { SharedBaseControl, SharedMyGroupControl, SharedTitleControl } from "./SharedControl";
import styles from './Controls.module.css';
import GroupTransformState, { MyAnim } from "../states/GroupTransformState";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useState } from "react";
import MyNumbericInput from "../inputs/MyNumericInput";
import MyFunctionInput from "../inputs/MyFunctionInput";


export default function GroupTransformControl({ state, dispatch }: { state: GroupTransformState, dispatch: DispactherAction }) {
    return (
        <Stack border={1} borderRadius={2} className={styles.root}>
            <SharedTitleControl state={state} dispatch={dispatch}/>
            <SharedMyGroupControl state={state} dispatch={dispatch} />
            <AnimControl state={state} dispatch={dispatch} title="Move X" get={(s) => s.move_x_anim} />
            <AnimControl state={state} dispatch={dispatch} title="Move y" get={(s) => s.move_y_anim} />
            <AnimControl state={state} dispatch={dispatch} title="Scale X" get={(s) => s.scale_x_anim} />
            <AnimControl state={state} dispatch={dispatch} title="Scale y" get={(s) => s.scale_y_anim} />
            <AnimControl state={state} dispatch={dispatch} title="Rotate" get={(s) => s.rotate_anim} />
            <SharedBaseControl state={state} dispatch={dispatch}/>
        </Stack>
    )
}


function AnimControl({ state, get, dispatch, title }: 
    { state: GroupTransformState, get: (s: GroupTransformState) => MyAnim, dispatch: DispactherAction, title: string }) {
    const [open, setOpen] = useState(false);
    const anim = get(state);

    return (
        <Stack>
            <Button size="small" startIcon={open ? <ExpandLess /> : <ExpandMore />} onClick={() => setOpen(!open)}>{title} Controls</Button>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <Stack direction={"column"} spacing={1}>
                    <Stack direction={'row'} spacing={1}>
                        <MyNumbericInput label={`Start ${title}`} variant="outlined"
                            dispatch={dispatch}
                            state={state} get={(state) => {
                                return get(state as GroupTransformState).start;
                            }}
                            set={(a: BaseState, n: number) => get(a as GroupTransformState).start = n} />
                        <MyNumbericInput label={`End ${title}`} variant="outlined"
                            dispatch={dispatch}
                            state={state} get={(state) => {
                                return get(state as GroupTransformState).end;
                            }}
                            set={(a: BaseState, n: number) => get(a as GroupTransformState).end = n} />
                    </Stack>
                    <MyFunctionInput state={state} dispatch={dispatch}
                            label={`${title} Function`} get={(a) => get(a as GroupTransformState).fn} set={(a, nf) => get(a as GroupTransformState).fn = nf} />
                </Stack>
            </Collapse>
        </Stack>
    )
}   