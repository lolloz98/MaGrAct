import { Stack } from "@mui/material";
import BaseState from "../states/BaseState";
import { DispactherAction } from "../StoreContext";
import styles from './Controls.module.css';
import { SharedBaseControl, SharedMyGroupControl, SharedTitleControl } from "./SharedControl";
import MyGroupState from "../states/MyGroupState";

export default function MyGroupControl({ state, dispatch }: { state: MyGroupState, dispatch: DispactherAction }) {
    return (
        <Stack border={1} borderRadius={2} className={styles.root}>
            <SharedTitleControl state={state} dispatch={dispatch}/>
            <SharedMyGroupControl state={state} dispatch={dispatch} />
            <SharedBaseControl state={state} dispatch={dispatch}/>
        </Stack>
    )
}