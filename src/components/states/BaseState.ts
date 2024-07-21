import ComponentEnum from "../ComponentEnum"

export default interface BaseState {
    id: string,
    title: string,
    type: ComponentEnum,
    isParent?: boolean,
    parent?: string,
    scale: {
        x: number,
        y: number
    },
    position: {
        x: number,
        y: number
    },
    time_constraint: {
        start: number,
        end: number
    }
}