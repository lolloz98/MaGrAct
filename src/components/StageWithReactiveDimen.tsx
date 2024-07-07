import { Stack } from "@mui/material"
import React, { ReactElement, useEffect, useRef, useState } from "react"

import { Stage } from "react-konva"

export function StageWithReactiveDimen({ children, style }: { children?: ReactElement, style?: React.CSSProperties}) {
  const originalW = 1066;
  const originalH = originalW * 9 / 16;
  const windowSize = useWindowSize();
  const divRef = useRef<HTMLInputElement>(null)

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
      const h = w * 9 / 16;
      setDimensions({
        width: w,
        height: h,
        scale: {
          x: w / originalW,
          y: h / originalH
        }
      })
      console.log(divRef.current.offsetWidth, divRef.current.offsetHeight)
    }
  }, [windowSize])

  return (
    <Stack className='Stage' ref={divRef}>
      <Stage width={dimensions.width} height={dimensions.height} scale={dimensions.scale} style={style}>
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