import React, { useEffect, ReactElement } from 'react';
import './App.css';
import Slider from '@mui/material/Slider';
import { Box, Button, Stack } from '@mui/material';
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
import MyKatex from './components/graphic/MyKatex';
import ListOfControls from './components/controls/ListOfControls';
import BaseState from './components/states/BaseState';

function checkAndUpdateTitle(state: BaseState, draft: MyStore) {
  const t = state.title;
  let n = 1;
  while (draft.titles.has(state.title)) {
    state.title = `${t}_${n++}`;
  }
  draft.titles.add(state.title);
}

function reducer(
  draft: Draft<MyStore>,
  action: StoreAction
) {
  switch (action.type) {
    case 'reset':
      return rawReturn(initState);
    case 'delete':
      const cur = draft.components.filter(c => c.id === action.id)[0];
      draft.titles.delete(cur.title);
      draft.components = draft.components.filter(c => c.id !== action.id);
      draft.selected = draft.selected.filter(id => id !== action.id);
      return draft;
    case 'add':
      checkAndUpdateTitle(action.state, draft);
      return void draft.components.push(action.state);
    case 'modify':
      const ind = draft.components.findIndex(a => a.id === action.state.id);
      const prev = draft.components[ind];
      if (prev.title !== action.state.title) {
        draft.titles.delete(prev.title);
        checkAndUpdateTitle(action.state, draft);
      }
      draft.components[ind] = action.state;
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
  console.log(JSON.stringify(state));

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
  const modifiers: ReactElement[] = [];
  const selected = [];
  for (const comp of state.components) {
    children.push(getComponent(comp, dispacth));
    const control = getModifier(comp, dispacth);
    if (control && control as ReactElement) modifiers.push(control);
    if (isContained(state.selected, comp)) {
      selected.push(getModifier(comp, dispacth))
    }
  }

  return (
    <div className="App">
      <Stack justifyContent="space-around" padding="16px">
        <Stack alignItems="center" justifyContent="space-around" direction="row">
          <TimeContext.Provider value={getTime(tick)}>
            <StageWithReactiveDimen dispatch={dispacth}>
              <Layer>
                <MyKatex></MyKatex>
                {children}    
              </Layer>
            </StageWithReactiveDimen>
          </TimeContext.Provider>
          <Box
            sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            className={"scrollModifiers"}
          >
          <Stack overflow={"auto"} spacing={2} direction="column">
            <ListOfControls>
              {modifiers}
            </ListOfControls>
          </Stack>
          </Box>
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
      </Stack>
    </div>
  );
}

export default App;
