import React, { useState, useEffect } from 'react';
import { Tree } from '@minoru/react-dnd-treeview';
import './TreeViewQuestionFolder.css';
import {
  getChildQuestionFolders,
  getUserQuestions,
  swapQuestionBetweenFolders,
} from '../../../services/userfolder.service';
import Toastify from '../../common/Toastify';
import CustomQuestionsService from '../../../services/CustomQuestionsService';
import MultipleChoice from '../../questions/MultipleChoice';
import MultipleResponse from '../../questions/MultipleResponse';
import TrueFalse from '../../questions/TrueFalse';
import Matching from '../../questions/Matching';
import FillInBlanks from '../../questions/FillInBlanks';
import Essay from '../../questions/Essay';
import QtiService from '../../../utils/qti-converter';
import Loader from '../../common/loader/Loader';
import { useAppContext } from '../../../context/AppContext';
import {formattedMessage ,useIntl} from 'react-intl';

function TreeViewQuestionFolder({
  onFolderSelect,
  onNodeUpdate,
  folders,
  rootFolderGuid,
  selectedFolderGuid,
  setHeight,
}) {
  const { handleQuestionAdd, setSelectedQuestionTest, selectedQuestionTest, setLoading, loading } = useAppContext();
  const [treeData, setTreeData] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [savedQuestions, setSavedQuestions] = useState([]);
  const intl = useIntl();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (rootFolderGuid) {
          const fetchedQuestions = await getUserQuestions(rootFolderGuid);
          const questionsWithQtiModels = fetchedQuestions.map(question => {
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
          setSavedQuestions(questionsWithQtiModels);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [rootFolderGuid]);

  const fetchChildFolders = async parentNode => {
    try {
      if (!parentNode.children && parentNode.data.guid !== selectedFolderGuid) {
        const childFolders = await getChildQuestionFolders(parentNode.data.guid);
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
          id: question.guid,
          parent: parentNode.id,
          droppable: false,
          questionGuid: question.guid,
          text: <DraggableQuestion key={question.guid} question={question} index={index} />,
          data: {
            guid: parentNode.data.guid,
            isQuestion: true,
          },
        }));
        const updatedTreeData = [...treeData];
        const nodeIndex = updatedTreeData.findIndex(n => n.id === parentNode.id);

        const existingChildNodes = updatedTreeData.slice(nodeIndex + 1).filter(node => node.parent === parentNode.id);
        if (existingChildNodes.length === 0) {
          updatedTreeData.splice(nodeIndex + 1, 0, ...childNodes, ...questionNodes);
          setTreeData(updatedTreeData);
        }
      }
    } catch (error) {
      console.error('Error fetching child question folders:', error);
    }
  };

  const DraggableQuestion = ({ question, index }) => {
    const key = question.guid;
    const { qtiModel } = question;

    switch (question.metadata.quizType) {
      case CustomQuestionsService.MultipleChoice:
        return (
          <div key={key}>
            <MultipleChoice questionNode={question} questionNodeIndex={index} qtiModel={qtiModel} printView={3} />
          </div>
        );
      case CustomQuestionsService.MultipleResponse:
        return (
          <div key={key}>
            <MultipleResponse questionNode={question} questionNodeIndex={index} qtiModel={qtiModel} printView={3} />
          </div>
        );
      case CustomQuestionsService.TrueFalse:
        return (
          <div key={key}>
            <TrueFalse questionNode={question} questionNodeIndex={index} qtiModel={qtiModel} printView={3} />
          </div>
        );
      case CustomQuestionsService.Matching:
        return (
          <div key={key}>
            <Matching questionNode={question} questionNodeIndex={index} qtiModel={qtiModel} printView={3} />
          </div>
        );
      case CustomQuestionsService.FillInBlanks:
        return (
          <div key={key}>
            <FillInBlanks questionNode={question} questionNodeIndex={index} qtiModel={qtiModel} printView={3} />
          </div>
        );
      case CustomQuestionsService.Essay:
        return (
          <div key={key}>
            <Essay questionNode={question} questionNodeIndex={index} qtiModel={qtiModel} printView={3} />
          </div>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const updatedTreeData = [
          ...folders.map(folder => ({
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
            text: <DraggableQuestion key={question.guid} question={question} index={index} />,
            data: {
              guid: question.guid,
              qtiModel: question.qtiModel,
              quizType: question.metadata.quizType,
              qtixml: question.qtixml,
              isQuestion: true,
            },
          })),
        ];
        setTreeData(updatedTreeData);
      } catch (error) {
        console.error('Error fetching saved questions:', error);
      }
    };

    fetchData();
  }, [folders, savedQuestions]);

  const handleDrop = async (newTree, { dragSource, dropTarget }) => {
    console.log(dragSource);
    console.log(dropTarget);

    if (dragSource.data.isQuestion) {
      let sourceFolderId;
      let targetFolderId;
      let questionId;
      if (dragSource.parent) {
        if (dropTarget && dropTarget.parent) {
          sourceFolderId = dragSource.data.guid;
          targetFolderId = dropTarget.data.guid;
          questionId = dragSource.questionGuid;
        } else {
          sourceFolderId = dragSource.data.guid;
          targetFolderId = dropTarget ? dropTarget.data.guid : rootFolderGuid;
          questionId = dragSource.questionGuid;
        }
      } else {
        sourceFolderId = rootFolderGuid;
        targetFolderId = dropTarget.data.guid;
        questionId = dragSource.data.guid;
      }

      const destinationFolderId = targetFolderId;

      try {
        await swapQuestionBetweenFolders(sourceFolderId, destinationFolderId, questionId);
        Toastify({ message: 'Question moved successfully', type: 'success' });
        const updatedTreeData = [...newTree];
        const draggedNodeIndex = updatedTreeData.findIndex(node => node.id === questionId);
        const draggedNode = updatedTreeData[draggedNodeIndex];
        const parentIndex = updatedTreeData.findIndex(node => node.id === targetFolderId);
        updatedTreeData.splice(draggedNodeIndex, 1);
        updatedTreeData.splice(parentIndex + 1, 0, draggedNode);
        setTreeData(updatedTreeData);
      } catch (error) {
        Toastify({
          message: Intl.formatMessage({id :'error.Failed to move questionTest'}),
          type: 'error' });
          console.error('Error swapping question between folders:', error);
      }
    } else {
      // Handle drag of a folder
      let parentId;

      if (dropTarget && dropTarget.data) {
        parentId = dropTarget.data.guid;
      } else {
        parentId = rootFolderGuid;
      }
      if (dragSource.data.guid === parentId || dropTarget.parent === dragSource.id) {
        return;
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
          node => node.text === nodeToBeUpdated.title && node.data.guid !== nodeToBeUpdated.guid
        );
        if (isDuplicate) {
          Toastify({
            message: Intl.formatMessage({id :'error.duplicateFolderDifferentName'}),
            type: 'error',
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
        const parentIndex = newTree.findIndex(node => node.id === parentId);
        const isChildNode = parentId.toString().includes('.');
        const updatedParentIndex = isChildNode ? parentIndex - 1 : parentIndex;
        const updatedTreeData = [...newTree];
        updatedTreeData.splice(updatedParentIndex + 1, 0, ...childNodes);
        setTreeData(updatedTreeData);
      } catch (error) {
        console.error('Error fetching child question folders:', error);
      }
      onNodeUpdate(nodeToBeUpdated);
    }
  };

  const handleEditFolder = folderTitle => {
    console.log('Edit folder:', folderTitle);
    if (selectedFolder === folderTitle) {
      setSelectedFolder(null);
      if (onFolderSelect) {
        onFolderSelect('');
      }
    } else {
      if (onFolderSelect) {
        onFolderSelect(folderTitle);
      }
      setSelectedFolder(folderTitle);
    }
    const newHeight = `calc(72vh - 85px)`;
    setHeight(newHeight);
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

  const handleDeleteFolder = folderTitle => {
    console.log('Delete folder:', folderTitle);
  };

  const handleAdd = node => {
    handleQuestionAdd(node.data);
    setSelectedQuestionTest(node.data.guid);
    console.log(node);
  };

  return (
    <div
      className={`treeview ${isDragging ? 'grabbing' : ''}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{ marginBottom: '-47px' }}
    >
      {loading ? (
        <Loader show={true} />
      ) : (
        <Tree
          tree={treeData}
          rootId={0}
          render={(node, { isOpen, onToggle }) => (
            <div className="tree-node">
              {node.droppable && (
                <span
                  onClick={() => {
                    if (!isOpen && (!node.children || node.children.length === 0)) {
                      fetchChildFolders(node);
                    }
                    onToggle();
                  }}
                  className="custom-caret"
                >
                  {isOpen ? <i className="fa fa-caret-down"></i> : <i className="fa fa-caret-right"></i>}
                </span>
              )}
              {node.text}
              {!node.data.isQuestion && (
                <>
                  {selectedFolder === node.text && (
                    <button className="editbutton selected" onClick={() => handleEditFolder(node.text)}>
                      <i className="bi bi-pencil-fill"></i>
                    </button>
                  )}
                  {selectedFolder !== node.text && (
                    <button className="editbutton" onClick={() => handleEditFolder(node.text)}>
                      <i className="bi bi-pencil-fill"></i>
                    </button>
                  )}
                  <button className="deletebutton" onClick={() => handleDeleteFolder(node.text)}>
                    <i className="bi bi-trash"></i>
                  </button>
                </>
              )}
              {node.data.isQuestion && (
                <button
                  className={`questionadd ${selectedQuestionTest === node.data.guid ? 'selected' : ''}`}
                  onClick={() => handleAdd(node)}
                >
                  <i className="bi bi-plus-lg darker-icon"></i>
                </button>
              )}
            </div>
          )}
          dragPreviewRender={monitorProps => <div className="custom-drag-preview">{monitorProps.item.text}</div>}
          onDrop={handleDrop}
          dragPreviewClassName="custom-drag-preview"
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          canDrag={() => true}
          canDrop={() => true}
        />
      )}
    </div>
  );
}

export default TreeViewQuestionFolder;
