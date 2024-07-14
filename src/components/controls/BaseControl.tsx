import { Input, Stack, TextField } from "@mui/material";
import { DispactherAction, MyStore } from "../StoreContext";
import { useState } from "react";
import { isNumeric } from "../Utils";
import BaseState from "../states/BaseState";


export default function BaseControl({ state, dispatch }: { state: BaseState, dispatch: DispactherAction }) {
    const [x, setX] = useState<string|number>(state.offset.x);
    const [y, setY] = useState<string|number>(state.offset.y);

    return (
        <Stack border={1}>
            <TextField label="Outlined" variant="outlined" onChange={
                (e) => {
                    setX(e.target.value);
                    if (isNumeric(e.target.value)) {
                        const newState = {...state};
                        newState.offset.x = +e.target.value;
                        dispatch( { type: 'modify', state: newState});
                    }
                }
            } value={x} />
            <TextField label="Outlined" variant="outlined" onChange={
                (e) => {
                    setY(e.target.value);
                    if (isNumeric(e.target.value)) {
                        const newState = {...state};
                        newState.offset.y = +e.target.value;
                        dispatch( { type: 'modify', state: newState});
                    }
                }
            } value={y} />
        </Stack>
    )
}