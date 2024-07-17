import { Button, Input, Stack, TextField } from "@mui/material";
import { DispactherAction, MyStore } from "../StoreContext";
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from "react";
import { isNumeric } from "../Utils";
import BaseState from "../states/BaseState";
import MyCustomInput from "./MyCustomInput";


export default function BaseControl({ state, dispatch }: { state: BaseState, dispatch: DispactherAction }) {
    const [x, setX] = useState<string|number>(state.position.x);
    const [y, setY] = useState<string|number>(state.position.y);

    return (
        <Stack border={1} borderRadius={2}>
            <Button startIcon={<DeleteIcon />} onClick={() => dispatch({ type: "delete", id: state.id })}/>
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