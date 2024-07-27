import { Button, Tooltip } from "@mui/material";
import { DispactherAction, MyStore } from "../StoreContext";
import { useState } from "react";
import MoveDialog from "./MoveDialog";
import ReorderIcon from '@mui/icons-material/Reorder';

export default function MoveButton({ dispatch, store }: {
    dispatch: DispactherAction,
    store: MyStore
}) {
    const [isDialogVisible, setIsDialogVisible] = useState<boolean>(false);
    return (
        <div>
            { isDialogVisible? (<MoveDialog onClose={() => setIsDialogVisible(false)} state={store} dispatch={dispatch}/>) : undefined}
            <Tooltip title={"Drag & Drop is unstable and might not work. Use this as an alternative"}>
                <Button onClick={() => setIsDialogVisible(true)} startIcon={<ReorderIcon />}>Move</Button>
            </Tooltip>
        </div>
    );
}