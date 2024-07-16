import { Input, Stack, TextField } from "@mui/material";
import { DispactherAction, MyStore } from "../StoreContext";
import { useEffect, useState } from "react";
import { isNumeric } from "../Utils";
import FunctionState from "../states/FunctionState";
import MyCustomInput from "./MyCustomInput";

export default function FunctionControl({ state, dispatch }: { state: FunctionState, dispatch: DispactherAction }) {
    return (
        <Stack border={1}>
            <MyCustomInput label="Outlined" variant="outlined" onMyChange={
                (e) => {
                    const val = (e.target as HTMLInputElement).value;
                    if (isNumeric(val)) {
                        const newState = {...state};
                        newState.position.x = +val;
                        dispatch( { type: 'modify', state: newState});
                    }
                }
            } state={`${state.position.x}`} />
            <MyCustomInput label="Outlined" variant="outlined" onMyChange={
                (e) => {
                    const val = (e.target as HTMLInputElement).value;
                    if (isNumeric(val)) {
                        const newState = {...state};
                        newState.position.y = +val;
                        dispatch( { type: 'modify', state: newState});
                    }
                }
            } state={`${state.position.y}`} />
        </Stack>
    )
}