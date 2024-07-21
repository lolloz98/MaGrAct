import { useEffect, useRef, useState } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { Html } from 'react-konva-utils';
import { Group, Rect } from "react-konva";

// todo: create state for this component
export default function MyKatex() {
    const [w, setW] = useState(0);
    const [h, setH] = useState(0);
    // todo fix error with dimensions of rectangle: on first render seems a bit off
    // we can for sure find a better solution to do this: we need rect to wrap around our latex,
    // so that getAllIntersections upon click can find this component
    return (
        <Group width={w} height={h}>
        <Html divProps={{ style: { pointerEvents: "none" } }} groupProps={{ preventDefault: true }}>
            <KaTeX setW={setW} setH={setH}></KaTeX>
        </Html>
        <Rect width={w} fill="red" height={h} x={0} y={0}/>
    </Group>)
}

function KaTeX({ setH, setW }: { setH: React.Dispatch<React.SetStateAction<number>>
    , setW: React.Dispatch<React.SetStateAction<number>>}) {
    const reference = useRef<HTMLInputElement>(null);
    useEffect(() => {
        katex.render("\\forall x \\in X, \\quad \\exists y \\leq \\epsilon", reference.current as HTMLInputElement);
    }, []);

    useEffect(() => {
        console.log("changing size");
        setH(reference.current?.offsetHeight ? reference.current?.offsetHeight : 0);
        setW(reference.current?.offsetWidth ? reference.current?.offsetWidth : 0);
    }, [reference.current?.offsetHeight, reference.current?.offsetWidth])

    return <div style={{color: "white", pointerEvents: 'none'}} ref={reference} />;
}