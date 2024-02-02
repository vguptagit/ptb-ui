import React, { useState, useEffect } from "react";
import { useDrag } from "react-dnd";
import { Tree } from "@minoru/react-dnd-treeview";
import "./TreeView.css";
import { getAllBooks } from "../../services/book.service";

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
  
    let convertedList = [];
    for (let i = 0; i < disciplines.length; i++) {
      const newItem = {
        id: i + 1,
        parent: 0,
        droppable: true,
        text: disciplines[i],
      };
      convertedList.push(newItem);
    }
    for (let i = 0; i < convertedList.length; i++)
     {
    getBooksList(convertedList[i].text, convertedList[i].id, convertedList);
    }
    setTreeData(convertedList); 
  }, []); 


  const getBooksList =  (discipline, disciplineId , booksList) => {
    
    getAllBooks(discipline).then(
      (books) => { 
        for (let i = 0; i < books.length; i++) {
        const newItem = {
          id: booksList.length + i,
          parent: disciplineId,
          droppable: true,
          text: `${books[i].title}_${discipline}`,
        };
        booksList.push(newItem);
      }
    },
    (error) => { 
        console.log(error); 
    
    }  );
    
  }

  useEffect(() => {
    console.log("Dropped Node in TreeView:", droppedNode);
  }, [droppedNode]);

  return (
    <>
    <div className="treeview">
      <Tree
        tree={treeData}
        rootId={0}
        render={(node, { onToggle }) => <DraggableNode node={node} onToggle={onToggle} />}
        dragPreviewRender={(monitorProps) => <div>{monitorProps.item.node.text}</div>}
        onDrop={handleDrop}
      />
    </div>
    </>
  );
}

export default TreeView;
