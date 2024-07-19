import React, { useEffect, ReactElement } from 'react';
import './App.css';
import Slider from '@mui/material/Slider';
import { Box, Button, createTheme, CssBaseline, PaletteMode, Stack, ThemeProvider } from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import { Layer } from 'react-konva';
import { StageWithReactiveDimen } from './components/graphic/StageWithReactiveDimen';
import { TimeContext } from './components/TimeContext';
import { Draft, rawReturn } from 'mutative';
import { initState, MyStore, StoreAction } from './components/StoreContext';
import { createDefaultState, getComponent, getModifier, isContained, MyTreeElement } from './components/ComponentMapper';
import ComponentEnum from './components/ComponentEnum';
import { useMutativeReducer } from 'use-mutative';
import MyKatex from './components/graphic/MyKatex';
import ListOfControls from './components/controls/ListOfControls';
import BaseState from './components/states/BaseState';
import TitleList from './components/titles/TitleList';

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...{
      // palette values for dark mode
      background: {
        default: "#202020",
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          "*": {
            margin: 0,
            padding: 0
          },
          ul: {
            listStyle: "none"
          }
        }
      },
      MuiSvgIcon: {
        styleOverrides: {
          root: { verticalAlign: "middle" }
        }
      }
    }
  },
});

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
  console.trace(action);
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
    case 'reorder':
      // todo: handle reorder when elements can be nested
      const indexFrom = draft.components.findIndex(a => a.id === action.id);
      const indexTo = action.index;
      [draft.components[indexFrom], draft.components[indexTo]] = [draft.components[indexTo], draft.components[indexFrom]]; 
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
  const [mode, setMode] = React.useState<PaletteMode>('dark');
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

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
  const tree: MyTreeElement[] = [];
  for (const comp of state.components) {
    const cur = getComponent(comp, dispacth);
    if (cur.jsx) {
      children.push(cur.jsx);
    } else {
      console.error(`Component was undefined ${comp}`);
      continue;
    }
    tree.push(cur.treeEl);
    const control = getModifier(comp, dispacth);
    if (control && control as ReactElement) modifiers.push(control);
    if (isContained(state.selected, comp)) {
      selected.push(getModifier(comp, dispacth))
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main className="App">
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
            <Stack direction={"column"}>
              <ListOfControls>
                {modifiers}
              </ListOfControls>
              <TitleList tree={tree} dispatch={dispacth}/>
            </Stack>
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
            onClick={() => dispacth({
              type: 'add',
              state: createDefaultState(ComponentEnum.AXES)
            })}
            style={{ width: "150px" }}
          >
            {"Add"}
          </Button>
        </Stack>
      </main>
    </ThemeProvider>
  );
}

export default App;
