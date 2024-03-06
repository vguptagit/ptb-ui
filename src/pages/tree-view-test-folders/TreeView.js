import React, { useState, useEffect } from "react";
import { Tree } from "@minoru/react-dnd-treeview";
import "./TreeView.css";
import { getFolderTests } from "../../services/testcreate.service";

const DraggableNode = ({
  node,
  onToggle,
  folderName,
  depth,
  isOpen,
  selectedFolderId,
  handleFolderSelect,
  handleFolderSelectOnParent
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const handleEditFolder = (folderTitle) => {
    if (handleFolderSelect) {
      handleFolderSelect(folderTitle);
    }
  };

   const handleNodeClick = (e) => {
    // If the clicked node is different from the currently selected node
    if (selectedNodeId !== node.data.guid) {
      setSelectedNodeId(node.data.guid); // Select the clicked node
      console.log("Selected Node ID:", node.data.guid);
    } else {
      // If the clicked node is the same as the currently selected node
      setSelectedNodeId(null); // Deselect the clicked node
    }
    onToggle(); // Toggle node state
    // handleFolderSelectOnParent(node);
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDeleteFolder = (folderTitle) => {
    console.log("Delete folder:", folderTitle);
  };

  return (
    <div
      className={`tree-nodes ${selectedFolderId === node.data.guid ? 'selected' : ''}`}
      style={{ marginInlineStart: depth * 10 }}
    >
      <div className="node-name">
        {node.data.sequence !== undefined && (
          <span>
            {isOpen ? (
              <i className="bi bi-caret-down-fill"
                onClick={handleNodeClick}
              ></i>
            ) : (
              <i className="bi bi-caret-right-fill"
                onClick={handleNodeClick}
              ></i>
            )}
          </span>
        )}
        {node.text}
      </div>
      <div>
      {folderName === node.text && (
        <button
          className={`edit-btn ${node.data.sequence === undefined ? 'disabled' : ''} ${selectedNodeId === node.data.guid ? '' : 'selected'}`}
          onClick={node.data.sequence === undefined ? undefined : () => handleEditFolder(node.text)}
          disabled={node.data.sequence === undefined}
        >
          <i className="bi bi-pencil-fill"></i>
      </button>
      )}
      {folderName !== node.text && (
        <button
          className={`edit-btn ${node.data.sequence === undefined ? 'disabled' : ''} ${selectedNodeId === node.data.guid ? '' : 'selected'}`}
          onClick={node.data.sequence === undefined ? undefined : () => handleEditFolder(node.text)}
          disabled={node.data.sequence === undefined}
        >
          <i className="bi bi-pencil-fill"></i>
        </button>
      )}
      {folderName === node.text && (
        <button
          className="delete-btn"
          onClick={() => handleDeleteFolder(node.text)}
        >
          <i className="bi bi-trash"></i>
        </button>
      )}
      {folderName !== node.text && (
        <button
        className="delete-btn"
        onClick={() => handleDeleteFolder(node.text)}
      >
        <i className="bi bi-trash"></i>
      </button>
      )}
      </div>
    </div>
  );
};

function TreeView({ testFolders, folderName, onNodeUpdate, handleFolderSelect ,handleFolderSelectOnParent,}) {
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

  const testDetails = async (guid) => {
    try {
      const folderTests = await getFolderTests(guid);

      const titleNames = [];

    // Loop through folderTests and save titlenames
    for (const test of folderTests) {
      // Assuming test object has a property called 'titlename'
      if (test && test.title) {
        titleNames.push(test.title);
      }
    }

    return titleNames;

    } catch (error) {
      console.error("Error fetching folder tests:", error);
    }
  };

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

      const fetchTestDetails = async () => {
        for (const folder of testFolders) {
            try {
                const titleNames = await testDetails(folder.guid);
                for (const testName of titleNames) {
                  folderNodes.push({
                        id: `${folder.guid}-${testName}`, // Unique id for test node
                        parent: getIndexByParentGuid(folder.guid) !== 0 ? getIndexByParentGuid(folder.guid) + 1 : 0, // Parent id is the folder's guid
                        droppable: false,
                        text: testName,
                        data: {
                            testName: testName,
                        },
                    });
                }
            } catch (error) {
                console.error("Error fetching folder tests:", error);
            }
        }
        const folderNodesFiltered = folderNodes.filter(node => node.text !== null);
        setTreeData(folderNodesFiltered);
    };
    fetchTestDetails();

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
                    selectedFolderId={selectedFolderId}
                    handleFolderSelect={handleFolderSelect}
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
