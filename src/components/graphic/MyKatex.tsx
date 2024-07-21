import { useContext, useEffect, useRef, useState } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { Html } from 'react-konva-utils';
import { Group, Rect } from "react-konva";
import BaseState from "../states/BaseState";
import { computeColorDissolvenceAnimation, getCommonProps, getDraggableProps, getPositionAndScaleProps } from "../Utils";
import { TimeContext } from "../TimeContext";
import { DispactherAction } from "../StoreContext";

// todo: create state for this component
export default function MyKatex({ state, dispatch }: {state: BaseState, dispatch: DispactherAction}) {
    const [w, setW] = useState(0);
    const [h, setH] = useState(0);
    const t = useContext(TimeContext);

    const props = {
        ...getCommonProps(state, t),
        ...getDraggableProps(state, dispatch),
        ...getPositionAndScaleProps(state)
    };

    return (
        <Group width={w} height={h} {...props}>
            <Html divProps={{ style: { pointerEvents: "none" } }} groupProps={{ preventDefault: true }}>
                <KaTeX setW={setW} setH={setH} state={state}></KaTeX>
            </Html>
            <Rect width={w} fill="red" height={h} x={0} y={0} />
        </Group>)
}

function KaTeX({ setH, setW, state }: {
    setH: React.Dispatch<React.SetStateAction<number>>, 
    setW: React.Dispatch<React.SetStateAction<number>>,
    state: BaseState
}) {
    const reference = useRef<HTMLInputElement>(null);
    const t = useContext(TimeContext);

    function handleResize() {
        console.log("changing size");
        setH(reference.current?.offsetHeight ? reference.current?.offsetHeight : 0);
        setW(reference.current?.offsetWidth ? reference.current?.offsetWidth : 0);
    }
       
    useEffect(() => {
        if (reference.current) {
            if (reference.current) new ResizeObserver(handleResize).observe(reference.current);
            katex.render("\\forall x \\in X, \\quad \\exists y \\leq \\epsilon", reference.current as HTMLInputElement);
        }
    }, [reference.current]);



    return <div style={{ color: computeColorDissolvenceAnimation(state, t), pointerEvents: 'none' }} ref={reference} />;
}