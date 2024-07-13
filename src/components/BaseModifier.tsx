import { Input, Stack, TextField } from "@mui/material";
import { MyStore } from "./StateContext";
import { BaseState } from "./ComponentMapper";
import { useState } from "react";

function isNumeric(str: string) {
    return !isNaN(+str) &&
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  }

export default function BaseModifier({ state, modifyComponent }: { state: BaseState, modifyComponent: (c: BaseState) => MyStore }) {
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
                        modifyComponent(newState);
                    }
                }
            } value={x} />
            <TextField label="Outlined" variant="outlined" onChange={
                (e) => {
                    setY(e.target.value);
                    if (isNumeric(e.target.value)) {
                        const newState = {...state};
                        newState.offset.y = +e.target.value;
                        modifyComponent(newState);
                    }
                }
            } value={y} />
        </Stack>
    )
}