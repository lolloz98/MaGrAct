import { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { Html } from 'react-konva-utils';


export default function MyKatex() {

    return (
    <Html>
        <KaTeX></KaTeX>
    </Html>)
}

function KaTeX() {
  const containerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    katex.render("(x^2 + y^2 = z^2)", containerRef.current as HTMLInputElement);
  }, []);

  return <div style={{color: "white"}} ref={containerRef} />;
}