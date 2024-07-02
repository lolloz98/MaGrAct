import React, { useEffect } from 'react';
import './App.css';
import Slider from '@mui/material/Slider';
import { Box, Button, Stack } from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';



function App() {
  const [tick, setTick] = React.useState<number>(0);
  const [play, setPlay] = React.useState<boolean>(false);
  const step = 50;
  const maxTicks = 100;
  
  const handleChange = (event: Event, newValue: number | number[]) => {
    setPlay(false);
    setTick(newValue as number);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (play) setTick(tick => (tick + 1) % (maxTicks + 1));
    }, step);
    return () => clearInterval(interval);
  }, [tick, play, step]);

  const getTime = (tick: number) => {
    return step * tick / 1000;
  }

  const getFormattedTime = (tick: number) => {
    return getTime(tick).toFixed(2);
  }

  const numberOfMarks = 10;
  const marks = Array.from({length: numberOfMarks + 1}, (value, key) => { return {value: Math.round(maxTicks * key / numberOfMarks)}; })

  return (
    <div className="App">
      <Stack 
        direction="row" 
        justifyContent="space-around"
        padding="16px"
        alignItems="center"
        spacing={8}
      >
        <Button 
          variant="outlined" 
          startIcon={play? <PauseCircleIcon />: <PlayCircleIcon />} 
          onClick={() => setPlay(!play)}
          style={{width: "150px"}}
        >
          {play? "Pause": "Play"}
        </Button>
        <Slider 
          value={tick} 
          onChange={handleChange}
          marks={marks}
          max={maxTicks} 
          track={false}/>
        <p style={{width: "100px"}}>{getFormattedTime(tick)}</p>
      </Stack>
    </div>
  );
}

export default App;
