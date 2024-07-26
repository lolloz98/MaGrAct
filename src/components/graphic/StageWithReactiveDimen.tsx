import Konva from "konva";
import React, { ReactElement, useEffect, useRef, useState } from "react"

import { Stage } from "react-konva"
import { DispactherAction } from "../StoreContext";
import { convertDimen } from "../Utils";

export function StageWithReactiveDimen({ children, dispatch, dimensions }: { 
  children?: ReactElement, 
  dispatch: DispactherAction,
  style?: React.CSSProperties,
  dimensions?: {
    width: number,
    height: number
  }
}) {
  const originalW = 1066;
  const stageRef = useRef<Konva.Stage>(null)

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
      onClick={(e) => {
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
    </div>
  )
}