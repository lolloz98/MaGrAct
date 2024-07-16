import { ReactElement } from "react";

export default function ListOfControls({ children }: {children?: ReactElement[]}) {
    
    return (<div>
        {children}
    </div>)
}