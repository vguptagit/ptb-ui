import React, { useState, useEffect } from "react";
import { Tree } from "@minoru/react-dnd-treeview";
import "./TreeViewQuestionFolder.css";
import { getUserQuestionFolders } from "../../../services/userfolder.service";

function TreeViewQuestionFolder() {
  const [treeData, setTreeData] = useState([]);
  const handleDrop = (newTree) => setTreeData(newTree);

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

  return (
    <div className="treeview">
      <Tree
        tree={treeData}
        rootId={0}
        render={(node, { isOpen, onToggle }) => (
          <div className="tree-node">
            {node.droppable && (
              <span onClick={onToggle}>
                {isOpen ? (
                  <i className="bi bi-caret-down-fill"></i>
                ) : (
                  <i className="bi bi-caret-right-fill"></i>
                )}
              </span>
            )}
            {node.text}
          </div>
        )}
        dragPreviewRender={(monitorProps) => (
          <div style={{ fontSize: "inherit" }}>{monitorProps.item.text}</div>
        )}
        onDrop={handleDrop}
      />
    </div>
  );
}

export default TreeViewQuestionFolder;
