import { Stack } from "@mui/material";
import { DispactherAction } from "../StoreContext";
import { SharedBaseControl, SharedTitleControl } from "./SharedControl";
import styles from './Controls.module.css';
import MyTextInput from "../inputs/MyTextInput";
import KatexState from "../states/KatexState";


export default function KatexControl({ state, dispatch }: { state: KatexState, dispatch: DispactherAction }) {
    return (
        <Stack border={1} borderRadius={2} className={styles.root}>
            <SharedTitleControl state={state} dispatch={dispatch} />
            <Stack direction={"row"} spacing={1} paddingTop={1}>
                <MyTextInput state={state} dispatch={dispatch}
                    label={"Function"} get={(a) => (a as KatexState).fn} set={(a, nf) => (a as KatexState).fn = nf} />
            </Stack>
            <SharedBaseControl state={state} dispatch={dispatch} />
        </Stack>
    )
}