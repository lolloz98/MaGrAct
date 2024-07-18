import ComponentEnum from "../ComponentEnum"

export default interface BaseState {
    id: string,
    title: string,
    type: ComponentEnum,
    isParent?: boolean,
    parent?: string,
    position: {
        x: number,
        y: number
    }
}