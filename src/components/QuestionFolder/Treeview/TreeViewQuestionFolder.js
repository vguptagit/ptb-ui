import React, { useState, useEffect } from "react";
import { Tree } from "@minoru/react-dnd-treeview";
import "./TreeViewQuestionFolder.css";
import {
  getChildQuestionFolders,
  getUserQuestions,
  swapQuestionBetweenFolders,
} from "../../../services/userfolder.service";
import Toastify from "../../common/Toastify";
import CustomQuestionBanksService from "../../../services/CustomQuestionBanksService";
import MultipleChoice from "../../questions/MultipleChoice";
import MultipleResponse from "../../questions/MultipleResponse";
import TrueFalse from "../../questions/TrueFalse";
import Matching from "../../questions/Matching";
import FillInBlanks from "../../questions/FillInBlanks";
import Essay from "../../questions/Essay";
import QtiService from "../../../utils/qtiService";

function TreeViewQuestionFolder({
  onFolderSelect,
  onNodeUpdate,
  folders,
  rootFolderGuid,
  selectedFolderGuid,
  savedQuestions,
}) {
  const [treeData, setTreeData] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const fetchChildFolders = async (parentNode) => {
    try {
      if (!parentNode.children && parentNode.data.guid !== selectedFolderGuid) {
        const childFolders = await getChildQuestionFolders(
          parentNode.data.guid
        );
        const childNodes = childFolders.map((childFolder, childIndex) => ({
          id: `${parentNode.id}.${childIndex + 1}`,
          parent: parentNode.id,
          droppable: true,
          text: childFolder.title,
          data: {
            guid: childFolder.guid,
            sequence: childFolder.sequence,
            isQuestion: false,
          },
        }));

        const questions = await getUserQuestions(parentNode.data.guid);
        const questionsWithQtiModels = questions.map((question, index) => {
          const {
            qtixml,
            metadata: { quizType },
          } = question;
          const qtiModel = QtiService.getQtiModel(qtixml, quizType);
          qtiModel.EditOption = false;
          return {
            ...question,
            qtiModel,
          };
        });

        const questionNodes = questionsWithQtiModels.map((question, index) => ({
          id: `${parentNode.bookGuid}-${parentNode.nodeGuid}-question-${index}`,
          parent: parentNode.id,
          droppable: false,
          questionGuid: question.guid,
          text: (
            <DraggableQuestion
              key={question.guid}
              question={question}
              index={index}
            />
          ),
          data: {
            guid: question.guid,
            sequence: question.sequence,
            isQuestion: true,
          },
        }));

        const updatedTreeData = [...treeData];
        const nodeIndex = updatedTreeData.findIndex(
          (n) => n.id === parentNode.id
        );

        const existingChildNodes = updatedTreeData
          .slice(nodeIndex + 1)
          .filter((node) => node.parent === parentNode.id);
        if (existingChildNodes.length === 0) {
          updatedTreeData.splice(
            nodeIndex + 1,
            0,
            ...childNodes,
            ...questionNodes
          );
          setTreeData(updatedTreeData);
        }
      }
    } catch (error) {
      console.error("Error fetching child question folders:", error);
    }
  };

  const DraggableQuestion = ({ question, index }) => {
    const key = question.guid;
    const { qtiModel } = question;

    switch (question.metadata.quizType) {
      case CustomQuestionBanksService.MultipleChoice:
        return (
          <div key={key}>
            <MultipleChoice
              questionNode={question}
              questionNodeIndex={index}
              qtiModel={qtiModel}
              printView={3}
            />
          </div>
        );
      case CustomQuestionBanksService.MultipleResponse:
        return (
          <div key={key}>
            <MultipleResponse
              questionNode={question}
              questionNodeIndex={index}
              qtiModel={qtiModel}
              printView={3}
            />
          </div>
        );
      case CustomQuestionBanksService.TrueFalse:
        return (
          <div key={key}>
            <TrueFalse
              questionNode={question}
              questionNodeIndex={index}
              qtiModel={qtiModel}
              printView={3}
            />
          </div>
        );
      case CustomQuestionBanksService.Matching:
        return (
          <div key={key}>
            <Matching
              questionNode={question}
              questionNodeIndex={index}
              qtiModel={qtiModel}
              printView={3}
            />
          </div>
        );
      case CustomQuestionBanksService.FillInBlanks:
        return (
          <div key={key}>
            <FillInBlanks
              questionNode={question}
              questionNodeIndex={index}
              qtiModel={qtiModel}
              printView={3}
            />
          </div>
        );
      case CustomQuestionBanksService.Essay:
        return (
          <div key={key}>
            <Essay
              questionNode={question}
              questionNodeIndex={index}
              qtiModel={qtiModel}
              printView={3}
            />
          </div>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (folders && folders.length > 0) {
      const updatedTreeData = [
        ...folders.map((folder) => ({
          id: folder.guid,
          parent: 0,
          droppable: true,
          text: folder.title,
          data: {
            guid: folder.guid,
            sequence: folder.sequence,
          },
        })),
        ...savedQuestions.map((question, index) => ({
          id: question.guid,
          parent: 0,
          droppable: false,
          text: (
            <DraggableQuestion
              key={question.guid}
              question={question}
              index={index}
            />
          ),
          data: {
            guid: question.guid,
            sequence: question.sequence,
            isQuestion: true,
          },
        })),
      ];
      setTreeData(updatedTreeData);
    }
  }, [folders, savedQuestions]);

  const handleDrop = async (newTree, { dragSource, dropTarget }) => {
    console.log(dragSource);
    console.log(dropTarget);

    if (dragSource.data.isQuestion) {
      const sourceFolderId = rootFolderGuid;
      const destinationFolderId = dropTarget.data.guid;
      const questionId = dragSource.data.guid;

      try {
        await swapQuestionBetweenFolders(
          sourceFolderId,
          destinationFolderId,
          questionId
        );
        Toastify({ message: "Question moved successfully", type: "success" });
      } catch (error) {
        Toastify({ message: "Failed to move question", type: "error" });
        console.error("Error swapping question between folders:", error);
      }
    } else {
      // Handle drag of a folder
      let parentId;

      if (dropTarget && dropTarget.data) {
        parentId = dropTarget.data.guid;
      } else {
        parentId = rootFolderGuid;
      }
      const folderName = dragSource.text;
      const nodeToBeUpdated = {
        guid: dragSource.data.guid,
        parentId: parentId,
        sequence: dropTarget ? dropTarget.data.sequence : 0,
        title: folderName,
      };

      try {
        const isDuplicate = newTree.some(
          (node) =>
            node.text === nodeToBeUpdated.title &&
            node.data.guid !== nodeToBeUpdated.guid
        );
        if (isDuplicate) {
          Toastify({
            message: "Duplicate folder. Please choose a different name.",
            type: "error",
          });
          return;
        }
        const childFolders = await getChildQuestionFolders(parentId);
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
    }
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

  const handleDeleteFolder = (folderTitle) => {
    console.log("Delete folder:", folderTitle);
  };

  return (
    <div
      className={`treeview ${isDragging ? "grabbing" : ""}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{ marginBottom: "-47px" }}
    >
      <Tree
        tree={treeData}
        rootId={0}
        render={(node, { isOpen, onToggle }) => (
          <div className="tree-node">
            {node.droppable && (
              <span
                onClick={() => {
                  if (
                    !isOpen &&
                    (!node.children || node.children.length === 0)
                  ) {
                    fetchChildFolders(node);
                  }
                  onToggle();
                }}
                className="custom-caret"
              >
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
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        canDrag={() => true}
        canDrop={() => true}
      />
    </div>
  );
}

export default TreeViewQuestionFolder;
