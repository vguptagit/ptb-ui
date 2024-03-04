import React, { useState, useEffect } from "react";
import { Tree } from "@minoru/react-dnd-treeview";
import "./TreeView.css";

const DraggableNode = ({
  node,
  onToggle,
  folderName,
  depth,
  isOpen,
  handleFolderSelect
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const handleEditFolder = (folderTitle) => {
    if (handleFolderSelect) {
      handleFolderSelect(folderTitle);
    }
  };

  const handleNodeClick = () => {
    // If the clicked node is different from the currently selected node
    if (selectedNodeId !== node.data.guid) {
      setSelectedNodeId(node.data.guid); // Select the clicked node
      console.log("Selected Node ID:", node.data.guid);
    } else {
      // If the clicked node is the same as the currently selected node
      setSelectedNodeId(null); // Deselect the clicked node
    }
    onToggle(); // Toggle node state
  };

  return (
    <div
      className={`tree-node ${selectedNodeId === node.data.guid ? 'selected' : ''}`}
      onClick={handleNodeClick}
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
      {folderName === node.text && (
        <button
          className={`edit-button ${selectedNodeId === node.data.guid ? 'selected' : ''}`}
          onClick={() => handleEditFolder(node.text)}
        >
          <i className="bi bi-pencil-fill"></i>
        </button>
      )}
      {folderName !== node.text && (
        <button
          className={`edit-button ${selectedNodeId === node.data.guid ? 'selected' : ''}`}
          onClick={() => handleEditFolder(node.text)}
        >
          <i className="bi bi-pencil-fill"></i>
        </button>
      )}
    </div>
  );
};
function TreeView({ testFolders, folderName, onNodeUpdate, handleFolderSelect }) {
  const [treeData, setTreeData] = useState([]);

  const handleDrop = (newTree, { dragSource, dropTarget, destinationIndex }) => {
    setTreeData(newTree);
    const nodeToBeUpdated = {
      guid: dragSource.data.guid,
      parentId: dropTarget === undefined ? 0 : dropTarget.data.guid,
      sequence: dropTarget === undefined ? getNextSequenceWithoutParentId(dragSource) : getNextSequenceForParentFolderId(dropTarget.data.guid),
      extUserId: sessionStorage.getItem('userId'),
    }
    onNodeUpdate(nodeToBeUpdated);
  };

  // one based index
  function getIndexByParentGuid(parentGuid) {
    return testFolders.findIndex(ele => ele.guid === parentGuid);
  }

  function getNextSequenceForParentFolderId(parentFolderId) {
    // find next sequence by parent folder id 
    let maxSequence = 0;
    for (const folder of testFolders) {
      if (folder.parentId === parentFolderId && folder.sequence > maxSequence) {
        maxSequence = folder.sequence;
      }
    }
    return maxSequence + 1;
  }

  function getNextSequenceWithoutParentId(dragSource) {
    return dragSource.data.sequence;
  }

  useEffect(() => {
    if (testFolders && testFolders.length > 0) {
      const biggestSequence = testFolders.reduce((maxSequence, folder) => {
        return Math.max(maxSequence, folder.sequence);
    }, -Infinity);
      const specifiedSequence = biggestSequence;
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
      folderNodes.sort((a, b) => a.data.sequence - b.data.sequence);
      // Find the index where the sequence value becomes greater than or equal to the specified sequence
      const insertIndex = folderNodes.findIndex(node => node.data.sequence === specifiedSequence);

      // If such an index is found, splice the array to move the folders with greater sequence values to the beginning
      if (insertIndex !== -1) {
        const movedFolders = folderNodes.splice(insertIndex);
        folderNodes.unshift(...movedFolders);
      }

      setTreeData(folderNodes);
    }
  }, [testFolders]);

  return (
    <>
      <div className="treeview">
        <Tree
          tree={treeData}
          rootId={0}
          render={(node, { depth, isOpen, onToggle }) => {
            return (
                <DraggableNode
                    node={node}
                    isOpen={isOpen}
                    folderName={folderName}
                    depth={depth}
                    onToggle={onToggle}
                    handleFolderSelect={handleFolderSelect}
                />
            );
        }}
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
