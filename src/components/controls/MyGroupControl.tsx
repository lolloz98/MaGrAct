import { Stack } from "@mui/material";
import BaseState from "../states/BaseState";
import { DispactherAction } from "../StoreContext";
import styles from './Controls.module.css';
import { SharedBaseControl, SharedTitleControl } from "./SharedControl";

export default function MyGroupControl({ state, dispatch }: { state: BaseState, dispatch: DispactherAction }) {
    return (
        <Stack border={1} borderRadius={2} className={styles.root}>
            <SharedTitleControl state={state} dispatch={dispatch}/>
            <SharedBaseControl state={state} dispatch={dispatch}/>
        </Stack>
    )
}