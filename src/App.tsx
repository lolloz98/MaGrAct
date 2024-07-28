import React, { ReactElement, useEffect, useState } from 'react';
import './App.css';
import { createTheme, CssBaseline, PaletteMode, Stack, ThemeProvider } from '@mui/material';
import { Layer } from 'react-konva';
import { StageWithReactiveDimen } from './components/graphic/StageWithReactiveDimen';
import { MaxTimeContext, TimeContext } from './components/TimeContext';
import { apply, Draft, Patches, rawReturn } from 'mutative';
import { initState, MyStore, StoreAction } from './components/StoreContext';
import { getComponent, getModifier, isContained, MyTreeElement } from './components/ComponentMapper';
import { useMutativeReducer } from 'use-mutative';
import BaseState from './components/states/BaseState';
import TitleList from './components/titles/TitleList';
import MyTimeline from './components/Timeline';
import { ReflexContainer, ReflexElement, ReflexSplitter } from 'react-reflex';
import 'react-reflex/styles.css'
import AddButton from './components/moveAndAdd/AddButton';
import MyGroupState from './components/states/MyGroupState';
import MoveButton from './components/moveAndAdd/MoveButton';
import MySettingsDialog from './components/settings/MySettingsDialog';
import { replacer } from './components/saveAndLoad/save';
import { reviver } from './components/saveAndLoad/load';
import uuid from 'react-uuid';
import { applyPatch } from 'fast-json-patch';

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
  const comps = (isMyStore(cur)) ? (cur as MyStore).components : (cur as MyGroupState).children;
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
  return getParent(parents, parents.length - 1, draft);
}
export function isMyGroup(cur: BaseState) {
  return (cur as MyGroupState).children !== undefined;
}
function isMyStore(cur: MyStore | BaseState) {
  return (cur as MyStore).components !== undefined;
}

function changeIdsAndAddParentMapping(state: BaseState, parent: string, parents: Map<string, string>, draft: MyStore) {
  state.id = uuid();
  if (parent !== "0") {
    parents.set(state.id, parent);
  }
  checkAndUpdateTitle(state, draft);
  if (isMyGroup(state)) {
    for (const ch of (state as MyGroupState).children) {
      changeIdsAndAddParentMapping(ch, state.id, parents, draft);
    }
  }
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
  return isMyStore(cur) ? (cur as MyStore).components : (cur as MyGroupState).children;
}

function reducer(handleIsPatch: (type: string) => void) {
  return (
    draft: Draft<MyStore>,
    action: StoreAction
  ) => {
    console.debug(action);
    handleIsPatch(action.type);
    switch (action.type) {
      case 'reset':
        return rawReturn(initState);
      case 'delete':
        const cur = getParentComponent(action.id, draft, false);
        const l = (isMyStore(cur)) ? (cur as MyStore).components : (cur as MyGroupState).children;
        deleteInfoForChildrenAndCur(l.find(s => s.id === action.id) as BaseState, draft);
        removeFromParent(action.id, cur);
        // todo: better strategy for modifying selected
        draft.selected = [];
        draft.selected_from_list = undefined;
        return draft;
      case 'add':
        checkAndUpdateTitle(action.state, draft);
        const newParent = getParentComponent(action.parent, draft, true);
        const siblings = isMyStore(newParent) ? (newParent as MyStore).components : (newParent as MyGroupState).children;
        siblings.splice(action.index, 0, action.state);
        draft.selected_from_list = action.state.id;
        setParentChildMapping(action.parent, action.state, draft);
        return draft;
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

        setParentChildMapping(action.destinationId, stateToKeep, draft);

        console.log("isNextParent MyStore: ", isMyStore(nextParent));
        const li = isMyStore(nextParent) ? (nextParent as MyStore).components : (nextParent as MyGroupState).children;

        li.splice(indexTo, 0, stateToKeep);
        console.log('keeping: ', stateToKeep);
        console.log('after keeping', li);
        // todo: better strategy for modifying selected
        draft.selected_from_list = undefined;
        return draft;
      case 'select_from_list':
        draft.selected_from_list = action.id;
        return draft;
      case 'set_max_ticks':
        draft.maxTicks = action.maxTicks;
        if (draft.tick > action.maxTicks) draft.tick = action.maxTicks;
        return draft;
      case 'set_tick':
        draft.tick = action.tick;
        return draft;
      case 'load_from_file':
        return rawReturn(action.newStore);
      case 'copy':
        const newStateWrongIds = JSON.parse(JSON.stringify(action.state, replacer), reviver);
        changeIdsAndAddParentMapping(newStateWrongIds, "0", draft.parent, draft);
        draft.selected_from_list = newStateWrongIds.id;
        return void draft.components.push(newStateWrongIds);
      case 'patch':
        draft = apply(draft, action.patches);
        return draft;
    }
  }
}

function setParentChildMapping(newParent: string, state: BaseState, draft: MyStore) {
  if (newParent === "0") {
    if (draft.parent.has(state.id)) draft.parent.delete(state.id);
    state.parent = undefined;
  } else {
    draft.parent.set(state.id, newParent);
    state.parent = newParent;
  }
}

function useMyMutative() {
  const [isPatch, setIsPatch] = useState<boolean>(false);
  const handleIsPatch = (type: string) => {
    if (type === 'patch') {
      setIsPatch(true);
    } else {
      setIsPatch(false);
    }
  }
  const consumeIsPatch = () => {
    const cur = isPatch;
    if (isPatch) {
      setIsPatch(false);
    }
    return cur;
  }
  let [state, dispacth, patches, inversePatches] = useMutativeReducer(
    reducer(handleIsPatch),
    initState,
    undefined,
    { enablePatches: true }
    // {
    //   pathAsArray: false,
    //   arrayLengthAssignment: true
    // }
  );
  let [patchesInfoQ, setPatchesInfoQ] = useState<{ patches: Patches, inversePatches: Patches, opWasPatch: boolean }[]>([]);
  let [patchesIndex, setPatchesIndex] = useState<number>(0);
  const getPatches = () => patchesInfoQ;
  useEffect(() => {
    if (patches.length === 0 || isPatch) {
      console.log("discarding");
      consumeIsPatch();
      return;
    }
    const newPatchesInfoQ = patchesInfoQ.filter((v, i) => i < patchesIndex);
    const np = [...newPatchesInfoQ, {
      patches: patches,
      inversePatches: inversePatches,
      opWasPatch: consumeIsPatch()
    }];
    setPatchesInfoQ(np);
    setPatchesIndex(np.length);
    console.log("p", np);
  }, [state]);
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      const code = event.key;
      if ((event.ctrlKey || event.metaKey) && code === 's') {
        alert('CTRL+S Pressed');
      } else if ((event.ctrlKey || event.metaKey) && !event.shiftKey && code === 'z') {
        event.stopPropagation();
        if (patchesIndex > 0) {
          const p = patchesInfoQ[patchesIndex - 1];
          setPatchesIndex(patchesIndex - 1);
          console.log("in ctrlz", patchesInfoQ, patchesIndex);
          dispacth({ type: 'patch', patches: p.inversePatches });
        } else {
          console.log("CTRL+z clicked, but no patch found to be applied");
        }
      } else if ((event.ctrlKey || event.metaKey) && event.shiftKey && code === 'Z') {
        event.stopPropagation();
        console.log(patchesIndex, patchesInfoQ.length);
        if (patchesIndex < patchesInfoQ.length) {
          const p = patchesInfoQ[patchesIndex];
          setPatchesIndex(patchesIndex + 1);
          console.log("in ctrl+shif+z applying", p.patches);
          dispacth({ type: 'patch', patches: p.patches });
        } else {
          console.log("CTRL+shift+Z clicked, but no patch found to be applied");
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [patchesInfoQ, patchesIndex]);


  return { state, dispacth, patchesInfoQ }
}


function App() {
  const mode: PaletteMode = 'dark';
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  const { state, dispacth } = useMyMutative();
  const getTime = (tick: number) => {
    return state.step * tick / 1000;
  }

  const children = [];
  let currentlySelected: ReactElement | undefined = undefined;
  const selected = [];
  let tree: MyTreeElement[] = [];

  // todo add add selection for elements
  for (const comp of state.components) {
    const cur = getComponent(comp, dispacth, state, getTime(state.tick));
    if (cur.selectedEl !== undefined) {
      currentlySelected = getModifier(cur.selectedEl, dispacth);
    }
    if (cur.jsx !== undefined) children.push(cur.jsx);
    tree = tree.concat(cur.treeEl);

    if (isContained(state.selected, comp)) {
      selected.push(getModifier(comp, dispacth))
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <TimeContext.Provider value={getTime(state.tick)}>
        <MaxTimeContext.Provider value={getTime(state.maxTicks)}>
          <CssBaseline />
          <main className="App">
            <ReflexContainer orientation="vertical" style={{ height: '100vh' }} >
              <ReflexElement flex={1.7}>
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
                    flex={1.3}>
                    <Stack alignContent={"center"}>
                      <MyTimeline tick={state.tick} step={state.step} maxTicks={state.maxTicks}
                        setTick={(n) => dispacth({ type: 'set_tick', tick: n })} />
                      <MySettingsDialog dispatch={dispacth} state={state} />
                    </Stack>
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
                      <AddButton dispatch={dispacth} state={state} />
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
