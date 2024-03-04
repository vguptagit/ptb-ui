import React, { useState, useEffect } from "react";
import { Tree } from "@minoru/react-dnd-treeview";
import "./TreeView.css";

const TreeView = ({ data, renderQuestions }) => {
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    setTreeData(renderTreeNodes(data));
  }, [data, renderQuestions]);

  const renderTreeNodes = (nodes) => {
    return nodes.map((node, index) => ({
      id: node.itemId || "",
      content: renderQuestions(node, index),
      children:
        node.children && node.children.length > 0
          ? renderTreeNodes(node.children)
          : undefined,
    }));
  };

  const handleDrop = (draggedNode, dropTargetNode) => {
    console.log(draggedNode);
    const updatedTreeData = [...treeData];
    const draggedNodeIndex = updatedTreeData.findIndex(
      (node) => node.id === draggedNode.id
    );
    const draggedNodeItem = updatedTreeData.splice(draggedNodeIndex, 1)[0];
    const dropTargetNodeIndex = updatedTreeData.findIndex(
      (node) => node.id === dropTargetNode.id
    );
    updatedTreeData.splice(dropTargetNodeIndex, 0, draggedNodeItem);
    setTreeData(updatedTreeData);
  };

  return (
    <div className="tree-container">
      {treeData && (
        <Tree
          tree={treeData}
          render={(node) => <div>{node.content}</div>}
          onDrop={handleDrop}
          canDrop={() => true}
        />
      )}
    </div>
  );
};

export default TreeView;
