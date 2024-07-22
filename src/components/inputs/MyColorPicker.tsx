import { useRef, useState } from "react";
import { RgbaColorPicker } from "react-colorful";
import BaseState from "../states/BaseState";
import { DispactherAction } from "../StoreContext";
import { isRgba, myHexToRgba, myRgbaToHex } from "../Utils";
import MyCustomInput from "./MyCustomInput";

interface RGBA {r: number, g: number, b: number, a: number}

export function DefaultColorPicker({ 
  state, 
  dispatch, label 
}: {
  state: BaseState,
  dispatch: DispactherAction,
  label: string
}) {
  return <MyColorPicker state={state} dispatch={dispatch} label={label} 
    getColor={(state: BaseState) => state.color} setColor={(state: BaseState, n: string) => state.color = n}/>
}

export default function MyColorPicker({ 
  state, 
  getColor, 
  setColor, 
  dispatch, label 
}: {
  state: BaseState,
  getColor: (state: BaseState) => string,
  setColor: (state: BaseState, n: string) => void,
  dispatch: DispactherAction,
  label: string
}) {
  const [showPicker, setShowPicker] = useState(false);
  const onChangeHex = (newColor: string) => {
    console.log(isRgba(newColor));
    if (isRgba(newColor)){
      dispatch({ type: 'modify', id: state.id, modifiers: [(s) => setColor(s, newColor)] });
    }
  }
  const onChangeFromPicker = (newColor: RGBA) => {
    onChangeHex(myRgbaToHex(newColor));
  }

  return (<>
    {showPicker && (
      <MyPickerDialog
        state={getColor(state)}
        onClick={() => {
          setShowPicker(false)
        }}
        onChange={onChangeFromPicker}
      />
    )}
    <MyCustomInput
      variant="outlined"
      label={label}
      onClick={() => setShowPicker(true)}
      onMyChange={e => {
        onChangeHex((e.target as HTMLInputElement).value);
      }}
      InputProps={{ style: { color: getColor(state) } }}
      state={getColor(state)}
    />
  </>);
};

function MyPickerDialog({ state, onClick, onChange }: {
  state: string,
  onClick: () => void,
  onChange: (c: RGBA) => void
}) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <div style={{ position: 'absolute', zIndex: '2', bottom: ref.current?.offsetHeight ?? 0 }}>
        <div
          style={{ position: 'fixed', top: '0px', right: '0px', bottom: '0px', left: '0px' }}
          onClick={onClick}
        />
        <RgbaColorPicker
          color={myHexToRgba(state) ?? {
            r: 256,
            g: 256,
            b: 256,
            a: 256
          }}
          onChange={(c) => {
            console.log(c);
            c.a = Math.floor(c.a * 256);
            onChange(c);
          }}
        />
      </div>
    </div>
  )
}
