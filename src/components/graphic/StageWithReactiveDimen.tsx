import Konva from "konva";
import React, { ReactElement, useEffect, useRef, useState } from "react"

import { Stage } from "react-konva"
import { DispactherAction } from "../StoreContext";
import { convertDimen } from "../Utils";
import BaseState from "../states/BaseState";
import { Dialog, DialogTitle, List, ListItemButton, ListItemText } from "@mui/material";
import { isMyGroup } from "../../App";
import MyGroupState from "../states/MyGroupState";
import { max } from "mathjs";

export function StageWithReactiveDimen({ children, dispatch, dimensions, selectedItem }: { 
  children?: ReactElement, 
  dispatch: DispactherAction,
  style?: React.CSSProperties,
  selectedItem?: BaseState,
  dimensions?: {
    width: number,
    height: number
  }
}) {
  const originalW = 1066;
  const stageRef = useRef<Konva.Stage>(null);
  const [isViewingChildren, setIsViewingChildren] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const code = event.key;
      if (event.target !== null) {
        const target = (event.target as HTMLElement);
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
          return; // Do nothing if the event is handled by these elements
        }
      }
      if (selectedItem !== undefined) {
        if ((code === 'w' || code === 's')) {
          event.preventDefault();
          dispatch({ type: 'modify', id: selectedItem.id, modifiers: [(s) => {
            s.position.y += ((code === 'w')? -1: 1) * 10;
          }]})
        }
        if ((code === 'a' || code === 'd')) {
          event.preventDefault();
          dispatch({ type: 'modify', id: selectedItem.id, modifiers: [(s) => {
            s.position.x += ((code === 'a')? -1: 1) * 10;
          }]})
        }
        if (code === 'g' && selectedItem.parent !== undefined && selectedItem.parent !== '0') {
          event.preventDefault();
          dispatch({ type: 'select_from_list', id: selectedItem.parent })
        }
        if (code === 'c' && isMyGroup(selectedItem)) {
          event.preventDefault();
          setIsViewingChildren(true);
        }
        if ((code === 'y' || code === 'Y') && (event.ctrlKey || event.shiftKey)) {
          event.preventDefault();
          dispatch({ type: 'modify', id: selectedItem.id, modifiers: [(s) => {
            s.scale.y = max(s.scale.y + ((event.ctrlKey)? -0.05: 0.05), 0);
          }]})        
        }
        if ((code === 'x' || code === 'X') && (event.ctrlKey || event.shiftKey)) {
          event.preventDefault();
          dispatch({ type: 'modify', id: selectedItem.id, modifiers: [(s) => {
            s.scale.x = max(s.scale.x + ((event.ctrlKey)? -0.05: 0.05), 0);
          }]})        
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem]);

  const [dimensionsState, setDimensions] = useState({
    width: convertDimen(dimensions?.width),
    height: 0,
    scale: {
      x: 1,
      y: 1
    }
  })

  useEffect(() => {
      // todo: increase precision for these operations -> dimens / scale should always get the same numbers
      const w = convertDimen(dimensions?.width);
      const ratio = 9.0 / 16;
      const h = w * ratio;
      setDimensions({
        width: w,
        height: h,
        scale: {
          x: w / originalW,
          y: h / (originalW * ratio)
        }
      })
    }, [dimensions]);

  return (
    <div>
      <Stage 
      width={dimensionsState.width} 
      height={dimensionsState.height} 
      scale={dimensionsState.scale} 
      style={{background: "black", width: dimensionsState.width, height: dimensionsState.height}}
      ref={stageRef}
      onClick={(_e) => {
        const shapes = stageRef.current?.getAllIntersections(stageRef.current.pointerPos);
        console.debug("Shape that we did hit", shapes);
        if (shapes) {
          const sel = shapes.map(s => s.name());
          console.log("selected: ", sel);
          dispatch({
            type: "changeSelection",
            ids: sel
          })
        } else {
          dispatch({
            type: "changeSelection",
            ids: []
          })
        }
        }}>
        {children}
      </Stage>
      {isViewingChildren &&
          <Dialog open={isViewingChildren} onClose={() => setIsViewingChildren(false)}>
            <List style={{ maxHeight: 400, overflow: 'auto' }}>
              {(selectedItem as MyGroupState).children.length == 0 && <DialogTitle style={{ cursor: 'move' }}>No Children in Selected Group</DialogTitle>}
                {(selectedItem as MyGroupState).children.map((c, i) => {
                    return (<ListItemButton key={c.id} onClick={(_e) => {
                          dispatch({ type: 'select_from_list', id: c.id });
                          setIsViewingChildren(false);
                        }}>
                            <ListItemText key={c.id}
                                primary={`${i} ${c.title}`}
                            />
                        </ListItemButton>)
                })}
            </List>
          </Dialog>}
    </div>
  )
}