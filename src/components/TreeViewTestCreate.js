import React, { useState, useEffect, useRef } from 'react';
import { Tree } from '@minoru/react-dnd-treeview';
import './TreeViewTestCreate.css';
import { useAppContext } from '../context/AppContext';

const TreeViewTestCreate = ({ data, renderQuestions }) => {
  const { dispatchEvent } = useAppContext();
  const [treeData, setTreeData] = useState([]);
  const dragSourceIdRef = useRef(null);

  useEffect(() => {
    setTreeData(renderTreeNodes(data));
  }, [data, renderQuestions]);

  /**
   * Renders a tree of nodes as a list of objects with `id`, `content`, `children`, and `parent` properties.
   * @param {Object[]} nodes - The array of nodes to render.
   * @returns {Object[]} The rendered tree nodes.
   */
  const renderTreeNodes = nodes => {
    return nodes.map((node, index) => ({
      id: node.itemId || node.guid || index,
      content: renderQuestions(node, index),
      children: node.children && node.children.length > 0 ? renderTreeNodes(node.children) : undefined,
      parent: 0,
    }));
  };

  /**
   * Handles the drop event when a node is dragged and dropped onto another node in the tree.
   * @param {Object[]} nodes - The array of nodes in the tree.
   * @param {Object} dropTargetId - The id of the node being dropped onto.
   */
  const handleDrop = (nodes, { dropTargetId }) => {
    dispatchEvent('REARRANGE_QUESTIONS', {
      dragSourceId: dragSourceIdRef.current,
      dropTargetId,
    });
  };

  /**
   * Handles the drag start event for a drag source.
   * @param {Object} dragSource - The drag source object that was dragged.
   */
  const handleDragStart = dragSource => {
    dragSourceIdRef.current = dragSource.id;
  };

  return (
    <div className="tree-container">
      {treeData && (
        <Tree
          tree={treeData}
          rootId={0}
          render={node => <div>{node.content}</div>}
          onDrop={handleDrop}
          canDrop={(currentTree, { dropTarget }) => {
            return !!dropTarget;
          }}
          onDragStart={handleDragStart}
          sort={false}
          classes={{
            root: 'treeRoot',
            draggingSource: 'draggingSource',
            dropTarget: 'dropTarget',
          }}
        />
      )}
    </div>
  );
};

export default TreeViewTestCreate;
