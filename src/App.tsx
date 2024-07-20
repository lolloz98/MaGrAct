import React, { useEffect, ReactElement } from 'react';
import './App.css';
import Slider from '@mui/material/Slider';
import { Box, Button, createTheme, CssBaseline, PaletteMode, Stack, ThemeProvider } from '@mui/material';
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
import MyTimeline from './components/Timeline';
import AddIcon from "@mui/icons-material/Add";
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';
import 'react-reflex/styles.css'


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
  console.debug(action);
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
      draft.selected_from_list = action.state;
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
      if (action.ids.length > 0) {
        draft.selected_from_list = draft.components.find(a => a.id === action.ids[0]);
      }
      return draft;
    case 'reorder':
      // todo: handle reorder when elements can be nested
      const indexFrom = draft.components.findIndex(a => a.id === action.id);
      const indexTo = action.index;
      [draft.components[indexFrom], draft.components[indexTo]] = [draft.components[indexTo], draft.components[indexFrom]];
      return draft;
    case 'select_from_list':
      draft.selected_from_list = action.state;
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
  const step = 50;

  const { state, dispacth } = useMyMutative();
  const getTime = (tick: number) => {
    return step * tick / 1000;
  }

  const children = [];
  let selectedController: ReactElement | undefined = undefined;
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
    if (comp.id === state.selected_from_list?.id) {
      selectedController = getModifier(comp, dispacth);
    }

    if (isContained(state.selected, comp)) {
      selected.push(getModifier(comp, dispacth))
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <TimeContext.Provider value={getTime(tick)}>
        <CssBaseline />
        <main className="App">
          <ReflexContainer orientation="vertical" style={{ height: '100vh' }} >
            <ReflexElement flex={2}>
              <ReflexContainer orientation="horizontal" style={{ height: '100vh' }} >

                <ReflexElement propagateDimensionsRate={200}
                  propagateDimensions={true}
                  flex={5}>
                  <StageWithReactiveDimen dispatch={dispacth} >
                    <Layer>
                      <MyKatex></MyKatex>
                      {children}
                    </Layer>
                  </StageWithReactiveDimen>
                </ReflexElement>

                <ReflexSplitter />

                <ReflexElement propagateDimensionsRate={200}
                  propagateDimensions={true}
                  flex={1}>
                  <MyTimeline tick={tick} setTick={setTick} step={step} />
                </ReflexElement>
              </ReflexContainer>
            </ReflexElement>
            <ReflexSplitter style={{ height: "auto" }} />

            <ReflexElement flex={0.8}>
              <ReflexContainer orientation="horizontal">
                <ReflexElement>
                  <div style={{ padding: 8 }}>
                    {selectedController}
                  </div>
                </ReflexElement>

                <ReflexSplitter />

                <ReflexElement propagateDimensionsRate={200}
                  propagateDimensions={true}
                  style={{overflow: "auto"}}>

                  <Button 
                    onClick={() => dispacth({
                      type: 'add',
                      state: createDefaultState(ComponentEnum.AXES)
                    })} startIcon={<AddIcon />}
                  >
                    {"Add"}
                  </Button>
                  <TitleList tree={tree} dispatch={dispacth} currentlySelected={state.selected_from_list} />
                </ReflexElement>

              </ReflexContainer>

            </ReflexElement>
          </ReflexContainer>
        </main>
      </TimeContext.Provider>
    </ThemeProvider>
  );
}

export default App;
