import React, { useState, useEffect } from "react";
import { Tree } from "@minoru/react-dnd-treeview";
import "./TreeViewQuestionFolder.css";
import { getUserQuestionFolders } from "../../../services/userfolder.service";

function TreeViewQuestionFolder({ onFolderSelect }) {
  const [treeData, setTreeData] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);

  useEffect(() => {
    getUserQuestionFolders()
      .then((folders) => {
        const folderNodes = folders.map((folder, index) => ({
          id: index + 1,
          parent: 0,
          droppable: true,
          text: folder.title,
        }));
        setTreeData(folderNodes);
      })
      .catch((error) => {
        console.error("Error fetching question folders:", error);
      });
  }, []);

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
        onDrop={(newTree) => setTreeData(newTree)}
        dragPreviewClassName="custom-drag-preview"
      />
    </div>
  );
}

export default TreeViewQuestionFolder;
