import { TextField, TextFieldProps, TextFieldVariants } from "@mui/material";
import { useMemo, useState } from "react";

export default function MyCustomInput<Variant extends TextFieldVariants>(
    props: {
        /**
         * The variant to use.
         * @default 'outlined'
         */
        variant?: Variant;
    } & Omit<TextFieldProps, 'variant'> & 
    { onMyChange: (event: Event) => void } & 
    { state: string }
): JSX.Element {
    const {onMyChange, state, ...rest} = props;

    const [a, setA] = useState(state);
    const [triggered, setTriggered] = useState(true);
    const trigger = () => setTriggered(!triggered);
    useMemo(() => setA(state), [state, triggered]);

    const onMyInput = (e: Event) => setA((e.target as HTMLInputElement).value);

    const registerCallbacks = (element: HTMLInputElement | null) => {
        if (element) {
            element.onchange = (e) => {
                onMyChange(e);
                trigger();
            }
            element.oninput = onMyInput ?? (() => { console.debug("onInput triggered, but not implemented for this component") });
        }
    };

    return (
        <TextField {...rest} value={a} inputProps={{ ref: registerCallbacks, onChange: undefined, onInput: undefined }} />
    );
}