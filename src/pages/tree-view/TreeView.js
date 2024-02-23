import React, { useState, useEffect } from "react";
import { useDrag } from "react-dnd";
import { Tree } from "@minoru/react-dnd-treeview";
import "./TreeView.css";
import {
  getAllBooks,
  getAllBookNodes,
  getAllBookNodeSubNodes,
} from "../../services/book.service";

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
      {node.text}
      {node.type === "book" && (
        <i className="fas fa-search lens-icon" onClick={handleLensClick}></i>
      )}
    </div>
  );
};

function TreeView({ onDataUpdate, droppedNode, disciplines }) {
  const [treeData, setTreeData] = useState([]);
  const [addedNodes, setAddedNodes] = useState(new Set());
  const [clickedNodeIds, setClickedNodeIds] = useState([]);

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
    setTreeData(convertedList);
  }, []);

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
        return prevClickedNodeIds.filter(id => id !== node.id); 
      } else {
        return [...prevClickedNodeIds, node.id]; 
      }
    });
    getBookNodesFlat(node, { flat: 1 });
    // ... additional logic for handleLensClick
    console.log("Lens clicked for node:", node.text);
    // if (node.type === "book") {
    //   getBookNodesFlat(node, { flat: 1 });
    // }
    
  };


  const getBookNodesFlat = (node, queryParams = {}) => {
    let nodeList = [];
    getAllBookNodes(node.bookGuid, queryParams).then(
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
        console.log("nodeListFlat is as follows",nodeList);
        //setTreeData([...treeData, ...nodeList]);
        //setAddedNodes(new Set(addedNodes).add(node.bookGuid));
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
    </>
  );
}

export default TreeView;
