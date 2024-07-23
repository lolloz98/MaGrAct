import { useContext, useEffect, useRef, useState } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { Html } from 'react-konva-utils';
import { Circle, Group, Rect } from "react-konva";
import BaseState from "../states/BaseState";
import { computeColorDissolvenceAnimation, getCommonProps, getDraggableProps, getPositionAndScaleProps, isVisible } from "../Utils";
import { TimeContext } from "../TimeContext";
import { DispactherAction } from "../StoreContext";
import KatexState from "../states/KatexState";

// todo: create state for this component
export default function MyKatex({ state, dispatch }: {state: KatexState, dispatch: DispactherAction}) {
    const [w, setW] = useState(0);
    const [h, setH] = useState(0);
    const t = useContext(TimeContext);

    const commonProps = {
        ...getCommonProps(state, t)
    }

    const props = {
        ...commonProps,
        ...getDraggableProps(state, dispatch),
        ...getPositionAndScaleProps(state)
    };


    return (
        <Group width={w} height={h} {...props}>
            <Group x={-w / 2} y={-h / 2} {...commonProps}>
                <Html divProps={{ style: { pointerEvents: "none" } }} groupProps={{ preventDefault: true }}>
                    <KaTeX setW={setW} setH={setH} state={state}></KaTeX>
                </Html>
                <Rect width={w} height={h} x={0} y={0} {...commonProps} />
            </Group>
            {/* <Circle width={10} fill={"red"} x={0} y ={0} {...commonProps}/> */}
        </Group>)
}

function KaTeX({ setH, setW, state }: {
    setH: React.Dispatch<React.SetStateAction<number>>, 
    setW: React.Dispatch<React.SetStateAction<number>>,
    state: KatexState
}) {
    const reference = useRef<HTMLInputElement>(null);
    const t = useContext(TimeContext);

    function handleResize() {
        setH(reference.current?.offsetHeight ? reference.current?.offsetHeight : 0);
        setW(reference.current?.offsetWidth ? reference.current?.offsetWidth : 0);
    }
       
    useEffect(() => {
        if (reference.current) {
            if (reference.current) new ResizeObserver(handleResize).observe(reference.current);
            try {
                katex.render(state.fn, reference.current as HTMLInputElement);
            } catch (e) {
                console.error(`In MyKatex error rendering function ${state.fn}. error: ${e}`);
            }
        }
    }, [reference.current, state]);

    const visibility = (isVisible(state, t)? 'visible' : 'hidden');

    return <div style={{ 
        color: computeColorDissolvenceAnimation(state, t), 
        pointerEvents: 'none', 
        visibility: visibility 
    }} ref={reference} />;
}