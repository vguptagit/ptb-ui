import React, { useState, useEffect } from "react";
import { useDrag } from "react-dnd";
import { Tree } from "@minoru/react-dnd-treeview";
import SampleData from "./sample_data.json";
import "./TreeView.css";

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

function TreeView({ onDataUpdate, droppedNode }) {
  const [treeData, setTreeData] = useState(SampleData);

  const handleDrop = (newTree) => {
    setTreeData(newTree);
    onDataUpdate(newTree);
  };

  useEffect(() => {
    console.log("Dropped Node in TreeView:", droppedNode);
  }, [droppedNode]);

  return (
    <div className="treeview">
      <Tree
        tree={treeData}
        rootId={0}
        render={(node, { onToggle }) => <DraggableNode node={node} onToggle={onToggle} />}
        dragPreviewRender={(monitorProps) => <div>{monitorProps.item.node.text}</div>}
        onDrop={handleDrop}
      />
    </div>
  );
}

export default TreeView;
