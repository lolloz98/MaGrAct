import React, { useState } from "react";
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
  SelectChangeEvent,
} from "@mui/material";
import styles from "./AddDialog.module.css";
import { MyTreeElement } from "../ComponentMapper";
import ComponentEnum from "../ComponentEnum";

type Props = {
  tree: MyTreeElement[];
  onClose: () => void;
  onSubmit: (stateType: ComponentEnum, title: string | undefined) => void;
};

export const AddDialog: React.FC<Props> = (props) => {
  const [title, setTitle] = useState("");
  const [parent, setParent] = useState<string | number>(0);
  const [elType, setElType] = useState<ComponentEnum>(ComponentEnum.FUNCTION);

  const handleChangeText = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTitle(e.target.value);
  };

  const handleChangeParent = (e: SelectChangeEvent<string | number>) => {
    setParent(e.target.value);
  };

  return (
    <Dialog open={true} onClose={props.onClose}>
      <DialogTitle>Add New Graphic</DialogTitle>
      <DialogContent className={styles.content} sx={{
            '& .MuiTextField-root': { mt: 1 },
        }}>
        <TextField label="Title" placeholder={elType} onChange={(e) => handleChangeText(e)} value={title} InputLabelProps={{ shrink: true }}
          inputProps={{
            sx: {
              "&::placeholder": {
                color: "gray"
              }
            }
          }} />
          <FormControl className={styles.select}>
            <InputLabel id="parent-input-label">Parent</InputLabel>
            <Select label="Parent" labelId="parent-input-label" onChange={(e) => handleChangeParent(e)} value={parent}>
              <MenuItem value={0}>(root)</MenuItem>
              {props.tree
                .filter((node) => node.data?.isParent === true)
                .map((node) => (
                  <MenuItem key={node.id} value={node.id}>
                    {node.text}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
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
                        <MenuItem value={v}>{v}</MenuItem>
                    )})
                }
              </Select>
            </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
        <Button
          onClick={() =>{
              props.onSubmit(elType, title === ""? elType :title);
              props.onClose();
            }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};
