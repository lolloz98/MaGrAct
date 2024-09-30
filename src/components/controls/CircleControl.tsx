import { Stack } from "@mui/material";
import { DispactherAction } from "../StoreContext";
import { SharedBaseControl, SharedTitleControl } from "./SharedControl";
import styles from './Controls.module.css';
import MyNumbericInput from "../inputs/MyNumericInput";
import CircleState from "../states/CircleState";


export default function CircleControl({ state, dispatch }: { state: CircleState, dispatch: DispactherAction }) {
    return (
        <Stack border={1} borderRadius={2} className={styles.root}>
            <SharedTitleControl state={state} dispatch={dispatch}/>
            <Stack paddingTop={1} width={"100%"}>
                <MyNumbericInput state={state} set={(s, a) => { (s as CircleState).radius = a }}
                    get={(s) => (s as CircleState).radius} dispatch={dispatch} label="Radius" />
            </Stack>
            <SharedBaseControl state={state} dispatch={dispatch}/>
        </Stack>
    )
}