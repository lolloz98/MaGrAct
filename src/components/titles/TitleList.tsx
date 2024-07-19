import { MyTreeElement } from "../ComponentMapper";
import { DndProvider, DragLayerMonitorProps, DropOptions, getBackendOptions, MultiBackend, NodeModel, Tree } from "@minoru/react-dnd-treeview";
import { DispactherAction } from "../StoreContext";
import BaseState from "../states/BaseState";
import { Button } from "@mui/material";
import { CustomNode } from "./CustomNode";
import { useEffect, useState } from "react";
import { CustomDragPreview } from "./CustomDragPreview";
import styles from "./TitleList.module.css";
import { Placeholder } from "./PlaceHolder";


export default function TitleList({ tree, dispatch }: {
    tree: MyTreeElement[],
    dispatch: DispactherAction
}) {
  const [treeData, setTreeData] = useState<MyTreeElement[]>(tree);

  useEffect(()=> {setTreeData(tree);}, [tree]);

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
      setTreeData(newTree);
    };

    return (
        <DndProvider backend={MultiBackend} options={getBackendOptions()}>
          <Tree
            tree={treeData}
            rootId={0}
            render={(node: MyTreeElement, { depth, isOpen, onToggle }) => (
              <CustomNode
                node={node}
                depth={depth}
                onToggle={onToggle}
                isOpen={isOpen}
                onDelete={handleDelete}
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