import React, { useState, useEffect } from "react";
import { Tree } from "@minoru/react-dnd-treeview";
import "./TreeView.css";
import { getAllBooks } from "../../services/book.service";
import { getUserQuestionFolders } from "../../services/userfolder.service";

const DraggableNode = ({ node, onToggle, onDataUpdate, isOpen, depth }) => {

  return (
    <div
      className="tree-node"
      onClick={() => {
        onToggle();
        onDataUpdate && onDataUpdate(node);
      }}
      style={{ marginInlineStart: depth * 10 }}
    >
      {node.droppable && (
        <span>
          {isOpen ? (
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

function TreeView({ onDataUpdate, droppedNode, disciplines, folders, testFolders }) {
  const [treeData, setTreeData] = useState([]);

  const handleDrop = (newTree) => {
    setTreeData(newTree);
    //onDataUpdate(newTree);
    console.log(newTree);
  };

  useEffect(() => {
    if (disciplines && disciplines.length > 0) {
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
      for (let i = 0; i < convertedList.length; i++) {
        getBooksList(convertedList[i].text, convertedList[i].id, convertedList);
      }
      console.log("convertedList ", convertedList);
      setTreeData(convertedList);
    } else if (folders && folders.length > 0) {
      getUserQuestionFolders()
      .then((folders) => {
        const folderNodes = folders.map((folder, index) => ({
          id: index + 1,
          parent: 0,
          droppable: true,
          text: folder.title,
        }));
        setTreeData(folderNodes);
      })
      .catch((error) => {
        console.error("Error fetching question folders:", error);
      });
    } else if (testFolders && testFolders.length > 0) {
      const folderNodes = testFolders.map((folder, index) => ({
        id: folder?.id !== 0 ? folder?.id : testFolders.length + index + 1,
        parent: folder?.parentId !== null ? parseInt(folder.parentId) : 0,
        droppable: true,
        text: folder.title,
      }));
      setTreeData(folderNodes);
      console.log(folderNodes);
    }
  }, [disciplines, folders, testFolders]);

  useEffect(()=>{
    
  })

  const getBooksList = (discipline, disciplineId, booksList) => {
    getAllBooks(discipline).then(
      (books) => {
        for (let i = 0; i < books.length; i++) {
          const newItem = {
            id: booksList.length + 1,
            parent: disciplineId,
            droppable: true,
            text: `${books[i].title}_${discipline}`,
          };
          booksList.push(newItem);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  };

  useEffect(() => {
    console.log("Dropped Node in TreeView:", droppedNode);
  }, [droppedNode]);

  return (
    <>
      <div className="treeview">
        <Tree
          tree={treeData}
          rootId={0}
          render={(node, { depth, isOpen, onToggle }) => (
            <DraggableNode node={node} depth={depth} isOpen={isOpen} onToggle={onToggle}/>
          )}
          dragPreviewRender={(monitorProps) => (
            <div>{monitorProps.item.node?.text}</div>
          )}
          onDrop={handleDrop}
          sort={false}
        />
      </div>
    </>
  );
}

export default TreeView;
