import React, { useState, useEffect } from "react";
import { useDrag } from "react-dnd";
import { Tree } from "@minoru/react-dnd-treeview";
import "./TreeView.css";
import {
  getAllBooks,
  getAllBookNodes,
  getAllBookNodeSubNodes,
} from "../../services/book.service";

const DraggableNode = ({ node, onToggle, onDataUpdate }) => {
  const [, drag] = useDrag({
    type: "TREE_NODE",
    item: { node },
  });

  return (
    <div
      ref={drag}
      className="tree-node"
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
    </div>
  );
};

function TreeView({ onDataUpdate, droppedNode, disciplines }) {
  const [treeData, setTreeData] = useState([]);
  const [addedNodes, setAddedNodes] = useState(new Set());

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
      if (clickedNode.type === "book") {
        getBookNodes(clickedNode);
      } else if (clickedNode.type === "node") {
        getBookNodeSubNodes(clickedNode);
      }
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

  const getBookNodes = (node) => {
    if (!addedNodes.has(node.bookGuid)) {
      getAllBookNodes(node.bookGuid).then(
        (nodes) => {
          const filteredNodes = nodes.filter((item) => {
            const key = `${node.bookGuid}_${item.guid}`;
            return !addedNodes.has(key);
          });
          const newNodeList = filteredNodes.map((item) => ({
            id: `${node.bookGuid}_${item.guid}`,
            parent: node.id,
            droppable: true,
            bookGuid: node.bookGuid,
            nodeGuid: item.guid,
            text: `${item.title}_${node.text}`,
            type: "node",
          }));
          setTreeData((prevTreeData) => [...prevTreeData, ...newNodeList]);
          setAddedNodes((prevAddedNodes) => {
            const newSet = new Set(prevAddedNodes);
            filteredNodes.forEach((item) => {
              const key = `${node.bookGuid}_${item.guid}`;
              newSet.add(key);
            });
            return newSet;
          });
        },
        (error) => {
          console.log(error);
        }
      );
    }
  };

  const getBookNodeSubNodes = (node) => {
    const key = `${node.bookGuid}_${node.nodeGuid}`;
    if (!addedNodes.has(key)) {
      getAllBookNodeSubNodes(node.bookGuid, node.nodeGuid).then(
        (nodes) => {
          const filteredNodes = nodes.filter((item) => {
            const subKey = `${node.bookGuid}_${item.guid}`;
            return !addedNodes.has(subKey);
          });
          const newNodeList = filteredNodes.map((item) => ({
            id: `${node.bookGuid}_${item.guid}`,
            parent: node.id,
            droppable: true,
            bookGuid: node.bookGuid,
            nodeGuid: item.guid,
            text: `${item.title}_${node.text}`,
            type: "node",
          }));
          setTreeData((prevTreeData) => [...prevTreeData, ...newNodeList]);
          setAddedNodes((prevAddedNodes) => {
            const newSet = new Set(prevAddedNodes);
            filteredNodes.forEach((item) => {
              const subKey = `${node.bookGuid}_${item.guid}`;
              newSet.add(subKey);
            });
            return newSet;
          });
        },
        (error) => {
          console.log(error);
        }
      );
    }
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
