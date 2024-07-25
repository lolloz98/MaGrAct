import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { DispactherAction, MyStore } from "../StoreContext";
import styles from './MySettingsDialog.module.css';
import SettingsIcon from '@mui/icons-material/Settings';
import { useContext, useState } from "react";
import MyTextInput from "../inputs/MyTextInput";
import MyNumbericInput from "../inputs/MyNumericInput";
import { getDefaultBaseState } from "../states/BaseState";
import ComponentEnum from "../ComponentEnum";
import { MaxTimeContext, TimeContext } from "../TimeContext";

export default function MySettingsDialog({ dispatch, state }: {
    dispatch: DispactherAction,
    state: MyStore
}) {
    const [openSettings, setOpenSettings] = useState(false);
    const t = useContext(MaxTimeContext);

    return (
        <Box>
            <Button startIcon={(<SettingsIcon />)} onClick={() => setOpenSettings(true)}>Settings</Button>
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