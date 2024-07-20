import Konva from "konva";
import React, { ReactElement, useEffect, useRef, useState } from "react"

import { Stage } from "react-konva"
import { DispactherAction } from "../StoreContext";

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
  const divRef = useRef<HTMLInputElement>(null)
  const stageRef = useRef<Konva.Stage>(null)

  const [dimensionsState, setDimensions] = useState({
    width: dimensions?.width ?? 0,
    height: 0,
    scale: {
      x: 1,
      y: 1
    }
  })

  useEffect(() => {
      // todo: increase precision for these operations -> dimens / scale should always get the same numbers
      const w = dimensions?.width ?? 0;
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
      console.debug("window was resized. New dimens (with scale applied) should not change", {
        dimensions
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
        console.log("Shape that we did hit", shapes);
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