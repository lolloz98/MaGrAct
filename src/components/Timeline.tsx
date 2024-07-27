import { IconButton, Slider, Stack, Tooltip, Typography } from "@mui/material";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import React, { useContext, useEffect } from "react";
import { TimeContext } from "./TimeContext";

export default function MyTimeline({ tick, setTick, step, maxTicks }: {
    tick: number,
    setTick: (t: number) => void,
    step: number,
    maxTicks: number
}) {
    const [play, setPlay] = React.useState<boolean>(false);
    const time = useContext(TimeContext);
    const numberOfMarks = 10;
    const marks = Array.from({ length: numberOfMarks + 1 }, (value, key) => { return { value: Math.round(maxTicks * key / numberOfMarks) }; })

    const getFormattedTime = () => {
        return time.toFixed(2);
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (play) setTick((tick + 1) % (maxTicks + 1));
        }, step);
        return () => clearInterval(interval);
    }, [tick, play, step]);

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        setPlay(false);
        setTick(newValue as number);
    };

    return (
        <Stack
            direction="row"
            justifyContent="space-around"
            alignContent={"center"}
            padding="16px"
            alignItems="center"
            width={"100%"}
            spacing={8}
            flexGrow={1}
        >
            <Tooltip title={play ? "Pause" : "Play"} >
                <IconButton color="primary" onClick={() => setPlay(!play)}>{play ? <PauseCircleIcon fontSize="large" /> : <PlayCircleIcon fontSize="large" />}</IconButton>
            </Tooltip>
            <Slider
                style={{ minWidth: 200 }}
                value={tick}
                onChange={handleSliderChange}
                marks={marks}
                max={maxTicks}
                track={false} />
            <Typography style={{ width: "100px" }}>{getFormattedTime()}</Typography>
        </Stack>
    );
}