import { Input, Stack, TextField } from "@mui/material";
import { DispactherAction, MyStore } from "../StoreContext";
import { useEffect, useState } from "react";
import { isNumeric } from "../Utils";
import FunctionState from "../states/FunctionState";
import MyCustomInput from "./MyCustomInput";

export default function FunctionControl({ state, dispatch }: { state: FunctionState, dispatch: DispactherAction }) {
    return (
        <Stack border={1} borderRadius={2}>
            <MyCustomInput label="Title" variant="outlined" onMyChange={
                (e) => {
                    const val = (e.target as HTMLInputElement).value;
                    const newState = { ...state };
                    newState.title = val;
                    dispatch({ type: 'modify', state: newState });
                }
            } state={`${state.title}`} />
            <Stack direction={"row"} spacing={1}>
                <MyCustomInput label="Position_X" variant="outlined" onMyChange={
                    (e) => {
                        const val = (e.target as HTMLInputElement).value;
                        if (isNumeric(val)) {
                            const newState = { ...state };
                            newState.position.x = +val;
                            dispatch({ type: 'modify', state: newState });
                        }
                    }
                } state={`${state.position.x}`} />
                <MyCustomInput label="Position_Y" variant="outlined" onMyChange={
                    (e) => {
                        const val = (e.target as HTMLInputElement).value;
                        if (isNumeric(val)) {
                            const newState = { ...state };
                            newState.position.y = +val;
                            dispatch({ type: 'modify', state: newState });
                        }
                    }
                } state={`${state.position.y}`} />
            </Stack>
        </Stack>
    )
}