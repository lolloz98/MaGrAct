import ComponentEnum from "../ComponentEnum"

export default interface BaseState {
    id: string,
    type: ComponentEnum,
    offset: {
        x: number,
        y: number
    }
}