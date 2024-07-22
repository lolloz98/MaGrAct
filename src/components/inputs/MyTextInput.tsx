import { TextFieldProps, TextFieldVariants } from "@mui/material";
import MyCustomInput from "./MyCustomInput";
import BaseState from "../states/BaseState";
import { DispactherAction } from "../StoreContext";

export default function MyTextInput<Variant extends TextFieldVariants>(
    props: {
        /**
         * The variant to use.
         * @default 'outlined'
         */
        variant?: Variant;
    } & Omit<TextFieldProps, 'variant'> & 
    { state: BaseState, get: (state: BaseState) => string, 
        set: (state: BaseState, a: string) => void, dispatch: DispactherAction }
): JSX.Element {
    const { get, set, dispatch, state, ...rest } = props;

    const onMyChange = (e: Event) => {
        const val = (e.target as HTMLInputElement).value;
        dispatch({ type: 'modify', id: state.id, modifiers: [(s) => set(s, val)] });
    }

    return (
        <MyCustomInput {...rest} variant={props.variant} state={`${get(props.state)}`} onMyChange={onMyChange} />
    );
}