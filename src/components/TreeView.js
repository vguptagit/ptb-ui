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

  return (
    <div className="tree-container">
      {treeData && (
        <Tree
          tree={treeData}
          render={(node) => <div>{node.content}</div>}
        />
      )}
    </div>
  );
};

export default TreeView;
