import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { ArrowRight, Delete, FileCopy } from "@mui/icons-material";
import { useDragOver } from "@minoru/react-dnd-treeview";
import styles from "./CustomNode.module.css";
import { MyTreeElement } from "../ComponentMapper";
import MyCustomInput from "../inputs/MyCustomInput";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import { Stack, Tooltip } from "@mui/material";
import BaseState from "../states/BaseState";


type Props = {
    node: MyTreeElement;
    depth: number;
    isOpen: boolean;
    isSelected: boolean;
    onToggle: (id: MyTreeElement["id"]) => void;
    onDelete: (id: MyTreeElement["id"]) => void;
    onTextChange: (id: MyTreeElement["id"], value: string) => void;
    onSelect: (node: MyTreeElement) => void;
    onCopy: (noe: BaseState | undefined) => void;
};

export const CustomNode: React.FC<Props> = (props) => {
    const { id, data, text } = props.node;

    const [hover, setHover] = useState<boolean>(false);

    const [isCurrentlyRenaming, setIsCurrentlyRenaming] = useState(false);

    useEffect(() => {
        setIsCurrentlyRenaming(false)
    }, [props.node.text]);

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        props.onToggle(props.node.id);
    };

    const handleSelect = () => props.onSelect(props.node);

    const dragOverProps = useDragOver(id, props.isOpen, props.onToggle);

    const handleCancelRenaming = () => {
        setIsCurrentlyRenaming(false);
    };

    const handleSubmitRenaming = (e: Event) => {
        setIsCurrentlyRenaming(false);
        props.onTextChange(id, (e.target as HTMLInputElement).value);
    };

    const handleShowInputForRenaming = () => {
        setIsCurrentlyRenaming(true);
    };

    const normal = (
        <div
            className={`tree-node ${styles.root} ${props.isSelected ? styles.isSelected : ""
                }`}
            onClick={handleSelect}
        >
            {props.node.droppable && (<div onClick={handleToggle}> {props.isOpen? <ArrowRight style={{ rotate: "90deg" }} /> : <ArrowRight />} </div>)}
            <div className={styles.labelGridItem} onDoubleClick={handleShowInputForRenaming}> 
                <Tooltip title={props.node.text} arrow>
                <Typography variant="body2" 
                noWrap textOverflow={'ellipsis'} maxWidth={100}>{props.node.text}</Typography></Tooltip></div>
            {hover && (
                <Stack direction={"row"} alignContent={"center"}>
                    <IconButton size="small" onClick={() => handleShowInputForRenaming()}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => props.onDelete(id)}>
                        <Delete fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => props.onCopy(data)}>
                        <FileCopy fontSize="small" />
                    </IconButton>
                </Stack>
            )}
        </div>
    );

    const renaming = (
        <div className={styles.inputWrapper}>
            <MyCustomInput
                variant="standard"
                state={text}
                className={`${styles.textField}
                ${styles.nodeInput}`}
                value={props.node.data?.title}
                onMyChange={handleSubmitRenaming}
                onKeyUp={(e) => {
                    if (e.key === 'Enter') {
                        setIsCurrentlyRenaming(false)
                    }
                }}
            />
            <IconButton className={styles.editButton} onClick={handleCancelRenaming}>
                <CloseIcon className={styles.editIcon} />
            </IconButton>
        </div>
    );

    return (
        <div
            className={`tree-node ${styles.root}`}
            {...dragOverProps}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {
                isCurrentlyRenaming ?
                    renaming : normal
            }

        </div>
    );
};
