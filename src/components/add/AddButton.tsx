import { Button } from "@mui/material";
import { DispactherAction } from "../StoreContext";
import { createDefaultState, MyTreeElement } from "../ComponentMapper";
import AddIcon from "@mui/icons-material/Add";
import { useContext, useState } from "react";
import { AddDialog } from "./AddDialog";
import ComponentEnum from "../ComponentEnum";
import { MaxTimeContext } from "../TimeContext";

export default function AddButton({ dispatch, tree }: {
    dispatch: DispactherAction,
    tree: MyTreeElement[]
}) {
    const maxTime = useContext(MaxTimeContext);
    const [isDialogVisible, setIsDialogVisible] = useState<boolean>(false);
    return (
        <div>
            { isDialogVisible? (<AddDialog onClose={() => setIsDialogVisible(false)} tree={tree} onSubmit={
                (stateType: ComponentEnum, title: string | undefined) => dispatch({
                    type: 'add',
                    state: createDefaultState(stateType, title, maxTime)
                })
            }/>) : undefined}
            <Button onClick={() => setIsDialogVisible(true)} startIcon={<AddIcon />}>
                Add
            </Button>
        </div>
    );
}