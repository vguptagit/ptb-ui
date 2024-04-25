import { useState, useEffect, useRef } from 'react';
import { useDrag } from 'react-dnd';
import { Tree } from '@minoru/react-dnd-treeview';
import { FormattedMessage } from 'react-intl';
import DraggableNode from './DraggableNode';
import SimpleNode from './SimpleNode';
import Toastify from '../../components/common/Toastify';
import { getAllQuestions } from '../../services/userfolder.service';
import QtiService from '../../utils/qti-converter';
import MultipleChoice from '../../components/questions/MultipleChoice';
import MultipleResponse from '../../components/questions/MultipleResponse';
import TrueFalse from '../../components/questions/TrueFalse';
import Matching from '../../components/questions/Matching';
import FillInBlanks from '../../components/questions/FillInBlanks';
import Essay from '../../components/questions/Essay';
import CustomQuestionsService from '../../services/CustomQuestionsService';
import { getAllBooks, getAllBookNodes, getAllBookNodeSubNodes } from '../../services/book.service';
import Loader from '../../components/common/loader/Loader';
import './TreeView.css';
import { Button } from 'react-bootstrap';
import { useAppContext } from '../../context/AppContext';

function TreeView({ onDataUpdate, droppedNode, disciplines, searchTerm }) {
  const [treeData, setTreeData] = useState([]);
  const [searchableTreeData, setSearchableTreeData] = useState([]);
  const [searchableTreeDataFilter, setSearchableTreeDataFilter] = useState([]);
  const [addedNodes, setAddedNodes] = useState(new Set());
  const [clickedNodeIds, setClickedNodeIds] = useState([]);
  const [isSearchTermPresent, setIsSearchTermPresent] = useState(false);
  const [finalQuestions, setFinalquestions] = useState([]);

  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const treeRef = useRef(null);
  const { handleQuestionAdd } = useAppContext();

  const handleDrop = newTree => {
    setTreeData(newTree);
    onDataUpdate(newTree);
  };
  const handleAdd = node => {
    handleQuestionAdd(node);
    console.log(node);
  };

  useEffect(() => {
    loadInitialTreeNodes();
  }, [disciplines]);

  useEffect(() => {
    if (searchTerm != '') {
      const hasNodeTypes = searchableTreeData.some(node => node.type === 'node');

      if (!hasNodeTypes) {
        Toastify({ message: 'User must select the books', type: 'warning' });
        return;
      }

      setIsSearchTermPresent(true);
      const filteredData = searchableTreeData.filter(
        node => node.type !== 'node' || node.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const parentIDsOfMatchedNodes = new Set(
        filteredData.filter(node => node.type === 'node').map(node => node.parent)
      );
      const finalFilteredData = filteredData.filter(
        node => node.type !== 'book' || (node.type === 'book' && parentIDsOfMatchedNodes.has(node.id))
      );
      const parentIDsOfMatchedBooks = new Set(
        finalFilteredData.filter(node => node.type === 'book').map(node => node.parent)
      );
      let finalFinalFilteredData = finalFilteredData.filter(
        node => node.type !== 'discipline' || (node.type === 'discipline' && parentIDsOfMatchedBooks.has(node.id))
      );

      if (finalFinalFilteredData.length === 0) {
        Toastify({ message: 'No results found for the search item', type: 'info' });
      }

      finalFinalFilteredData = finalFinalFilteredData.map(node => ({ ...node }));
      setSearchableTreeDataFilter(finalFinalFilteredData);
    } else {
      setIsSearchTermPresent(false);
    }
  }, [searchTerm, searchableTreeData]);

  const loadInitialTreeNodes = async () => {
    let booksNodes = [];
    let disciplinesNodes = disciplines.map((discipline, i) => ({
      id: i + 1,
      parent: 0,
      droppable: true,
      text: discipline,
      type: 'discipline',
    }));
    for (let i = 0; i < disciplinesNodes.length; i++) {
      const totalNodesLength = disciplinesNodes.length + booksNodes.length;
      const books = await getBooksList(disciplinesNodes[i].text, disciplinesNodes[i].id, totalNodesLength);
      booksNodes = booksNodes.concat(books);
    }
    const finalNodes = [...disciplinesNodes, ...booksNodes];
    setSearchableTreeData(finalNodes);
    setTreeData(finalNodes);
    setAddedNodes(new Set());
    treeRef?.current?.closeAll();
  };

  const handleNodeClick = clickedNode => {
    if (clickedNode.droppable) {
      if (clickedNode.type === 'book' && !addedNodes.has(clickedNode.bookGuid)) getBookNodes(clickedNode);
      else if (clickedNode.type === 'node' && !addedNodes.has(clickedNode.bookGuid + clickedNode.nodeGuid))
        getBookNodeSubNodes(clickedNode);
    }
  };

  const getBooksList = async (discipline, disciplineId, totalNodesLength) => {
    try {
      const books = await getAllBooks(discipline, true);

      return books.map((book, index) => ({
        id: totalNodesLength + index + 1,
        parent: disciplineId,
        droppable: true,
        bookGuid: book.guid,
        text: `${book.title}_${discipline}`,
        type: 'book',
      }));
    } catch (error) {
      Toastify(error);
    }

    return [];
  };

  const handleLensClick = node => {
    setClickedNodeIds(prevClickedNodeIds => {
      const isAlreadyClicked = prevClickedNodeIds.includes(node.id);
      if (isAlreadyClicked) {
        setSearchableTreeData(prevData => {
          return prevData.filter(item => {
            return !(item.type === 'node' && item.bookGuid === node.bookGuid);
          });
        });
        return prevClickedNodeIds.filter(id => id !== node.id);
      } else {
        getBookNodesFlat(node, { flat: 1 });
        return [...prevClickedNodeIds, node.id];
      }
    });
  };

  const getBookNodesFlat = (node, queryParams = {}) => {
    let nodeList = [];
    getAllBookNodes(node.bookGuid, queryParams).then(
      nodes => {
        for (let i = 0; i < nodes.length; i++) {
          const newItemNode = {
            id: `${node.bookGuid}-${i}`,
            parent: node.id,
            droppable: false,
            bookGuid: node.bookGuid,
            nodeGuid: nodes[i].guid,
            text: `${nodes[i].title}_${node.text}`,
            type: 'node',
          };
          nodeList.push(newItemNode);
        }
        setSearchableTreeData([...searchableTreeData, ...nodeList]);
      },
      error => {
        console.log(error);
      }
    );
  };

  const getBookNodes = node => {
    let nodeList = [];
    getAllBookNodes(node.bookGuid).then(
      nodes => {
        for (let i = 0; i < nodes.length; i++) {
          const newItemNode = {
            id: treeData.length + nodeList.length + 1,
            parent: node.id,
            droppable: true,
            bookGuid: node.bookGuid,
            nodeGuid: nodes[i].guid,
            text: `${nodes[i].title}_${node.text}`,
            type: 'node',
          };
          nodeList.push(newItemNode);
        }
        setTreeData([...treeData, ...nodeList]);
        setAddedNodes(new Set(addedNodes).add(node.bookGuid));
      },
      error => {
        console.log(error);
      }
    );
  };

  const getBookNodeSubNodes = node => {
    let nodeList = [];

    setLoadingQuestions(true);
    getAllQuestions(node.bookGuid, node.nodeGuid).then(
      questions => {
        if (Array.isArray(questions)) {
          setLoadingQuestions(false);
          const questionsWithQtiModels = questions.map(question => {
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
            id: `${node.bookGuid}-${node.nodeGuid}-question-${index}`,
            parent: node.id,
            droppable: false,
            questionGuid: question.guid,
            text: <DraggableQuestion key={question.guid} question={question} index={index} />,
            type: 'question',
          }));

          nodeList.push(...questionNodes);

          setTreeData([...treeData, ...nodeList]);

          setFinalquestions(questionsWithQtiModels);
        } else {
          setLoadingQuestions(false);
          console.error('Expected an array of questions but received:', questions);
          Toastify({ message: 'An error occurred while fetching questions. Please try again.', type: 'error' });
        }
      },
      error => {
        setLoadingQuestions(false);
        if (error.response) {
          if (error.response.status === 404) {
            Toastify({ message: <FormattedMessage id="questionerrormsg404" />, type: 'error' });
          } else if (error.response.status === 500) {
            Toastify({ message: <FormattedMessage id="questionerrormsg500" />, type: 'error' });
          } else {
            Toastify({ message: <FormattedMessage id="errormsg" />, type: 'error' });
          }
        }
        console.log(error);
      }
    );

    getAllBookNodeSubNodes(node.bookGuid, node.nodeGuid).then(
      nodes => {
        for (let i = 0; i < nodes.length; i++) {
          const newItemNode = {
            id: treeData.length + nodeList.length + 1,
            parent: node.id,
            droppable: true,
            bookGuid: node.bookGuid,
            nodeGuid: nodes[i].guid,
            text: `${nodes[i].title}_${node.text}`,
            type: 'node',
          };
          nodeList.push(newItemNode);
        }
        setTreeData([...treeData, ...nodeList]);
        setAddedNodes(new Set(addedNodes).add(node.bookGuid + node.nodeGuid));
      },
      error => {
        console.log(error);
      }
    );
  };

  useEffect(() => {
    console.log('Dropped Node in TreeView:-->', droppedNode);
  }, [droppedNode]);

  const DraggableQuestion = ({ question, index }) => {
    const [, drag] = useDrag({
      type: 'SAVED_QUESTION',
      item: { question },
    });

    const key = question.guid;
    const { qtiModel } = question;

    switch (question.metadata.quizType) {
      case CustomQuestionsService.MultipleChoice:
        return (
          <div className="questionblock" key={key} ref={drag}>
            <button className="questionaddforquestionbank" onClick={() => handleAdd(question)}>
              <i className="bi bi-plus-lg darker-icon"></i>
            </button>
            <MultipleChoice questionNode={question} questionNodeIndex={index} qtiModel={qtiModel} printView={3} />
          </div>
        );
      case CustomQuestionsService.MultipleResponse:
        return (
          <div className="questionblock" key={key} ref={drag}>
            <button className="questionaddforquestionbank" onClick={() => handleAdd(question)}>
              <i className="bi bi-plus-lg darker-icon"></i>
            </button>
            <MultipleResponse questionNode={question} questionNodeIndex={index} qtiModel={qtiModel} printView={3} />
          </div>
        );
      case CustomQuestionsService.TrueFalse:
        return (
          <div className="questionblock" key={key} ref={drag}>
            <button className="questionaddforquestionbank" onClick={() => handleAdd(question)}>
              <i className="bi bi-plus-lg darker-icon"></i>
            </button>
            <TrueFalse questionNode={question} questionNodeIndex={index} qtiModel={qtiModel} printView={3} />
          </div>
        );
      case CustomQuestionsService.Matching:
        return (
          <div className="questionblock" key={key} ref={drag}>
            <button className="questionaddforquestionbank" onClick={() => handleAdd(question)}>
              <i className="bi bi-plus-lg darker-icon"></i>
            </button>
            <Matching questionNode={question} questionNodeIndex={index} qtiModel={qtiModel} printView={3} />
          </div>
        );
      case CustomQuestionsService.FillInBlanks:
        return (
          <div className="questionblock" key={key} ref={drag}>
            <button className="questionaddforquestionbank" onClick={() => handleAdd(question)}>
              <i className="bi bi-plus-lg darker-icon"></i>
            </button>
            <FillInBlanks questionNode={question} questionNodeIndex={index} qtiModel={qtiModel} printView={3} />
          </div>
        );
      case CustomQuestionsService.Essay:
        return (
          <div className="questionblock" key={key} ref={drag}>
            <button className="questionaddforquestionbank" onClick={() => handleAdd(question)}>
              <i className="bi bi-plus-lg darker-icon"></i>
            </button>
            <Essay questionNode={question} questionNodeIndex={index} qtiModel={qtiModel} printView={3} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {!isSearchTermPresent && (
        <div className="treeviewqb">
          <Tree
            ref={treeRef}
            tree={treeData}
            rootId={0}
            render={(node, { isOpen, onToggle }) => (
              <DraggableNode
                node={node}
                isOpen={isOpen}
                onToggle={onToggle}
                onDataUpdate={handleNodeClick}
                onLensClick={handleLensClick}
                clickedNodeIds={clickedNodeIds}
                isClicked={clickedNodeIds.includes(node.id)}
              />
            )}
            dragPreviewRender={monitorProps => <div>{monitorProps.item.node.text}</div>}
            onDrop={handleDrop}
            initialOpen={false}
          />
        </div>
      )}
      {loadingQuestions ? (
        <Loader show={true} />
      ) : (
        isSearchTermPresent && (
          <>
            <div className="treeviewqb">
              <Tree
                tree={searchableTreeDataFilter}
                rootId={0}
                render={(node, { isOpen, onToggle }) => <SimpleNode node={node} isOpen={isOpen} onToggle={onToggle} />}
                initialOpen={true}
              />
            </div>
          </>
        )
      )}
    </>
  );
}

export default TreeView;
