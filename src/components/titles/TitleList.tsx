import { MyTreeElement } from "../ComponentMapper";
import { DndProvider, DropOptions, getBackendOptions, MultiBackend, NodeModel, Tree } from "@minoru/react-dnd-treeview";
import { DispactherAction } from "../StoreContext";
import { CustomNode } from "./CustomNode";
import { CustomDragPreview } from "./CustomDragPreview";
import styles from "./TitleList.module.css";
import { Placeholder } from "./PlaceHolder";


export default function TitleList({ tree, dispatch }: {
  tree: MyTreeElement[],
  dispatch: DispactherAction
}) {
  const handleDelete = (id: NodeModel["id"]) => {
    if (id === 0) return;
    dispatch({ type: 'delete', id: `${id}` });
  };
  const handleDrop = (newTree: MyTreeElement[], options: DropOptions) => {
    console.log(options);
    if (options.dragSourceId !== undefined && options.destinationIndex !== undefined && options.dragSourceId !== 0) {
      dispatch({ type: 'reorder', id: `${options.dragSourceId}`, destinationId: `${options.dropTargetId ?? 0}`, index: options.destinationIndex });
    } else {
      console.error("A condition was not met upon drag and drop, no changes applied", options);
    }
  };

  const handleTextChange = (id: MyTreeElement["id"], value: string) => {
    const changing = tree.filter((node) => node.id === id)[0];
    changing.text = value;
    if (changing.data) {
      changing.data.title = value;
      dispatch({ type: "modify", state: {...changing.data} });
    }
  };


  return (
    <DndProvider backend={MultiBackend} options={getBackendOptions()}>
      <Tree
        tree={tree}
        rootId={0}
        render={(node: MyTreeElement, { depth, isOpen, onToggle }) => (
          <CustomNode
            node={node}
            depth={depth}
            onToggle={onToggle}
            isOpen={isOpen}
            onDelete={handleDelete}
            onTextChange={handleTextChange}
          />
        )}
        dragPreviewRender={(monitorProps) => {
          return (<CustomDragPreview monitorProps={monitorProps} />)
        }}
        onDrop={handleDrop}
        classes={{
          root: styles.treeRoot,
          draggingSource: styles.draggingSource,
          placeholder: styles.placeholderContainer
        }}
        sort={false}
        insertDroppableFirst={false}
        canDrop={(tree, { dragSource, dropTargetId, dropTarget }) => {
          if (dragSource?.parent === dropTargetId) {
            return true;
          }
        }}
        placeholderRender={(node, { depth }) => (
          <Placeholder node={node} depth={depth} />
        )}
      />
    </DndProvider>
  );
}