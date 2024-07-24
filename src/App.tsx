import React, { useEffect, ReactElement } from 'react';
import './App.css';
import Slider from '@mui/material/Slider';
import { Box, Button, createTheme, CssBaseline, PaletteMode, Stack, ThemeProvider } from '@mui/material';
import { Layer } from 'react-konva';
import { StageWithReactiveDimen } from './components/graphic/StageWithReactiveDimen';
import { MaxTimeContext, TimeContext } from './components/TimeContext';
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
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';
import 'react-reflex/styles.css'
import AddButton from './components/add/AddButton';
import MyGroupState from './components/states/MyGroupState';
import MoveButton from './components/move/MoveButton';

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

function getParentHierarchy(id: string, draft: MyStore, isIdOfParent: boolean) {
  const parents = [];
  let cur = id;

  if (isIdOfParent && cur !== "0") parents.push(id);

  while (draft.parent.has(cur)) {
    cur = draft.parent.get(cur) as string;
    if (cur === "0") break;
    parents.push(cur);
  }
  return parents;
}

function getParent(parents: string[], index: number, cur: MyStore | MyGroupState): MyStore | MyGroupState {
  if (index === -1) {
    return cur;
  }
  const comps = (isMyStore(cur))? (cur as MyStore).components : (cur as MyGroupState).children;
  return getParent(parents, index - 1, comps.find(s => s.id === parents[index]) as MyGroupState);
}
function deleteInfoForChildrenAndCur(state: BaseState, draft: MyStore) {
  draft.titles.delete(state.title);
  draft.parent.delete(state.id);
  if (isMyGroup(state)) {
    for (const n of (state as MyGroupState).children) {
      deleteInfoForChildrenAndCur(n, draft);
    }
  }
}
function getParentComponent(id: string, draft: MyStore, isIdOfParent: boolean): MyStore | MyGroupState {
  const parents = getParentHierarchy(id, draft, isIdOfParent);
  console.log('parents', parents);
  return getParent(parents, parents.length - 1, draft);
}
export function isMyGroup(cur: BaseState) {
  return (cur as MyGroupState).children !== undefined;
}
function isMyStore(cur: MyStore | BaseState) {
  return (cur as MyStore).components !== undefined;
}

function removeFromParent(id: string, cur: MyStore | MyGroupState): BaseState {
  if (isMyStore(cur)) {
    const state = (cur as MyStore).components.find(c => c.id === id) as BaseState; 
    (cur as MyStore).components = (cur as MyStore).components.filter(c => c.id !== id);
    return state;
  }

  const state = (cur as MyGroupState).children.find(c => c.id === id) as BaseState;
  (cur as MyGroupState).children = (cur as MyGroupState).children.filter(c => c.id !== id);
  return state;
}

function getList(cur: MyStore | MyGroupState) {
  return isMyStore(cur)? (cur as MyStore).components : (cur as MyGroupState).children;
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
      const cur = getParentComponent(action.id, draft, false);
      const l = (isMyStore(cur))? (cur as MyStore).components : (cur as MyGroupState).children;
      deleteInfoForChildrenAndCur(l.find(s => s.id === action.id) as BaseState, draft);
      removeFromParent(action.id, cur);
      // todo: better strategy for modifying selected
      draft.selected = [];
      draft.selected_from_list = undefined;
      return draft;
    case 'add':
      checkAndUpdateTitle(action.state, draft);
      draft.selected_from_list = action.state.id;
      return void draft.components.push(action.state);
    case 'modify':
      const lis = getList(getParentComponent(action.id, draft, false));
      const ind = lis.findIndex(a => a.id === action.id);
      const state = lis[ind];
      const prevTitle = state.title;
      for (const m of action.modifiers) {
        m(state);
      }
      if (prevTitle !== state.title) {
        draft.titles.delete(prevTitle);
        checkAndUpdateTitle(state, draft);
      }
      return draft;
    case 'changeSelection':
      if (action.ids.length > 0) {
        draft.selected_from_list = action.ids[action.ids.length - 1];
      }
      return draft;
    case 'reorder':
      const indexTo = action.index;
      const parent = getParentComponent(action.id, draft, false);
      console.log("found parent", parent);
      const nextParent = getParentComponent(action.destinationId, draft, true);
      console.log("found next parent", nextParent);
      const stateToKeep = removeFromParent(action.id, parent);
      
      if (action.destinationId === "0") {
        if (draft.parent.has(action.id)) draft.parent.delete(action.id);
      } else {
        console.log("set parent", action.destinationId, 'for', action.id);
        draft.parent.set(action.id, action.destinationId);
      }

      console.log("isNextParent MyStore: ", isMyStore(nextParent));
      const li = isMyStore(nextParent)? (nextParent as MyStore).components: (nextParent as MyGroupState).children;
      
      li.splice(indexTo, 0, stateToKeep);
      console.log('keeping: ', stateToKeep);
      console.log('after keeping', li);
      // todo: better strategy for modifying selected
      draft.selected_from_list = undefined;
      return draft;
    case 'select_from_list':
      draft.selected_from_list = action.id;
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
  const maxTicks = 100;

  const { state, dispacth } = useMyMutative();
  const getTime = (tick: number) => {
    return step * tick / 1000;
  }

  const children = [];
  let currentlySelected: ReactElement | undefined = undefined;
  const selected = [];
  let tree: MyTreeElement[] = [];

  // todo add add selection for elements
  for (const comp of state.components) {
    const cur = getComponent(comp, dispacth, state);
    if (cur.selectedEl !== undefined) {
      currentlySelected = getModifier(cur.selectedEl, dispacth);
    }
    children.push(cur.jsx);
    tree = tree.concat(cur.treeEl);

    if (isContained(state.selected, comp)) {
      selected.push(getModifier(comp, dispacth))
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <TimeContext.Provider value={getTime(tick)}>
        <MaxTimeContext.Provider value={getTime(maxTicks)}>
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
                        {children}
                      </Layer>
                    </StageWithReactiveDimen>
                  </ReflexElement>

                  <ReflexSplitter />

                  <ReflexElement propagateDimensionsRate={200}
                    propagateDimensions={true}
                    flex={1}>
                    <MyTimeline tick={tick} setTick={setTick} step={step} maxTicks={maxTicks} />
                  </ReflexElement>
                </ReflexContainer>
              </ReflexElement>
              <ReflexSplitter style={{ height: "auto" }} />

              <ReflexElement flex={0.8}>
                <ReflexContainer orientation="horizontal">
                  <ReflexElement>
                    <div style={{ padding: 8 }}>
                      {currentlySelected}
                    </div>
                  </ReflexElement>

                  <ReflexSplitter />

                  <ReflexElement propagateDimensionsRate={200}
                    propagateDimensions={true}
                    style={{ overflow: "hidden" }}>
                    <Stack direction={"row"} justifyContent={"space-around"} alignContent={"center"}>
                      <AddButton dispatch={dispacth} tree={tree} />
                      <MoveButton store={state} dispatch={dispacth} />
                    </Stack>
                    <TitleList store={state} tree={tree} dispatch={dispacth} currentlySelected={state.selected_from_list} />
                  </ReflexElement>

                </ReflexContainer>

              </ReflexElement>
            </ReflexContainer>
          </main>
        </MaxTimeContext.Provider>
      </TimeContext.Provider>
    </ThemeProvider>
  );
}

export default App;
