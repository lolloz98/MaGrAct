import { TextFieldProps, TextFieldVariants } from "@mui/material";
import MyCustomInput from "./MyCustomInput";
import BaseState from "../states/BaseState";
import { isNumeric } from "../Utils";
import { DispactherAction } from "../StoreContext";

export default function MyNumbericInput<Variant extends TextFieldVariants>(
    props: {
        /**
         * The variant to use.
         * @default 'outlined'
         */
        variant?: Variant;
    } & Omit<TextFieldProps, 'variant'> & 
    { state: BaseState, get: (state: BaseState) => number, 
        set: (state: BaseState, a: number) => void, dispatch: DispactherAction }
): JSX.Element {
    const { get, set, dispatch, state, ...rest } = props;

    const onMyChange = (e: Event) => {
        const val = (e.target as HTMLInputElement).value;
        if (isNumeric(val)) {
            dispatch({ type: 'modify', id: state.id, modifiers: [(s) => set(s, +val)] });
        }
    }

    return (
        <MyCustomInput {...rest} variant={props.variant} state={`${get(props.state)}`} onMyChange={onMyChange} />
    );
}