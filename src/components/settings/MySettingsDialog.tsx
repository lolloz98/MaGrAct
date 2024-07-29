import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, List, ListItem, Stack, Tooltip, Typography } from "@mui/material";
import { DispactherAction, MyStore } from "../StoreContext";
import styles from './MySettingsDialog.module.css';
import SettingsIcon from '@mui/icons-material/Settings';
import SaveIcon from '@mui/icons-material/Save';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import { ChangeEvent, useContext, useEffect, useState } from "react";
import MyNumbericInput from "../inputs/MyNumericInput";
import { getDefaultBaseState } from "../states/BaseState";
import ComponentEnum from "../ComponentEnum";
import { MaxTimeContext } from "../TimeContext";
import { toJson } from "../saveAndLoad/save";
import { fromJson } from "../saveAndLoad/load";
import { saveAs } from "file-saver";
import KeyboardIcon from '@mui/icons-material/Keyboard';
import GitHubIcon from '@mui/icons-material/GitHub';
import keyBindingsDescr from "./KeyBindingsDescr";
import React from "react";

export default function MySettingsDialog({ dispatch, state }: {
    dispatch: DispactherAction,
    state: MyStore
}) {
    const [openSettings, setOpenSettings] = useState(false);
    const [openKeyBindings, setOpenKeyBindings] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const t = useContext(MaxTimeContext);

    const onSave = () => {
        setIsSaving(true);
        saveAs(new Blob([toJson(state)]), 'example.magract');
        setIsSaving(false);
    }

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const code = event.key;
            if ((event.ctrlKey || event.metaKey) && code === 's') {
                event.preventDefault();
                onSave();
            }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

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
                    <Button component="label"><FileOpenIcon /><input type="file" hidden onChange={handleFileChange} /></Button>
                </Tooltip>
                {isSaving ? <CircularProgress color="primary" /> : <Tooltip title={"Download"}>
                    <Button onClick={onSave}><SaveIcon /></Button>
                </Tooltip>}
                <Tooltip title={"Some Key Bindings"}>
                    <Button onClick={() => setOpenKeyBindings(true)}><KeyboardIcon /></Button>
                </Tooltip>
                <Tooltip title={"GitHub Repository"}>
                    <Button onClick={() => window.open('https://github.com/lolloz98/MaGrAct', '_blank')}><GitHubIcon /></Button>
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
                                get={() => state.maxTicks} set={() => { }} state={getDefaultBaseState('-1', ComponentEnum.UNKOWN, "lol", 0)} />
                            <Typography paddingInline={2}>Time: {t}</Typography>
                        </Stack>
                    </Box>
                    <DialogActions>
                        <Button onClick={() => setOpenSettings(false)}>Close</Button>
                    </DialogActions>
                </Dialog>}
            {openKeyBindings &&
                <Dialog open={openKeyBindings} onClose={() => setOpenKeyBindings(false)}>
                    <DialogTitle>Key Bindings</DialogTitle>
                    <Grid container margin={2} maxWidth={500}>
                        {keyBindingsDescr.map((v) => {
                            return (
                                <React.Fragment>
                                    <Grid container direction={'row'} alignItems={'center'}>
                                        <Grid item xs={3}>
                                            <Typography>{v.k.join(" + ")}</Typography>
                                        </Grid>
                                        <Grid item xs={9}>
                                            <Typography>{v.d}</Typography>
                                        </Grid>
                                    </Grid>
                                </React.Fragment>
                            );
                        }).reduce((prev, curr) => {
                            return (
                                <div>
                                    {prev}
                                    <Divider/>
                                    {curr}
                                </div>
                            )
                        })}
                    </Grid>
                    <DialogActions>
                        <Button onClick={() => setOpenKeyBindings(false)}>Close</Button>
                    </DialogActions>
                </Dialog>}
        </Box>
    );
}