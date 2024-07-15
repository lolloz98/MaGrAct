import ComponentEnum from "../ComponentEnum"

export default interface BaseState {
    id: string,
    type: ComponentEnum,
    position: {
        x: number,
        y: number
    }
}