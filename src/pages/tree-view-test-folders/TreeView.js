import React, { useState, useEffect } from "react";
import { Tree } from "@minoru/react-dnd-treeview";
import "./TreeView.css";
import {
  deleteTestFolder,
  getUserTestFolders,
  deleteTest,
} from "../../services/testfolder.service";
import { getFolderTests } from "../../services/testcreate.service";
import Toastify from "../../components/common/Toastify";

function TreeView({
  onFolderSelect,
  onNodeUpdate,
  folders,
  rootFolderGuid,
  selectedFolderGuid,
}) {
  const [treeData, setTreeData] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [clickedNodes, setClickedNodes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFolderToDelete, setSelectedFolderToDelete] = useState(null);
  const [selectedTestToDelete, setSelectedTestToDelete] = useState(null);
  const [showTestDeleteModal, setShowTestDeleteModal] = useState(false);

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

  const fetchChildFolders = async (parentNode) => {
    try {
      if (!parentNode.children && parentNode.data.guid !== selectedFolderGuid && parentNode.droppable === true) {
        const childFolders = await getUserTestFolders(parentNode.data.guid);
        const childTests = await getFolderTests(parentNode.data.guid);

        const childNodes = [
          ...childFolders.map((childFolder, childIndex) => ({
            id: `${parentNode.id}.folder.${childIndex + 1}`,
            parent: parentNode.id,
            droppable: true,
            text: childFolder.title,
            data: {
              guid: childFolder.guid,
              sequence: childFolder.sequence,
            },
          })),
          ...childTests.map((childTest, childIndex) => ({
            id: `${parentNode.id}.test.${childIndex + 1}`,
            parent: parentNode.id,
            droppable: false,
            text: childTest.title,
            data: {
              guid: childTest.guid,
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
          updatedTreeData.splice(nodeIndex + 1, 0, ...childNodes);
          setTreeData(updatedTreeData);
        }
      }
    } catch (error) {
      console.error("Error fetching child question folders:", error);
    }
  };

  const handleDrop = async (newTree, { dragSource, dropTarget }) => {
    let parentId;

    if (dropTarget && dropTarget.data) {
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

    try {
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
  };

  const handleDeleteFolder = (folderTitle) => {
    setSelectedFolderToDelete(folderTitle);
    setShowModal(true);
  };

  const handleModalCancel = () => {
    setShowModal(false);
    setSelectedFolderToDelete(null);
  };

  const handleModalConfirmDelete = async () => {
    try {
      const folderToDelete = folders.find(
        (folder) => folder.title === selectedFolderToDelete
      );
      if (!folderToDelete) {
        console.error("Folder not found:", selectedFolderToDelete);
        return;
      }
      const folderIdToDelete = folderToDelete.guid;
      await deleteTestFolder(folderIdToDelete);
      console.log("Folder deleted:", selectedFolderToDelete);
      const updatedTreeData = treeData.filter(
        (node) => node.data.guid !== folderIdToDelete
      );
      setTreeData(updatedTreeData);
      Toastify({ message: "Folder deleted successfully", type: "success" });
    } catch (error) {
      console.error("Error deleting folder:", error);
      Toastify({ message: "Failed to delete Folder", type: "error" });
    }
    setShowModal(false);
    setSelectedFolderToDelete(null);
  };

  const deleteTestInsideFolder = async (folderId, testId) => {
    try {
      await deleteTest(folderId, testId);
      console.log("Test deleted:", testId);
      Toastify({ message: "Test deleted successfully", type: "success" });
    } catch (error) {
      console.error("Error deleting test:", error);
      Toastify({ message: "Failed to delete Test", type: "error" });
    }
  };

  const handleDeleteTest = (folderId, testId) => {
    if (!folderId) {
      setSelectedTestToDelete({ folderId: rootFolderGuid, testId });
      setShowTestDeleteModal(true);
    } else {
      setSelectedTestToDelete({ folderId, testId });
      setShowTestDeleteModal(true);
    }
  };

  const handleConfirmDeleteTest = async () => {
    try {
      const { folderId, testId } = selectedTestToDelete;
      await deleteTestInsideFolder(folderId, testId);
      const updatedTreeData = treeData
        .map((node) => {
          if (
            (node.id.startsWith(`${folderId}.test`) &&
              node.data.guid === testId) ||
            (folderId === rootFolderGuid &&
              node.data &&
              node.data.guid === testId)
          ) {
            return null;
          }
          return node;
        })
        .filter(Boolean);
      setTreeData(updatedTreeData);
    } catch (error) {
      console.error("Error deleting test:", error);
    }
    setShowTestDeleteModal(false);
    setSelectedTestToDelete(null);
  };

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

  return (
    <div
      className={`treeview ${isDragging ? "grabbing" : ""}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <Tree
        tree={treeData}
        rootId={0}
        render={(node, { isOpen, onToggle }) => (
          <div
            className={`tree-node ${
              clickedNodes.includes(node.id) ? "clicked" : ""
            }`}
            onClick={() => {
              if (!isOpen && (!node.children || node.children.length === 0)) {
                fetchChildFolders(node);
              }
              onToggle();
              setClickedNodes((prevClickedNodes) => {
                if (prevClickedNodes.includes(node.id)) {
                  return prevClickedNodes.filter((item) => item !== node.id);
                } else {
                  return [...prevClickedNodes, node.id];
                }
              });
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
            {selectedFolder === node.text && (
              <button
                className="editbutton selected"
                onClick={() => handleEditFolder(node.text)}
                disabled={!node.droppable}
              >
                <i className="bi bi-pencil-fill"></i>
              </button>
            )}
            {selectedFolder !== node.text && node.droppable && (
              <button
                className="editbutton"
                onClick={() => handleEditFolder(node.text)}
                disabled={!node.droppable}
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
            {!node.droppable && (
              <button
                className="deletebutton"
                onClick={() => handleDeleteTest(node.parent, node.data.guid)}
              >
                <i className="bi bi-trash"></i>
              </button>
            )}
          </div>
        )}
        dragPreviewRender={(monitorProps) => (
          <div className="custom-drag-preview">{monitorProps.item.text}</div>
        )}
        onDrop={handleDrop}
        dragPreviewClassName="custom-drag-preview"
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      />
      {showModal && (
        <div
          className="modal fade show"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header" id="delete-modal-header">
                <h5 className="modal-title">Delete Folder</h5>
              </div>
              <div className="modal-body">
              <i class="fa-solid fa-circle-question"></i>
                &nbsp;Deleting folder will delete the child folders and tests. Are you sure you want to delete the folder? This action cannot be undone.
              </div>
              <div className="modal-footer" id="delete-modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleModalCancel}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleModalConfirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showTestDeleteModal && (
        <div
          className="modal fade show"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header" id="delete-modal-header">
                <h5 className="modal-title">Delete Test</h5>
              </div>
              <div className="modal-body">
              <i class="fa-solid fa-circle-question"></i>
                &nbsp;
                Are you sure you want to delete the test? This action cannot be undone.
              </div>
              <div className="modal-footer" id="delete-modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowTestDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleConfirmDeleteTest}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TreeView;
