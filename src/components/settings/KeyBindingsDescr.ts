const keyBindingsDescr: { k: string[], d: string }[] = [{
    k: ['ctrl', 'z'],
    d: "Undo action. Only valid for undoable actions (e.g. going back and forth on timeline is not modifiable)"
}, {
    k: ['ctrl', 's'],
    d: "Download/Save"
}, {
    k: ['ctrl', 'shift', 'z'],
    d: "Redo action. Only valid for redoable actions"
}, {
    k: ['w'], d: 'Change pos of selected to up'
}, {
    k: ['a'], d: 'Change pos of selected to left'
}, {
    k: ['s'], d: 'Change pos of selected to down'
}, {
    k: ['d'], d: 'Change pos of selected to right'
}, {
    k: ['ctrl', 'x'], d: 'Change scale of x to smaller'
}, {
    k: ['ctrl', 'shift', 'x'], d: 'Change scale of x to bigger'
}, {
    k: ['ctrl', 'y'], d: 'Change scale of y to smaller'
}, {
    k: ['ctrl', 'shift', 'y'], d: 'Change scale of y to bigger'
}, {
    k: ['g'], d: 'If selected has parent, select parent'
}, {
    k: ['c'], d: 'If selected has children, a list of them appears and allows you to select one of them'
},]

export default keyBindingsDescr;