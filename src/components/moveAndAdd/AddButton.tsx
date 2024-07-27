import { Button } from "@mui/material";
import { DispactherAction, MyStore } from "../StoreContext";
import { createDefaultState, MyTreeElement } from "../ComponentMapper";
import AddIcon from "@mui/icons-material/Add";
import { useContext, useState } from "react";
import ComponentEnum from "../ComponentEnum";
import { MaxTimeContext } from "../TimeContext";
import AddDialog from "./AddDialog";

export default function AddButton({ dispatch, state }: {
    dispatch: DispactherAction,
    state: MyStore
}) {
    const [isDialogVisible, setIsDialogVisible] = useState<boolean>(false);
    return (
        <div>
            { isDialogVisible? (<AddDialog onClose={() => setIsDialogVisible(false)} dispatch={dispatch} state={state}/>) : undefined}
            <Button onClick={() => setIsDialogVisible(true)} startIcon={<AddIcon />}>
                Add
            </Button>
        </div>
    );
}