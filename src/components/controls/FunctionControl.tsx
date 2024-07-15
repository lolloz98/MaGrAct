import { Input, Stack, TextField } from "@mui/material";
import { DispactherAction, MyStore } from "../StoreContext";
import { useEffect, useState } from "react";
import { isNumeric } from "../Utils";
import FunctionState from "../states/FunctionState";

export default function FunctionControl({ state, dispatch }: { state: FunctionState, dispatch: DispactherAction }) {
    const [x, setX] = useState<string|number>(state.position.x);
    const [y, setY] = useState<string|number>(state.position.y);
    const [f, setF] = useState<string>(state.f);

    useEffect(() => {
        setX(state.position.x);
        setY(state.position.y);
        setF(state.f);
    }, [state])

    return (
        <Stack border={1}>
            <TextField label="Outlined" variant="outlined" onChange={
                (e) => {
                    setX(e.target.value);
                    if (isNumeric(e.target.value)) {
                        const newState = {...state};
                        newState.position.x = +e.target.value;
                        dispatch( { type: 'modify', state: newState});
                    }
                }
            } value={x} />
            <TextField label="Outlined" variant="outlined" onChange={
                (e) => {
                    setY(e.target.value);
                    if (isNumeric(e.target.value)) {
                        const newState = {...state};
                        newState.position.y = +e.target.value;
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