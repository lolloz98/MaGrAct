import { Stack } from "@mui/material";
import { DispactherAction } from "../StoreContext";
import FunctionState from "../states/FunctionState";
import { SharedAxisControl, SharedBaseControl, SharedTitleControl } from "./SharedControl";
import styles from './Controls.module.css';
import MyTextInput from "../inputs/MyTextInput";

export default function FunctionControl({ state, dispatch }: { state: FunctionState, dispatch: DispactherAction }) {
    return (
        <Stack border={1} borderRadius={2} className={styles.root}>
            <SharedTitleControl state={state} dispatch={dispatch}/>
            <MyTextInput state={state} dispatch={dispatch} 
                label={"Function"} get={(a) => (a as FunctionState).fn} set={(a, nf) => (a as FunctionState).fn = nf} />
            <SharedBaseControl state={state} dispatch={dispatch}/>
            <SharedAxisControl state={state} dispatch={dispatch} getAxis={(state) => state.x_axis} title={"X Axis"} />
            <SharedAxisControl state={state} dispatch={dispatch} getAxis={(state) => state.y_axis} title={"Y Axis"} />
        </Stack>
    )
}