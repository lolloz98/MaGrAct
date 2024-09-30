import { useContext, useState } from "react";
import {
  Button,
  Select,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Stack,
  Divider,
  List,
  ListItemText,
} from "@mui/material";
import styles from "./AddDialog.module.css";
import { createDefaultState } from "../ComponentMapper";
import ComponentEnum from "../ComponentEnum";
import { DispactherAction, MyStore } from "../StoreContext";
import { MoveDialogType, stringifyMoveDialog, useListingItems } from "./moveAndAddUtils";
import { myRange } from "../Utils";
import { MaxTimeContext } from "../TimeContext";

export default function AddDialog({ state, onClose, dispatch }:
  { state: MyStore, onClose: () => void, dispatch: DispactherAction }) {

  const [elType, setElType] = useState<ComponentEnum>(ComponentEnum.FUNCTION);
  const [title, setTitle] = useState<string>();
  const maxTime = useContext(MaxTimeContext);
  // fake state: id must not be present in list!
  const sel: MoveDialogType = { id: "-1", title: "" };

  const { selected,
    newParent,
    newParentSiblingsList,
    eligibleParents,
    posConstraints,
    pos, onChange, onChangePos } = useListingItems(state, sel);

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>Add new Item</DialogTitle>
      <DialogContent className={styles.content} sx={{
        '& .MuiTextField-root': { mt: 1 },
      }} style={{ overflowY: 'hidden' }}>
        <Stack direction={"row"} spacing={1} paddingTop={1} alignItems={"center"} justifyContent={'space-around'}>

          <Stack direction={"column"} spacing={1} paddingTop={1}>
            <TextField label="Title" placeholder={elType} 
              onChange={(e) => setTitle((e.target as HTMLInputElement).value)}
              value={title} InputLabelProps={{ shrink: true }}
              inputProps={{
                sx: {
                  "&::placeholder": {
                    color: "gray"
                  }
                }
              }} />
            <FormControl className={styles.select}>
              <InputLabel id="graphic-type-label">Graphic Type</InputLabel>
              <Select
                label="Graphic Type"
                labelId="graphic-type-label"
                onChange={(e) => setElType(e.target.value as ComponentEnum)}
                value={elType}
              >
                {
                  Object
                    .values(ComponentEnum)
                    .filter((v) => (isNaN(Number(v)) && v !== (ComponentEnum.UNKOWN)))
                    .map((v) => {
                      return (
                        <MenuItem value={v} key={v}>{v}</MenuItem>
                      )
                    })
                }
              </Select>
            </FormControl>
            <FormControl className={styles.select}>
              <InputLabel id="new-parent-label">Select New Parent</InputLabel>
              <Select label="Select New Parent" labelId="new-parent-label" onChange={(e) => onChange(selected, JSON.parse(e.target.value as string) as MoveDialogType)} value={stringifyMoveDialog(newParent)}>
                <MenuItem value={stringifyMoveDialog({ id: "0", title: "(root)" })}>(root)</MenuItem>
                {eligibleParents
                  .map((c) => (
                    <MenuItem key={c.id} value={stringifyMoveDialog({ id: c.id, title: c.title })}>
                      {c.title}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <FormControl className={styles.select}>
              <InputLabel id="new-position-label">Select New Position</InputLabel>
              <Select label="Select New Position" labelId="new-position-label" onChange={(e) => onChangePos(e.target.value as number)} value={pos}>
                {myRange(0, posConstraints)
                  .map((c) => (
                    <MenuItem key={c} value={`${c}`}>
                      {c}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Stack>
          <Stack direction={"column"} width={"50%"}>
            <Typography>{`In Selected Parent`}</Typography>
            <Divider />
            <List style={{ maxHeight: 400, overflow: 'auto' }}>
              {newParentSiblingsList.map((c, i) => {
                return (<ListItemText key={c.id}
                  primary={`${i} ${c.title}`}
                />);
              })}
            </List>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={() => {
            dispatch({ type: 'add', state: createDefaultState(elType, title === "" ? elType : title, maxTime), index: pos, parent: newParent.id });
            onClose();
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};