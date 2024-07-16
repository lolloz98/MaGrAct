import { Input, Stack, TextField } from "@mui/material";
import { DispactherAction, MyStore } from "../StoreContext";
import { useEffect, useState } from "react";
import { isNumeric } from "../Utils";
import FunctionState from "../states/FunctionState";
import MyCustomInput from "./CustomTextField";

export default function FunctionControl({ state, dispatch }: { state: FunctionState, dispatch: DispactherAction }) {
    const [x, setX] = useState<string|number>(state.position.x);
    const [y, setY] = useState<string|number>(state.position.y);
    const [f, setF] = useState<string>(state.f);
    const [t, setT] = useState<string>(state.title);

    useEffect(() => {
        setX(state.position.x);
        setY(state.position.y);
        setF(state.f);
    }, [state])

    return (
        <Stack border={1}>
            <MyCustomInput label="Outlined" variant="outlined" onMyChange={
                (e) => {
                    const val = (e.target as HTMLInputElement).value;
                    setX(val);
                    if (isNumeric(val)) {
                        const newState = {...state};
                        newState.position.x = +val;
                        dispatch( { type: 'modify', state: newState});
                    }
                }
            } onMyInput={(e) => setX((e.target as HTMLInputElement).value)} value={x} />
            <MyCustomInput label="Outlined" variant="outlined" onMyChange={
                (e) => {
                    const val = (e.target as HTMLInputElement).value;
                    setY(val);
                    if (isNumeric(val)) {
                        const newState = {...state};
                        newState.position.y = +val;
                        dispatch( { type: 'modify', state: newState});
                    }
                }
            } onMyInput={(e) => setY((e.target as HTMLInputElement).value)} value={y} />
        </Stack>
    )
}