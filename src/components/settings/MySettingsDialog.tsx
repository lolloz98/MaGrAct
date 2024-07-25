import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { DispactherAction, MyStore } from "../StoreContext";
import styles from './MySettingsDialog.module.css';
import SettingsIcon from '@mui/icons-material/Settings';
import { useState } from "react";

export default function MySettingsDialog({ dispatch, state }: {
    dispatch: DispactherAction,
    state: MyStore
}) {
    const [openSettings, setOpenSettings] = useState(false);

    return (
        <Box>
            <Button startIcon={(<SettingsIcon />)} onClick={() => setOpenSettings(true)}>Settings</Button>
            {openSettings &&
                <Dialog open={openSettings} onClose={() => setOpenSettings(false)}>
                    <DialogTitle>Settings</DialogTitle>
                    <DialogContent className={styles.content} sx={{
                        '& .MuiTextField-root': { mt: 1 },
                    }} style={{ overflowY: 'hidden' }}></DialogContent>

                    <DialogActions>
                        <Button onClick={() => setOpenSettings(false)}>Close</Button>
                    </DialogActions>
                </Dialog>}
        </Box>
    );
}