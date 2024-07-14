import { Stack } from "@mui/material"
import Konva from "konva";
import React, { ReactElement, useEffect, useRef, useState } from "react"

import { Stage } from "react-konva"
import { DispactherAction } from "../StoreContext";

export function StageWithReactiveDimen({ children, dispatch }: { 
  children?: ReactElement, 
  dispatch: DispactherAction,
  style?: React.CSSProperties
}) {
  const originalW = 1066;
  const windowSize = useWindowSize();
  const divRef = useRef<HTMLInputElement>(null)
  const stageRef = useRef<Konva.Stage>(null)

  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    scale: {
      x: 1,
      y: 1
    }
  })

  useEffect(() => {
    if (divRef.current?.offsetHeight && divRef.current?.offsetWidth) {
      // todo: increase precision for these operations -> dimens / scale should always get the same numbers
      const w = divRef.current.offsetWidth;
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
        x: divRef.current.offsetWidth / dimensions.scale.x, y: divRef.current.offsetHeight / dimensions.scale.y
      })
    }
  }, [windowSize])

  return (
    <Stack ref={divRef} className="Stage">
      <Stage 
      width={dimensions.width} 
      height={dimensions.height} 
      scale={dimensions.scale} 
      style={{background: "black", width: dimensions.width, height: dimensions.height}}
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
    </Stack>
  )
}

function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
}