import React, { useState, useEffect } from "react";
import { Tree } from "@minoru/react-dnd-treeview";
import "./TreeViewTestCreate.css";

const TreeViewTestCreate = ({ data, renderQuestions }) => {
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    setTreeData(renderTreeNodes(data));
  }, [data, renderQuestions]);

  const renderTreeNodes = (nodes) => {
    return nodes.map((node, index) => ({
      id: node.itemId || node.guid || index,
      content: renderQuestions(node, index),
      children:
        node.children && node.children.length > 0
          ? renderTreeNodes(node.children)
          : undefined,
    }));
  };

  const handleDrop = (draggedNode, dropTargetNode) => {
    const updatedTreeData = [...treeData];
    const draggedNodeIndex = updatedTreeData.findIndex(
      (node) => node.id === draggedNode.id
    );
    const draggedNodeItem = updatedTreeData.splice(draggedNodeIndex, 1)[0];
    const dropTargetNodeIndex = updatedTreeData.findIndex(
      (node) => node.id === dropTargetNode.id
    );
    let insertionIndex = dropTargetNodeIndex;
    if (dropTargetNode.children) {
      insertionIndex = 0;
    } else if (draggedNodeIndex > dropTargetNodeIndex) {
      insertionIndex = dropTargetNodeIndex;
    } else {
      insertionIndex = dropTargetNodeIndex + 1;
    }
    updatedTreeData.splice(insertionIndex, 0, draggedNodeItem);
    updatedTreeData.forEach((node, index) => {
      if (node.content.props.questionNodeIndex !== undefined) {
        const updatedContentProps = { ...node.content.props };
        updatedContentProps.questionNodeIndex = index;
        const updatedContent = React.cloneElement(
          node.content,
          updatedContentProps
        );
        node.content = updatedContent;
      }
    });
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
          classes={{
            root: "treeRoot",
            draggingSource: "draggingSource",
            dropTarget: "dropTarget",
          }}
        />
      )}
    </div>
  );
};

export default TreeViewTestCreate;
