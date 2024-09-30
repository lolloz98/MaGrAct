import { Stack } from "@mui/material";
import { DispactherAction } from "../StoreContext";
import FunctionState from "../states/FunctionState";
import { SharedAxisControl, SharedBaseControl, SharedFunctionControl, SharedTitleControl } from "./SharedControl";
import styles from './Controls.module.css';

export default function FunctionControl({ state, dispatch }: { state: FunctionState, dispatch: DispactherAction }) {
    return (
        <Stack border={1} borderRadius={2} className={styles.root}>
            <SharedTitleControl state={state} dispatch={dispatch}/>
            <SharedFunctionControl state={state} dispatch={dispatch} />
            <SharedBaseControl state={state} dispatch={dispatch}/>
            <SharedAxisControl state={state} dispatch={dispatch} getAxis={(state) => state.x_axis} title={"X Axis"} />
            <SharedAxisControl state={state} dispatch={dispatch} getAxis={(state) => state.y_axis} title={"Y Axis"} />
        </Stack>
    )
}