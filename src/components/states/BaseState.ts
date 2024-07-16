import ComponentEnum from "../ComponentEnum"

export default interface BaseState {
    id: string,
    title: string,
    type: ComponentEnum,
    position: {
        x: number,
        y: number
    }
}