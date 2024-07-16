import { TextField, TextFieldProps, TextFieldVariants } from "@mui/material";
import { useEffect, useState } from "react";

export default function MyCustomInput<Variant extends TextFieldVariants>(
    props: {
        /**
         * The variant to use.
         * @default 'outlined'
         */
        variant?: Variant;
    } & Omit<TextFieldProps, 'variant'> & 
    { onMyChange?: (event: Event) => void } & 
    { state: string }
): JSX.Element {
    const {onMyChange, state, ...rest} = props;

    const [a, setA] = useState(state);
    useEffect(() => {
        setA(state);
    }, [state]);

    const onMyInput = (e: Event) => setA((e.target as HTMLInputElement).value);

    const registerCallbacks = (element: HTMLInputElement | null) => {
        if (element) {
            element.onchange = onMyChange ?? (() => { console.debug("onChange triggered, but not implemented for this component") });
            element.oninput = onMyInput ?? (() => { console.debug("onInput triggered, but not implemented for this component") });
        }
    };

    return (
        <TextField {...rest} value={a} inputProps={{ ref: registerCallbacks, onChange: undefined, onInput: undefined }} />
    );
}