import { Box, Stack } from "@mui/material";
import { ReactElement } from "react";

export default function ListOfControls({ children }: { children?: ReactElement[] }) {

    return (<Box
        sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        className={"scrollModifiers"}
    >
        <Stack overflow={"auto"} spacing={2} direction="column">
            {children}
        </Stack>
    </Box>)
}