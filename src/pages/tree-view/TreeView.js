import React, { useState, useEffect } from "react";
import { useDrag } from "react-dnd";
import { Tree } from "@minoru/react-dnd-treeview";
import "./TreeView.css";
import { getAllBooks, getAllBookNodes, getAllBookNodeQuestions } from "../../services/book.service";

const DraggableNode = ({ node, onToggle, onDataUpdate }) => {
  const [, drag] = useDrag({
    type: "TREE_NODE",
    item: { node },
  });

  return (
    <div ref={drag} className="tree-node" onClick={() => { onToggle(); onDataUpdate && onDataUpdate(node); }}>
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
    </div>
  );
};

function TreeView({ onDataUpdate, droppedNode, disciplines}) {
  const [treeData, setTreeData] = useState([]);


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
      type: "discipline"
    }));
    for (let i = 0; i < convertedList.length; i++)
     {
    getBooksList(convertedList[i].text, convertedList[i].id, convertedList);
    }
    console.log("convertedList ", convertedList)
    setTreeData(convertedList); 
  }, []); 
  

  const handleNodeClick = (node) => {
    console.log("treeData ==>",treeData);
    if (node.droppable) {
      if (node.type === 'book') getBookNodes(node);
      else if (node.type === 'node') getBookNodeQuestions(node);
    }
  };


  const getBooksList =  (discipline, disciplineId , booksList) => {
     
    getAllBooks(discipline).then(
      (books) => { 
        for (let i = 0; i < books.length; i++) {
        const newItem = {
          id: booksList.length + 1,
          parent: disciplineId,
          droppable: true,
          bookGuid : books[i].guid,
          text: `${books[i].title}_${discipline}`,
          type: "book"
        };
        booksList.push(newItem);
      }
    },
    (error) => { 
        console.log(error); 
    
    }  );
    
  }

  const getBookNodes =  (node) => {
     
    getAllBookNodes(node.bookGuid).then(
      (nodes) => { 
        for (let i = 0; i < nodes.length; i++) {
        const newItemNode = {
          id: treeData.length + 1,
          parent: node.id,
          droppable: true,
          bookGuid: node.bookGuid,
          nodeGuid : nodes[i].guid,
          text: `${nodes[i].title}_${node.text}`,
          type: "node"
        };
        setTreeData([...treeData, newItemNode]);
      }
    },
    (error) => { 
        console.log(error); 
    }  );
    
  }

  const getBookNodeQuestions =  (node) => {
     
    getAllBookNodeQuestions(node.bookGuid, node.nodeGuid).then(
      (nodes) => { 
        for (let i = 0; i < nodes.length; i++) {
        const newItemQuestion = {
          id: treeData.length + 1,
          parent: node.id,
          droppable: false,
          bookGuid: node.bookGuid,
          nodeGuid : node.nodeGuid,
          text: `${nodes[i].title}_${node.text}`,
          type: "question"
        };
        setTreeData([...treeData, newItemQuestion]);
      }
    },
    (error) => { 
        console.log(error); 
    }  );
    
  }

  useEffect(() => {
    console.log("Dropped Node in TreeView:-->", droppedNode);
  }, [droppedNode]);

  return (
    <>
    <div className="treeview">
      <Tree
        tree={treeData}
        rootId={0}
        render={(node, { onToggle }) => <DraggableNode node={node} onToggle={onToggle} onDataUpdate={handleNodeClick}/>}
        dragPreviewRender={(monitorProps) => <div>{monitorProps.item.node.text}</div>}
        onDrop={handleDrop}
      />
    </div>
    </>
  );
}

export default TreeView;
