import React, { useState, useEffect } from "react";
import { Tree } from "@minoru/react-dnd-treeview";
import "./Modalpopuptreeview.css";
import { getUserTestFolders } from "../../services/testfolder.service";
import { getFolderTests } from "../../services/testcreate.service";

function Modalpopuptreeview({ 
  onFolderSelect,
  onNodeUpdate,
  folders,
  rootFolderGuid,
  selectedFolderGuid,
}) {
  const [treeData, setTreeData] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [clickedNode, setClickedNode] = useState(null); // State to store the clicked node

  const fetchChildFolders = async (parentNode) => {
    try {
      sessionStorage.setItem('selectedFolderId', JSON.stringify(parentNode.data.guid));
      console.log(parentNode.data.guid);
      if(!parentNode.children && parentNode.data.guid !== selectedFolderGuid) {
        const childFolders = await getUserTestFolders(
          parentNode.data.guid
        );
        const childNodes = [
          ...childFolders.map((childFolder, childIndex) => ({
            id: `${parentNode.id}.${childIndex + 1}`,
            parent: parentNode.id,
            droppable: true,
            text: childFolder.title,
            data: {
              guid: childFolder.guid,
              sequence: childFolder.sequence,
            },
          })),
        ];

        const updatedTreeData = [...treeData];
        const nodeIndex = updatedTreeData.findIndex(
          (n) => n.id === parentNode.id
        );

        const existingChildNodes = updatedTreeData
          .slice(nodeIndex + 1)
          .filter((node) => node.parent === parentNode.id);
        if (existingChildNodes.length === 0) {
          updatedTreeData.splice(nodeIndex + 1, 0, ...childNodes)
          setTreeData(updatedTreeData);
        }
      }
    } catch (error) {
      console.error("Error fetching child question folders:", error);
    }
  };

  useEffect(() => {
    if (folders && folders.length > 0) {
      const updatedTreeData = folders.map((folder, index) => ({
        id: folder.guid,
        parent: 0,
        droppable: folder.parentId ? true : false,
        text: folder.title,
        data: {
          guid: folder.guid,
          sequence: folder.sequence,
        },
      }));
      setTreeData(updatedTreeData);
    }
  }, [folders]);

  const handleDrop = async (newTree, { dragSource, dropTarget }) => {
    let parentId;

    if(dropTarget && dropTarget.data) {
      parentId = dropTarget.data.guid;
    } else {
      parentId = rootFolderGuid;
    }

    const nodeToBeUpdated = {
      guid: dragSource.data.guid,
      parentId: parentId,
      sequence: dropTarget ? dropTarget.data.sequence : 0,
      title: dragSource.text,
    };

    try{
      const childFolders = await getUserTestFolders(parentId);
      const childNodes = childFolders.map((childFolder, index) => ({
        id: `${parentId}.${index + 1}`,
        parent: parentId,
        droppable: true,
        text: childFolder.title,
        data: {
          guid: childFolder.guid,
          sequence: childFolder.sequence,
        },
      }));
      const parentIndex = newTree.findIndex((node) => node.id === parentId);
      const isChildNode = parentId.toString().includes(".");
      const updatedParentIndex = isChildNode ? parentIndex - 1 : parentIndex;
      const updatedTreeData = [...newTree];
      updatedTreeData.splice(updatedParentIndex + 1, 0, ...childNodes);
      setTreeData(updatedTreeData);
    } catch (error) {
      console.error("Error fetching child question folders:", error);
    }
    onNodeUpdate(nodeToBeUpdated);
  };

  const handleEditFolder = (folderTitle) => {
    console.log("Edit folder:", folderTitle);
    if (selectedFolder === folderTitle) {
      setSelectedFolder(null);
      if (onFolderSelect) {
        onFolderSelect("");
      }
    } else {
      if (onFolderSelect) {
        onFolderSelect(folderTitle);
      }
      setSelectedFolder(folderTitle);
    }
  }

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleNodeClick = (nodeId) => {
    setClickedNode(nodeId); // Set the clicked node
  };

  const handleDeleteFolder = (folderTitle) => {
    console.log("Delete folder:", folderTitle);
  };

  return (
    <div
      className={`treeview ${isDragging ? "grabbing" : ""}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      id="modal-treeview"
    >
      <Tree
      tree={treeData}
      rootId={0}
      render={(node, { isOpen, onToggle }) => (
        <div 
          className={`tree-node ${clickedNode === node.id ? 'clicked' : ''}`} // Apply the 'clicked' class conditionally
          onClick={() => {
            if (
              !isOpen &&
              (!node.children || node.children.length === 0)
            ) {
              fetchChildFolders(node);
            }
            onToggle();
            handleNodeClick(node.id); // Call handleNodeClick to set the clicked node
          }}
        >
          {node.droppable && (
            <span className="custom-caret">
              {isOpen ? (
                <i className="fa fa-caret-down"></i>
              ) : (
                <i className="fa fa-caret-right"></i>
              )}
            </span>
          )}
          {node.text}
        </div>
      )}
      dragPreviewRender={(monitorProps) => (
        <div className="custom-drag-preview">{monitorProps.item.text}</div>
      )}
      onDrop={handleDrop}
      canDrop={() => false}
      canDrag={() => false}
      dragPreviewClassName="custom-drag-preview"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    />
    </div>
  );
}

export default Modalpopuptreeview;
