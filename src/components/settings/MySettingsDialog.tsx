import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Tooltip, Typography } from "@mui/material";
import { DispactherAction, MyStore } from "../StoreContext";
import styles from './MySettingsDialog.module.css';
import SettingsIcon from '@mui/icons-material/Settings';
import SaveIcon from '@mui/icons-material/Save';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import { ChangeEvent, useContext, useState } from "react";
import MyNumbericInput from "../inputs/MyNumericInput";
import { getDefaultBaseState } from "../states/BaseState";
import ComponentEnum from "../ComponentEnum";
import { MaxTimeContext } from "../TimeContext";
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
            try {
            const obj = fromJson(result);
                if (obj !== undefined)
                    dispatch({ type: 'load_from_file', newStore: obj });
                else
                    console.error(`Could not load file ${file}`);
            } catch (e) {
                alert("Could not load the file. Please check that it's a valid .magract file");
            }
          };
          reader.readAsText(file);
        }
      };

    return (
        <Box>
            <Stack direction={"row"} justifyContent={"center"} width={"100%"} alignItems={"center"}>
                <Tooltip title={"Settings"}>
                    <Button onClick={() => setOpenSettings(true)}><SettingsIcon /></Button>
                </Tooltip>
                <Tooltip title={"Upload From File"}>
                    <Button component="label"><FileOpenIcon /><input type="file"  hidden onChange={handleFileChange} /></Button>
                </Tooltip>
                <Tooltip title={"Download"}>
                    <Button onClick={() => save(toJson(state), 'example.magract')}><SaveIcon /></Button>
                </Tooltip>

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