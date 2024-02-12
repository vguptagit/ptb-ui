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

function TreeView({ onDataUpdate, droppedNode, testFolders, onNodeUpdate}) {
  const [treeData, setTreeData] = useState([]);

  const handleDrop = (newTree, {dragSource}) => {
    setTreeData(newTree);
    console.log(newTree);
    const droppedNode = newTree.find(
      ele => ele.id === dragSource.id
    );
    const nodeToUpdate = {
      guid : droppedNode.guid,
      parentId : droppedNode.parent,
      sequence : droppedNode.sequence
    };
    console.log(nodeToUpdate);
    onNodeUpdate(nodeToUpdate);
  };

  useEffect(() => {
    if (testFolders && testFolders.length > 0) {
      const folderNodes = testFolders.map((folder, index) => ({
        id: folder.id,
        parent: folder.parentId !== null ? parseInt(folder.parentId) : 0,
        droppable: true,
        text: folder.title,
        guid: folder.guid,
        sequence: folder.sequence,
      }));
      setTreeData(folderNodes);
      console.log(folderNodes);
    }
  }, [testFolders]);

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
