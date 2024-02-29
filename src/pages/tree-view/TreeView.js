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

const DraggableNode = ({ node, onToggle, onDataUpdate, onLensClick, clickedNodeIds  }) => {
  const [, drag] = useDrag({
    type: "TREE_NODE",
    item: { node },
  });
  const isClicked = clickedNodeIds.includes(node.id);
  const handleLensClick = (e) => {
    e.stopPropagation(); 
    onLensClick(node);
  };

  return (
    <div
      ref={drag}
      className={`tree-node ${isClicked ? 'clicked' : ''}`}
      onClick={() => {
        onToggle();
        onDataUpdate && onDataUpdate(node);
      }}
    >
      {node.droppable && (
        <span>
          {node.isOpen ? (
            <i className="bi bi-caret-down-fill"></i>
          ) : (
            <i className="bi bi-caret-right-fill"></i>
          )}
        </span>
      )}
      {node.type !== "book" &&(node.text)}
      {node.type === "book" && (<span onClick={handleLensClick}>
        {node.text}
      </span>)}
    </div>
  );
};

const SimpleNode = ({ node, onToggle, onCombinedToggle  }) => {
  return (
    <div className="tree-node">
      {node.droppable && (
        <span onClick={() => onCombinedToggle(node)}>
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

function TreeView({ onDataUpdate, droppedNode, disciplines, searchTerm  }) {
  const [treeData, setTreeData] = useState([]);
  const [searchableTreeData, setSearchableTreeData] = useState([]);
  const [searchableTreeDataFilter, setSearchableTreeDataFilter] = useState([]);
  const [addedNodes, setAddedNodes] = useState(new Set());
  const [clickedNodeIds, setClickedNodeIds] = useState([]);
  const [isSearchTermPresent, setIsSearchTermPresent] = useState(false);
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
    if(searchTerm != '')
   { 
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
      Toastify({ message: "No Selected Nodes to search", type: "warn" });
     }
    else if (finalFinalFilteredData.length === 0) {
      Toastify({ message: "No results found for the search term.", type: "info" });
    }
    setSearchableTreeDataFilter(finalFinalFilteredData);
   }
  else{
    setIsSearchTermPresent(false);
  }
    console.log("new searchable tree data is as  follows",searchableTreeData);
  }, [searchTerm]);


  const handleSimpleToggle = (node) => {
    const updatedSearchableTreeData = searchableTreeData.map((item) => {
      if (item.id === node.id && item.droppable) {
        return { ...item, isOpen: !item.isOpen };
      }
      return item;
    });

    setSearchableTreeData(updatedSearchableTreeData);
  };
  const handleCombinedToggle = (node, onToggle) => {
    onToggle(); 
    handleSimpleToggle(node);
  };

  const handleNodeClick = (clickedNode) => {
    const updatedTreeData = treeData.map((node) => {
      if (node.id === clickedNode.id && node.droppable) {
        return { ...node, isOpen: !node.isOpen };
      }
      return node;
    });

    setTreeData(updatedTreeData);

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
    getAllBooks(discipline).then(
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

  return (
    <>
    {
      !isSearchTermPresent &&(
      <div className="treeview">
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
     
     {
      isSearchTermPresent &&(
        <>
      <div className="treeview">
        <Tree
          tree={searchableTreeDataFilter}
          rootId={0}
          render={(node, { onToggle }) => (
            <SimpleNode
              node={node}
              onCombinedToggle={() => handleCombinedToggle(node, onToggle)}
            />
          )}
        />
      </div>
      </>
      )}
    </>
  );
}

export default TreeView;
