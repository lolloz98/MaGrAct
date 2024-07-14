import { Stack } from "@mui/material"
import Konva from "konva";
import React, { ReactElement, useEffect, useRef, useState } from "react"

import { Stage } from "react-konva"

export function StageWithReactiveDimen({ children }: { children?: ReactElement, style?: React.CSSProperties}) {
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
      const w = divRef.current.offsetWidth;
      const ratio = 9 / 16;
      const h = w * ratio;
      setDimensions({
        width: w,
        height: h,
        scale: {
          x: w / originalW,
          y: h / (originalW * ratio)
        }
      })
      console.log(divRef.current.offsetWidth, divRef.current.offsetHeight)
    }
  }, [windowSize])

  return (
    <Stack ref={divRef} className="Stage">
      <Stage 
      width={dimensions.width} 
      height={dimensions.height} 
      scale={dimensions.scale} 
      style={{background: "black"}}
      ref={stageRef}
      onClick={(e) => {
        console.log("Shape that we did hit", stageRef.current?.getAllIntersections(stageRef.current.pointerPos));
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