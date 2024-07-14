import React, { useEffect } from 'react';
import './App.css';
import Slider from '@mui/material/Slider';
import { Button, Stack } from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import { Layer } from 'react-konva';
import { StageWithReactiveDimen } from './components/graphic/StageWithReactiveDimen';
import { TimeContext } from './components/TimeContext';
import { Draft, rawReturn } from 'mutative';
import { initState, MyStore, StoreAction } from './components/StoreContext';
import { createDefaultState, getComponent, getModifier, isContained } from './components/ComponentMapper';
import ComponentEnum from './components/ComponentEnum';
import { useMutativeReducer } from 'use-mutative';

function reducer(
  draft: Draft<MyStore>,
  action: StoreAction
) {
  switch (action.type) {
    case 'reset':
      return rawReturn(initState);
    case 'delete':
      draft.components = draft.components.filter(c => c.id !== action.id);
      draft.selected = draft.selected.filter(id => id !== action.id);
      return draft;
    case 'add':
      return void draft.components.push(action.state);
    case 'modify':
      draft.components[draft.components.findIndex(a => a.id === action.state.id)] = action.state;
      return draft;
    case 'changeSelection':
      for (const id of action.ids) {
        draft.selected.push(id);
      }
      return draft;
  }
}

function useMyMutative() {
  let [state, dispacth] = useMutativeReducer(
    reducer,
    initState
  );

  return { state, dispacth }
}


function App() {
  const [tick, setTick] = React.useState<number>(0);
  const [play, setPlay] = React.useState<boolean>(false);
  const step = 50;
  const maxTicks = 100;
  const { state, dispacth } = useMyMutative();

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
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
  const marks = Array.from({ length: numberOfMarks + 1 }, (value, key) => { return { value: Math.round(maxTicks * key / numberOfMarks) }; })

  const children = [];
  const modifiers = [];
  const selected = [];
  for (const comp of state.components) {
    children.push(getComponent(comp));
    modifiers.push(getModifier(comp, dispacth));
    if (isContained(state.selected, comp)) {
      selected.push(getModifier(comp, dispacth))
    }
  }

  return (
    <div className="App">
      <Stack justifyContent="space-around" padding="16px">
        <Stack alignItems="center">
          <TimeContext.Provider value={getTime(tick)}>
            <StageWithReactiveDimen dispatch={dispacth}>
              <Layer>
                {children}    
              </Layer>
            </StageWithReactiveDimen>
          </TimeContext.Provider>
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-around"
          padding="16px"
          alignItems="stretch"
          spacing={8}
          flexGrow={1}
        >
          <Button
            variant="outlined"
            startIcon={play ? <PauseCircleIcon /> : <PlayCircleIcon />}
            onClick={() => setPlay(!play)}
            style={{ width: "150px" }}
          >
            {play ? "Pause" : "Play"}
          </Button>
          <Slider
            value={tick}
            onChange={handleSliderChange}
            marks={marks}
            max={maxTicks}
            track={false} />
          <p style={{ width: "100px" }}>{getFormattedTime(tick)}</p>
        </Stack>
        <Button
            variant="outlined"
            onClick={() => dispacth( {
              type: 'add',
              state: createDefaultState(ComponentEnum.FUNCTION)
            })}
            style={{ width: "150px" }}
          >
            {"Add"}
        </Button>
        {modifiers}
      </Stack>
    </div>
  );
}

export default App;
