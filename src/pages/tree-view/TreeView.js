import React, { useState, useEffect } from "react";
import { useDrag } from "react-dnd";
import { Tree } from "@minoru/react-dnd-treeview";
import "./TreeView.css";
import {
  getAllBooks,
  getAllBookNodes,
  getAllBookNodeSubNodes,
} from "../../services/book.service";
import Toastify from "../../components/common/Toastify";
import { getAllQuestions } from "../../services/userfolder.service";
import QtiService from "../../utils/qtiService";
import MultipleChoice from "../../components/questions/MultipleChoice";
import MultipleResponse from "../../components/questions/MultipleResponse";
import TrueFalse from "../../components/questions/TrueFalse";
import Matching from "../../components/questions/Matching";
import FillInBlanks from "../../components/questions/FillInBlanks";
import Essay from "../../components/questions/Essay";
import CustomQuestionBanksService from "../../services/CustomQuestionBanksService";
import Loader from "../../components/common/loader/Loader";


const DraggableNode = ({ node, onToggle, onDataUpdate, onLensClick, clickedNodeIds }) => {
  const [, drag] = useDrag({
    type: "TREE_NODE",
    item: { node },
  });
  const isClicked = clickedNodeIds.includes(node.id);
  const handleLensClick = (e) => {
    e.stopPropagation();
    onLensClick(node);
  };

  const handleCaretClick = (e) => {
    e.stopPropagation();
    onToggle();
    node.isOpen = !node.isOpen;
    onDataUpdate && onDataUpdate(node);
  };

  return (
    <div
      ref={drag}
      className={`tree-nodeqb ${isClicked ? 'clicked' : ''}`}
    >
      {node.droppable && (
        <span onClick={handleCaretClick}>
          {node.isOpen ? (
            <i className="bi bi-caret-down-fill"></i>
          ) : (
            <i className="bi bi-caret-right-fill"></i>
          )}
        </span>
      )}
      {node.type !== "book" && (node.text)}
      {node.type === "book" && (<span onClick={handleLensClick}>
        {node.text}
      </span>)}
    </div>
  );
};

const SimpleNode = ({ node, onToggle }) => {

  const handleCaretClick = (e) => {
    e.stopPropagation();
    onToggle();
    node.isOpen = !node.isOpen;
  };
  return (
    <div className="tree-nodeqb">
      {node.droppable && (
        <span onClick={handleCaretClick}>
          {node.isOpen ? (
            <i className="bi bi-caret-down-fill"></i>
          ) : (
            <i className="bi bi-caret-right-fill"></i>
          )}
        </span>
      )}
      {node.text}
    </div>
  );
};

function TreeView({ onDataUpdate, droppedNode, disciplines, searchTerm }) {
  const [treeData, setTreeData] = useState([]);
  const [searchableTreeData, setSearchableTreeData] = useState([]);
  const [searchableTreeDataFilter, setSearchableTreeDataFilter] = useState([]);
  const [addedNodes, setAddedNodes] = useState(new Set());
  const [clickedNodeIds, setClickedNodeIds] = useState([]);
  const [isSearchTermPresent, setIsSearchTermPresent] = useState(false);
  const [finalQuestions, setFinalquestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const handleDrop = (newTree) => {
    setTreeData(newTree);
    onDataUpdate(newTree);
  };

  useEffect(() => {
    let convertedList = disciplines.map((discipline, i) => ({
      id: i + 1,
      parent: 0,
      droppable: true,
      text: discipline,
      type: "discipline",
    }));
    for (let i = 0; i < convertedList.length; i++) {
      getBooksList(convertedList[i].text, convertedList[i].id, convertedList);
    }
    console.log("use effect called main")
    setSearchableTreeData(convertedList);
    setTreeData(convertedList);

  }, []);
  useEffect(() => {
    if (searchTerm != '') {
      const hasNodeTypes = searchableTreeData.some(node => node.type === "node");
      setIsSearchTermPresent(true);
      const filteredData = searchableTreeData.filter(node =>
        node.type !== "node" || node.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const parentIDsOfMatchedNodes = new Set(filteredData.filter(node => node.type === "node").map(node => node.parent));
      const finalFilteredData = filteredData.filter(node =>
        node.type !== "book" || (node.type === "book" && parentIDsOfMatchedNodes.has(node.id))
      );
      const parentIDsOfMatchedBooks = new Set(finalFilteredData.filter(node => node.type === "book").map(node => node.parent));
      const finalFinalFilteredData = finalFilteredData.filter(node =>
        node.type !== "discipline" || (node.type === "discipline" && parentIDsOfMatchedBooks.has(node.id))
      );
      if (!hasNodeTypes) {
        Toastify({ message: "User must select the Books", type: "warn" });
      }
      else if (finalFinalFilteredData.length === 0) {
        Toastify({ message: "No Matching chapters found", type: "info" });
      }
      setSearchableTreeDataFilter(finalFinalFilteredData);
    }
    else {
      setIsSearchTermPresent(false);
    }
    console.log("new searchable tree data is as  follows", searchableTreeData);
  }, [searchTerm]);

  const handleNodeClick = (clickedNode) => {
    if (clickedNode.droppable) {
      if (clickedNode.type === "book" && !addedNodes.has(clickedNode.bookGuid))
        getBookNodes(clickedNode);
      else if (
        clickedNode.type === "node" &&
        !addedNodes.has(clickedNode.bookGuid + clickedNode.nodeGuid)
      )
        getBookNodeSubNodes(clickedNode);
    }
  };

  const getBooksList = (discipline, disciplineId, booksList) => {
    getAllBooks(discipline, true).then(
      (books) => {
        for (let i = 0; i < books.length; i++) {
          const newItem = {
            id: booksList.length + 1,
            parent: disciplineId,
            droppable: true,
            bookGuid: books[i].guid,
            text: `${books[i].title}_${discipline}`,
            type: "book",
          };
          booksList.push(newItem);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };



  const handleLensClick = (node) => {
    setClickedNodeIds(prevClickedNodeIds => {
      const isAlreadyClicked = prevClickedNodeIds.includes(node.id);
      if (isAlreadyClicked) {
        setSearchableTreeData((prevData) => {
          return prevData.filter((item) => {
            return !(item.type === "node" && item.bookGuid === node.bookGuid);
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
      (nodes) => {
        for (let i = 0; i < nodes.length; i++) {
          const newItemNode = {
            id: `${node.bookGuid}-${i}`,
            parent: node.id,
            droppable: false,
            bookGuid: node.bookGuid,
            nodeGuid: nodes[i].guid,
            text: `${nodes[i].title}_${node.text}`,
            type: "node",
          };
          nodeList.push(newItemNode);
        }
        setSearchableTreeData([...searchableTreeData, ...nodeList]);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const getBookNodes = (node) => {
    let nodeList = [];
    getAllBookNodes(node.bookGuid).then(
      (nodes) => {
        for (let i = 0; i < nodes.length; i++) {
          const newItemNode = {
            id: treeData.length + nodeList.length + 1,
            parent: node.id,
            droppable: true,
            bookGuid: node.bookGuid,
            nodeGuid: nodes[i].guid,
            text: `${nodes[i].title}_${node.text}`,
            type: "node",
          };
          nodeList.push(newItemNode);
        }
        setTreeData([...treeData, ...nodeList]);
        setAddedNodes(new Set(addedNodes).add(node.bookGuid));
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const getBookNodeSubNodes = (node) => {
    let nodeList = [];

    setLoadingQuestions(true);
    getAllQuestions(node.bookGuid, node.nodeGuid).then(
      (questions) => {
        console.log("questions:", questions);

        if (Array.isArray(questions)) {
          setLoadingQuestions(false); 
          const questionsWithQtiModels = questions.map((question) => {
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
            text: <DraggableQuestion
              key={question.guid}
              question={question}
              index={index}
            />,
            type: "question",
          }));

          nodeList.push(...questionNodes);


          setTreeData([...treeData, ...nodeList]);
    

          setFinalquestions(questionsWithQtiModels);

        } else {
              setLoadingQuestions(false); 
          console.error("Expected an array of questions but received:", questions);
          Toastify({ message: "An error occurred while fetching questions. Please try again.", type: "error" });
        }
      },
      (error) => {
        setLoadingQuestions(false);
        if (error.response) {
          if (error.response.status === 404) {
            Toastify({ message: "Questions not found.", type: "error" });
          } else if (error.response.status === 500) {
            Toastify({ message: "Internal server error. Please try again later.", type: "error" });
          } else {
            Toastify({ message: "An error occurred. Please try again.", type: "error" });
          }
        } else {
          Toastify({ message: "An error occurred. Please try again.", type: "error" });
        }
        console.log(error);
      }
    );


    getAllBookNodeSubNodes(node.bookGuid, node.nodeGuid).then(
      (nodes) => {
        for (let i = 0; i < nodes.length; i++) {
          const newItemNode = {
            id: treeData.length + nodeList.length + 1,
            parent: node.id,
            droppable: true,
            bookGuid: node.bookGuid,
            nodeGuid: nodes[i].guid,
            text: `${nodes[i].title}_${node.text}`,
            type: "node",
          };
          nodeList.push(newItemNode);
        }
        setTreeData([...treeData, ...nodeList]);
        setAddedNodes(new Set(addedNodes).add(node.bookGuid + node.nodeGuid));

      },
      (error) => {
        console.log(error);
      }
    );
  };

  useEffect(() => {
    console.log("Dropped Node in TreeView:-->", droppedNode);
  }, [droppedNode]);

  const DraggableQuestion = ({ question, index }) => {
    const [, drag] = useDrag({
      type: "SAVED_QUESTION",
      item: { question },
    });

    const key = question.guid;
    const { qtiModel } = question;

    switch (question.metadata.quizType) {
      case CustomQuestionBanksService.MultipleChoice:
        return (
          <div key={key} ref={drag}>
            <MultipleChoice
              questionNode={question}
              questionNodeIndex={index}
              qtiModel={qtiModel}
              isPrint={true}
            />
          </div>
        );
      case CustomQuestionBanksService.MultipleResponse:
        return (
          <div key={key} ref={drag}>
            <MultipleResponse
              questionNode={question}
              questionNodeIndex={index}
              qtiModel={qtiModel}
              isPrint={true}
            />
          </div>
        );
      case CustomQuestionBanksService.TrueFalse:
        return (
          <div key={key} ref={drag}>
            <TrueFalse
              questionNode={question}
              questionNodeIndex={index}
              qtiModel={qtiModel}
              isPrint={true}
            />
          </div>
        );
      case CustomQuestionBanksService.Matching:
        return (
          <div key={key} ref={drag}>
            <Matching
              questionNode={question}
              questionNodeIndex={index}
              qtiModel={qtiModel}
              isPrint={true}
            />
          </div>
        );
      case CustomQuestionBanksService.FillInBlanks:
        return (
          <div key={key} ref={drag}>
            <FillInBlanks
              questionNode={question}
              questionNodeIndex={index}
              qtiModel={qtiModel}
              isPrint={true}
            />
          </div>
        );
      case CustomQuestionBanksService.Essay:
        return (
          <div key={key} ref={drag}>
            <Essay
              questionNode={question}
              questionNodeIndex={index}
              qtiModel={qtiModel}
              isPrint={true}
            />
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
            tree={treeData}
            rootId={0}
            render={(node, { onToggle }) => (
              <DraggableNode
                node={node}
                onToggle={onToggle}
                onDataUpdate={handleNodeClick}
                onLensClick={handleLensClick}
                clickedNodeIds={clickedNodeIds}
                isClicked={clickedNodeIds.includes(node.id)}
              />
            )}
            dragPreviewRender={(monitorProps) => (
              <div>{monitorProps.item.node.text}</div>
            )}
            onDrop={handleDrop}
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
                render={(node, { onToggle }) => (
                  <SimpleNode
                    onToggle={onToggle}
                    node={node}
                  />
                )}
              />
            </div>
          </>
        )
      )}
    </>
  );
}

export default TreeView;