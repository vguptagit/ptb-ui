import React, { useState, useEffect } from "react";
import { Tree } from "@minoru/react-dnd-treeview";
import "./TreeView.css";

const DraggableNode = ({
  node,
  onToggle,
  folderId,
  depth,
  isOpen,
  selectedFolderId,
  handleFolderSelect,
  handleFolderSelectOnParent
}) => {
  const handleEditFolder = (folderId) => {
    if (handleFolderSelect) {
      handleFolderSelect(folderId);
    }
  };

  const handleNodeClick = (e) => {
    if (selectedFolderId !== node.data.guid) {
      handleFolderSelect(node.data.guid); 
      console.log("Selected Folder ID:", node.data.guid);
    } else {
      handleFolderSelect(null); 
    }
    onToggle(); // Toggle the node
    handleFolderSelectOnParent(node);
    e.preventDefault();
    e.stopPropagation();
  };
  

  return (
    <div
      className={`tree-node ${selectedFolderId === node.data.guid ? 'selected' : ''}`}
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
      {folderId === node.data.guid && (
        <button
          className={`edit-button ${selectedFolderId === node.data.guid ? 'selected' : ''}`}
          onClick={() => handleEditFolder(node.data.guid)}
        >
          <i className="bi bi-pencil-fill"></i>
        </button>
      )}
    </div>
  );
};

function TreeView({ testFolders, folderId, onNodeUpdate, handleFolderSelectOnParent,}) {
  const [treeData, setTreeData] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  console.log("selectedfolderID",selectedFolderId);
  useEffect(() => {
    sessionStorage.setItem('selectedFolderId', JSON.stringify(selectedFolderId));
  }, [selectedFolderId]);
  const handleDrop = (newTree, { dragSource, dropTarget, destinationIndex }) => {
    setTreeData(newTree);
    const nodeToBeUpdated = {
      guid: dragSource.data.guid,
      parentId: dropTarget === undefined ? 0 : dropTarget.data.guid,
      sequence: dropTarget === undefined ? getNextSequenceWithoutParentId(dragSource) : getNextSequenceForParentFolderId(dropTarget.data.guid),
      extUserId: window.piSession.userId(),
    }
    onNodeUpdate(nodeToBeUpdated);
  };

  
  function getIndexByParentGuid(parentGuid) {
    return testFolders.findIndex(ele => ele.guid === parentGuid);
  }

  function getNextSequenceForParentFolderId(parentFolderId) {
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
        id: index + 1, 
        parent: getIndexByParentGuid(folder.parentId) !== 0 ? getIndexByParentGuid(folder.parentId) + 1 : 0,
        droppable: true,
        text: folder.title,
        data: {
            guid: folder.guid,
            sequence: folder.sequence,
        }
    }));
      folderNodes.sort((a, b) => a.data.sequence - b.data.sequence);
      
      const insertIndex = folderNodes.findIndex(node => node.data.sequence === specifiedSequence);


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
                    folderId={folderId}
                    depth={depth}
                    onToggle={onToggle}
                    selectedFolderId={selectedFolderId}
                    handleFolderSelect={setSelectedFolderId}
                    handleFolderSelectOnParent={handleFolderSelectOnParent}
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
