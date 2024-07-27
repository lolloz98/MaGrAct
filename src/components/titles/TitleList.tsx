import { MyTreeElement } from "../ComponentMapper";
import { DndProvider, DropOptions, getBackendOptions, MultiBackend, NodeModel, Tree } from "@minoru/react-dnd-treeview";
import { DispactherAction, MyStore } from "../StoreContext";
import { CustomNode } from "./CustomNode";
import { CustomDragPreview } from "./CustomDragPreview";
import styles from "./TitleList.module.css";
import { Placeholder } from "./PlaceHolder";
import BaseState from "../states/BaseState";
import { convertDimen } from "../Utils";


export default function TitleList({ tree, currentlySelected, dispatch, dimensions, store }: {
  tree: MyTreeElement[],
  currentlySelected?: string,
  dispatch: DispactherAction,
  store: MyStore,
  dimensions?: {
    width: number,
    height: number
  }
}) {
  const handleDelete = (id: NodeModel["id"]) => {
    if (id === 0) return;
    dispatch({ type: 'delete', id: `${id}` });
  };
  const handleDrop = (newTree: MyTreeElement[], options: DropOptions) => {
    console.debug(`Options while dnd: ${options}`);
    if (options.dragSourceId !== undefined && options.destinationIndex !== undefined) {
      dispatch({ type: 'reorder', id: `${options.dragSourceId}`, destinationId: `${options.dropTargetId ?? 0}`, index: options.destinationIndex });
    } else {
      console.error("A condition was not met upon drag and drop, no changes applied", options);
    }
  };

  const handleTextChange = (id: MyTreeElement["id"], value: string) => {
    if (id !== 0) {
      dispatch({ type: "modify", id: `${id}`, modifiers: [(state: BaseState) => { state.title = value }] });
    }
  };

  const handleSelect = (node: MyTreeElement) => {
    if (node.data !== undefined && node.id !== 0)
      dispatch({ type: 'select_from_list', id: `${node.id}`});
  }

  const handlecopy = (data: undefined | BaseState) => {
    if (data !== undefined) {
      dispatch({ type: "copy", state: data });
    }
  }

  return (
    <div style={{maxHeight: convertDimen(dimensions?.height) * 0.8, overflow: "auto" }} className="">
    <DndProvider backend={MultiBackend} options={getBackendOptions()}>
      <Tree
        tree={tree}
        rootId={0}
        dropTargetOffset={5}
        render={(node: MyTreeElement, { depth, isOpen, onToggle }) => (
          <CustomNode
            node={node}
            depth={depth}
            onToggle={onToggle}
            isOpen={isOpen}
            onDelete={handleDelete}
            onTextChange={handleTextChange}
            onSelect={handleSelect}
            onCopy={handlecopy}
            isSelected={currentlySelected === node.id}
          />
        )}
        onDragEnd={(e) => {
          console.debug("drag ended");
        }}
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
          // parent should never be dropped on itself
          if (dragSource?.id === dropTargetId) {
            return false;
          }
          return (dropTargetId === 0 || dropTarget?.droppable);
        }}
        placeholderRender={(node, { depth }) => (
          <Placeholder node={node} depth={depth} />
        )}
      />
    </DndProvider>
    </div>
  );
}