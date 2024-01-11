import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { Tree, MultiBackend, getBackendOptions } from "@minoru/react-dnd-treeview";
import SampleData from "./sample_data.json";
import "./TreeView.css";

function TreeView() {
  const [treeData] = useState(SampleData);

  return (
    <div className="treeview">
      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        <Tree
          tree={treeData}
          rootId={0}
          render={(node, { isOpen, onToggle }) => (
            <div className={`tree-node ${node.text === 'Add Questions Banks' ? 'custom-style' : ''}`}>
              {node.droppable && (
                <span onClick={onToggle}>{isOpen ? "+" : "+"}</span>
              )}
              {node.text}
            </div>
          )}
          dragPreviewRender={() => null}
          onDrop={() => {}}
          disableDragAndDrop
        />
      </DndProvider>
    </div>
  );
}

export default TreeView;
