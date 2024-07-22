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
    },
    color: string,
    animation: {
        start_duration: number,
        end_duration: number
    }
}

export function getDefaultBaseState(
    id: string, 
    type: ComponentEnum, 
    title: string | undefined, 
    maxTime: number
): BaseState {
    return {
        id: id,
        title: title ?? type,
        type: type,
        scale: {
            x: 100,
            y: 100
        },
        position: {
            x: 533,
            y: 330
        },
        time_constraint: {
            start: 0,
            end: maxTime
        },
        color: "#ffffffff",
        animation: {
            start_duration: 0,
            end_duration: 0.3
        }
    }
}