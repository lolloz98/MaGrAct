import { Stack } from "@mui/material";
import { DispactherAction } from "../StoreContext";
import BaseState from "../states/BaseState";
import { SharedBaseControl, SharedTitleControl } from "./SharedControl";


export default function BaseControl({ state, dispatch }: { state: BaseState, dispatch: DispactherAction }) {
    return (
        <Stack border={1} borderRadius={2}>
            <SharedTitleControl state={state} dispatch={dispatch}/>
            <SharedBaseControl state={state} dispatch={dispatch}/>
        </Stack>
    )
}