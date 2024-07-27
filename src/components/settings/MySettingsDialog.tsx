import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField, Typography } from "@mui/material";
import { DispactherAction, MyStore } from "../StoreContext";
import styles from './MySettingsDialog.module.css';
import SettingsIcon from '@mui/icons-material/Settings';
import SaveIcon from '@mui/icons-material/Save';
import { ChangeEvent, useContext, useState } from "react";
import MyTextInput from "../inputs/MyTextInput";
import MyNumbericInput from "../inputs/MyNumericInput";
import { getDefaultBaseState } from "../states/BaseState";
import ComponentEnum from "../ComponentEnum";
import { MaxTimeContext, TimeContext } from "../TimeContext";
import { toJson } from "../saveAndLoad/save";
import save from "save-file";
import { fromJson } from "../saveAndLoad/load";

export default function MySettingsDialog({ dispatch, state }: {
    dispatch: DispactherAction,
    state: MyStore
}) {
    const [openSettings, setOpenSettings] = useState(false);
    const t = useContext(MaxTimeContext);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          console.log(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            const obj = fromJson(result);
            if (obj !== undefined)
                dispatch({ type: 'load_from_file', newStore: obj });
            else
                console.error(`Could not load file ${file}`);
          };
          reader.readAsText(file);
        }
      };

    return (
        <Box>
            <Stack direction={"row"} justifyContent={"center"} width={"100%"} alignItems={"center"}>
                <Button startIcon={(<SettingsIcon />)} onClick={() => setOpenSettings(true)}>Settings</Button>
                <Button startIcon={(<SaveIcon />)} onClick={() => save(toJson(state), 'example.magract')}>Save</Button>
                <TextField type='file'variant="outlined" onChange={handleFileChange}></TextField>
            </Stack>
            {openSettings &&
                <Dialog open={openSettings} onClose={() => setOpenSettings(false)}>
                    <DialogTitle>Settings</DialogTitle>
                    <DialogContent className={styles.content} sx={{
                        '& .MuiTextField-root': { mt: 2 },
                    }} style={{ overflowY: 'hidden' }}></DialogContent>
                        {/* this numberic input is a bit of an hack... */}
                        <Box margin={4}>
                            <Stack direction='row' alignItems={'center'} alignContent={'space-around'} >
                                <MyNumbericInput label='Max Ticks (Time)' actionType='set_max_ticks' dispatch={dispatch} 
                                    get={() => state.maxTicks} set={() => {}} state={getDefaultBaseState('-1', ComponentEnum.UNKOWN, "lol", 0)} />
                                <Typography paddingInline={2}>Time: {t}</Typography>
                            </Stack>
                        </Box>
                    <DialogActions>
                        <Button onClick={() => setOpenSettings(false)}>Close</Button>
                    </DialogActions>
                </Dialog>}
        </Box>
    );
}