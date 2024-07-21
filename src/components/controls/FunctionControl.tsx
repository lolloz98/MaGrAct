import { Stack } from "@mui/material";
import { DispactherAction, MyStore } from "../StoreContext";
import FunctionState from "../states/FunctionState";
import { SharedBaseControl, SharedTitleControl } from "./SharedControl";
import styles from './Controls.module.css';

export default function FunctionControl({ state, dispatch }: { state: FunctionState, dispatch: DispactherAction }) {
    return (
        <Stack border={1} borderRadius={2} className={styles.root}>
            <SharedTitleControl state={state} dispatch={dispatch}/>
            <SharedBaseControl state={state} dispatch={dispatch}/>
        </Stack>
    )
}