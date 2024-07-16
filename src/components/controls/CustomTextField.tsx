import { TextField, TextFieldProps, TextFieldVariants } from "@mui/material";

export default function MyCustomInput<Variant extends TextFieldVariants>(
    props: {
        /**
         * The variant to use.
         * @default 'outlined'
         */
        variant?: Variant;
    } & Omit<TextFieldProps, 'variant'> & 
    { onMyChange?: (event: Event) => void } & 
    { onMyInput?: (event: Event) => void }
): JSX.Element {
    const {onMyChange, onMyInput, ...rest} = props;
    const registerCallbacks = (element: HTMLInputElement | null) => {
        if (element) {
            element.onchange = onMyChange ?? (() => { console.debug("onChange triggered, but not implemented for this component") });
            element.oninput = onMyInput ?? (() => { console.debug("onInput triggered, but not implemented for this component") });
        }
    };

    return (
        <TextField {...rest} inputProps={{ ref: registerCallbacks, onChange: undefined, onInput: undefined }} />
    );
}