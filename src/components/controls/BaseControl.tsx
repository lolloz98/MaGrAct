import { Stack } from "@mui/material";
import { DispactherAction } from "../StoreContext";
import BaseState from "../states/BaseState";
import { SharedBaseControl, SharedTitleControl } from "./SharedControl";
import styles from './Controls.module.css';


export default function BaseControl({ state, dispatch }: { state: BaseState, dispatch: DispactherAction }) {
    return (
        <Stack border={1} borderRadius={2} className={styles.root}>
            <SharedTitleControl state={state} dispatch={dispatch}/>
            <SharedBaseControl state={state} dispatch={dispatch}/>
        </Stack>
    )
}