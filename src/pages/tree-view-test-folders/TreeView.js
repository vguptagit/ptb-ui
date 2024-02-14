import React, { useState, useEffect } from "react";
import { Tree } from "@minoru/react-dnd-treeview";
import "./TreeView.css";

const DraggableNode = ({ node, onToggle, depth, isOpen, handleFolderSelect }) => {

  const [selectedFolder, setSelectedFolder] = useState(null);

  const handleEditFolder = (folderTitle) => {
    console.log("Edit folder:", folderTitle);
    if (handleFolderSelect) {
      handleFolderSelect(folderTitle);
      setSelectedFolder(folderTitle);
    }
  };

  return (
    <div
      className="tree-node"
      onClick={() => {
        onToggle();
      }}
      style={{ marginInlineStart: depth * 10 }}
    >
      {node.droppable && (
        <span>
          {isOpen ? (
            <i className="bi bi-caret-down-fill"></i>
          ) : (
            <i className="bi bi-caret-right-fill"></i>
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
  );
};

function TreeView({ testFolders, onNodeUpdate, handleFolderSelect }) {
  const [treeData, setTreeData] = useState([]);

  const handleDrop = (newTree, { dragSource, dropTarget }) => {
    setTreeData(newTree);
    console.log(dragSource);
    console.log(dropTarget);
    const nodeToBeUpdated = {
      guid: dragSource.data.guid,
      parentId: dropTarget.data.guid,
      sequence: dragSource.data.sequence,
    }
    console.log(nodeToBeUpdated);
    onNodeUpdate(nodeToBeUpdated);
  };

  // one based index
  function getIndexByParentGuid(parentGuid) {
    return testFolders.findIndex(ele => ele.guid === parentGuid);
  }

  useEffect(() => {
    if (testFolders && testFolders.length > 0) {
      const folderNodes = testFolders.map((folder, index) => ({
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
      console.log(folderNodes);
    }
  }, [testFolders]);

  return (
    <>
      <div className="treeview">
        <Tree
          tree={treeData}
          rootId={0}
          render={(node, { depth, isOpen, onToggle }) => (
            <DraggableNode node={node} isOpen={isOpen} depth={depth} onToggle={onToggle} handleFolderSelect={handleFolderSelect} />
          )}
          dragPreviewRender={(monitorProps) => (
            <div>{monitorProps.item.node?.text}</div>
          )}
          onDrop={handleDrop}
          sort={false}
        />
      </div>
    </>
  );
}

export default TreeView;
