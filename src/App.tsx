import React, { useEffect } from 'react';
import './App.css';
import Slider from '@mui/material/Slider';
import { Button } from '@mui/material';



function App() {
  const [value, setValue] = React.useState<number>(0);
  const [play, setPlay] = React.useState<boolean>(false);
  const max = 100;
  
  const handleChange = (event: Event, newValue: number | number[]) => {
    setValue(newValue as number);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (play) setValue(value => (value + 1) % max);
    }, 1000);
    return () => clearInterval(interval);
  }, [value, play]);

  return (
    <div className="App">
      <Slider 
        aria-label="Volume" 
        value={value} 
        onChange={handleChange}
        max={max} />
      <Button variant="text" onClick={() => setPlay(!play)}>{play? "Pause": "Play"}</Button>
    </div>
  );
}

export default App;
