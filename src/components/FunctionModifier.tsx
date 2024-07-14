import { Input, Stack, TextField } from "@mui/material";
import { DispactherAction, MyStore } from "./StateContext";
import { BaseState } from "./ComponentMapper";
import { useState } from "react";
import { isNumeric } from "./Utils";

export interface FunctionState extends BaseState {
    f: string
}

export default function FunctionModifier({ state, dispatch }: { state: FunctionState, dispatch: DispactherAction }) {
    const [x, setX] = useState<string|number>(state.offset.x);
    const [y, setY] = useState<string|number>(state.offset.y);
    const [f, setF] = useState<string>(state.f);

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
            <TextField label="Outlined" variant="outlined" onChange={
                (e) => {
                    setF(e.target.value);
                    if (isNumeric(e.target.value)) {
                        const newState = {...state};
                        newState.f = e.target.value;
                        dispatch( { type: 'modify', state: newState});
                    }
                }
            } value={f} />
        </Stack>
    )
}