import React, { useState, useEffect } from "react";
import { Tree } from "@minoru/react-dnd-treeview";
import "./TreeViewQuestionFolder.css";

function TreeViewQuestionFolder({ onFolderSelect, onNodeUpdate, folders }) {
  const [treeData, setTreeData] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);

  useEffect(() => {
    if (folders && folders.length > 0) {
      const folderNodes = folders.map((folder, index) => ({
        id: index + 1, // one based index
        parent: getIndexByParentGuid(folder.parentId) !== 0 ? getIndexByParentGuid(folder.parentId) + 1 : 0,
        droppable: true,
        text: folder.title,
        data: {
          guid: folder.guid,
          sequence: folder.sequence,
        }
      }));
      setTreeData(folderNodes);
    }
  }, [folders]);

  function getIndexByParentGuid(parentGuid) {
    return folders.findIndex(ele => ele.guid === parentGuid);
  }

  const handleDrop = (newTree, { dragSource, dropTarget }) => {
    setTreeData(newTree);
    const nodeToBeUpdated = {
      guid: dragSource.data.guid,
      parentId: dropTarget.data.guid,
      sequence: dropTarget.data.sequence,
      title: dragSource.text,
    }
    onNodeUpdate(nodeToBeUpdated);
  };

  const handleEditFolder = (folderTitle) => {
    console.log("Edit folder:", folderTitle);
    if (onFolderSelect) {
      onFolderSelect(folderTitle);
      setSelectedFolder(folderTitle);
    }
  };

  return (
    <div className="treeview">
      <Tree
        tree={treeData}
        rootId={0}
        render={(node, { isOpen, onToggle }) => (
          <div className="tree-node">
            {node.droppable && (
              <span onClick={onToggle} className="custom-caret">
                {isOpen ? (
                  <i className="fa fa-caret-down"></i>
                ) : (
                  <i className="fa fa-caret-right"></i>
                )}
              </span>
            )}
            {node.text}
            {selectedFolder === node.text && (
              <button
                className="edit-button selected"
                onClick={() => handleEditFolder(node.text)}
              >
                <i className="bi bi-pencil-fill"></i>
              </button>
            )}
            {selectedFolder !== node.text && (
              <button
                className="edit-button"
                onClick={() => handleEditFolder(node.text)}
              >
                <i className="bi bi-pencil-fill"></i>
              </button>
            )}
          </div>
        )}
        dragPreviewRender={(monitorProps) => (
          <div className="custom-drag-preview">{monitorProps.item.text}</div>
        )}
        onDrop={handleDrop}
        dragPreviewClassName="custom-drag-preview"
      />
    </div>
  );
}

export default TreeViewQuestionFolder;
