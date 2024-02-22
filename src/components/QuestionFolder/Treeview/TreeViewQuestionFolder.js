import React, { useState, useEffect } from "react";
import { Tree } from "@minoru/react-dnd-treeview";
import "./TreeViewQuestionFolder.css";
import { getChildQuestionFolders } from "../../../services/userfolder.service";

function TreeViewQuestionFolder({ onFolderSelect, onNodeUpdate, folders }) {
  const [treeData, setTreeData] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);

  useEffect(() => {
    if (folders && folders.length > 0) {
      const fetchChildFolders = async () => {
        const updatedTreeData = await Promise.all(
          folders.map(async (folder, index) => {
            const childFolders = await getChildQuestionFolders(folder.guid);
            const childNodes = await Promise.all(
              childFolders.map(async (childFolder, childIndex) => {
                const grandChildFolders = await getChildQuestionFolders(
                  childFolder.guid
                );
                const grandChildNodes = grandChildFolders.map(
                  (grandChildFolder, grandChildIndex) => ({
                    id: `${index + 1}.${childIndex + 1}.${grandChildIndex + 1}`,
                    parent: `${index + 1}.${childIndex + 1}`,
                    droppable: true,
                    text: grandChildFolder.title,
                    data: {
                      guid: grandChildFolder.guid,
                      sequence: grandChildFolder.sequence,
                    },
                  })
                );
                return [
                  {
                    id: `${index + 1}.${childIndex + 1}`,
                    parent: index + 1,
                    droppable: true,
                    text: childFolder.title,
                    data: {
                      guid: childFolder.guid,
                      sequence: childFolder.sequence,
                    },
                  },
                  ...grandChildNodes,
                ];
              })
            );
            return [
              {
                id: index + 1,
                parent: 0,
                droppable: true,
                text: folder.title,
                data: {
                  guid: folder.guid,
                  sequence: folder.sequence,
                },
              },
              ...childNodes.flat(),
            ];
          })
        );
        setTreeData(updatedTreeData.flat());
      };

      fetchChildFolders();
    }
  }, [folders]);

  const handleDrop = async (newTree, { dragSource, dropTarget }) => {
    const nodeToBeUpdated = {
      guid: dragSource.data.guid,
      parentId: dropTarget.data.guid,
      sequence: dropTarget.data.sequence,
      title: dragSource.text,
    };

    try {
      // Fetch child folders of the drop target
      const childFolders = await getChildQuestionFolders(dropTarget.data.guid);

      // Map fetched child folders to tree nodes
      const childNodes = childFolders.map((childFolder, index) => ({
        id: `${dropTarget.id}.${index + 1}`,
        parent: dropTarget.id,
        droppable: true,
        text: childFolder.title,
        data: {
          guid: childFolder.guid,
          sequence: childFolder.sequence,
        },
      }));

      // Find the parent node index in the treeData
      const parentIndex = newTree.findIndex(
        (node) => node.id === dropTarget.id
      );

      // Check if the drop target node is a child node
      const isChildNode = dropTarget.id.toString().includes(".");

      // If it's a child node, update the parentIndex
      const updatedParentIndex = isChildNode ? parentIndex - 1 : parentIndex;

      // Insert the new child nodes at the appropriate position
      const updatedTreeData = [...newTree];
      updatedTreeData.splice(updatedParentIndex + 1, 0, ...childNodes);

      // Update the state with the new tree data
      setTreeData(updatedTreeData);
    } catch (error) {
      console.error("Error fetching child question folders:", error);
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

  const handleDeleteFolder = (folderTitle) => {
    console.log("Delete folder:", folderTitle);
    // Implement deletion logic here
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
                className="editbutton"
                onClick={() => handleEditFolder(node.text)}
              >
                <i className="bi bi-pencil-fill"></i>
              </button>
            )}
            <button
              className="deletebutton"
              onClick={() => handleDeleteFolder(node.text)}
            >
              <i className="bi bi-trash"></i>
            </button>
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
