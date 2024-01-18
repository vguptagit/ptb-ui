import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { Tree, MultiBackend, getBackendOptions } from "@minoru/react-dnd-treeview";
import SampleData from "./sample_data.json";
import "./TreeView.css";

function TreeView() {
  const [treeData] = useState(SampleData);

  const renderNode = (node, { isOpen, onToggle }) => (
    <div className={`tree-node ${node.text === 'Add Questions Banks' ? 'custom-style' : ''}`}>
      {node.droppable && (
        <span onClick={onToggle}>
          {node.text === 'Add Questions Banks' ? (
            "+"
          ) : (
            isOpen ? <i class="bi bi-caret-down-fill"></i> : <i class="bi bi-caret-right-fill"></i>
          )}
        </span>
      )}
      {node.text}
    </div>
  );

  return (
    <div className="treeview">
      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        <Tree
          tree={treeData}
          rootId={0}
          render={renderNode}
          dragPreviewRender={() => null}
          onDrop={() => {}}
        />
      </DndProvider>
    </div>
  );
}

export default TreeView;
