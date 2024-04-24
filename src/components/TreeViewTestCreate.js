import React, { useState, useEffect } from 'react';
import { Tree } from '@minoru/react-dnd-treeview';
import './TreeViewTestCreate.css';

const TreeViewTestCreate = ({ data, renderQuestions }) => {
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    setTreeData(renderTreeNodes(data));
  }, [data, renderQuestions]);

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
   * @param {Object} dragSourceId - The id of the node being dragged.
   * @param {Object} dropTargetId - The id of the node being dropped onto.
   */
  const handleDrop = (nodes, { dragSourceId, dropTargetId }) => {
    const updatedTreeData = [...treeData];

    // Find the indices of the drag source and drop target
    const dragSourceIndex = updatedTreeData.findIndex(node => node.id === dragSourceId);
    const dropTargetIndex = updatedTreeData.findIndex(node => node.id === dropTargetId);

    // Get the drag source item
    const dragSourceItem = { ...updatedTreeData[dragSourceIndex] };

    // Remove the drag source item from the array
    updatedTreeData.splice(dragSourceIndex, 1);

    // Insert the drag source item at the drop target index
    updatedTreeData.splice(dropTargetIndex, 0, dragSourceItem);

    // Update the content and tree data
    updateContent(updatedTreeData);
    setTreeData(updatedTreeData);
  };

  const updateContent = updatedTreeData => {
    updatedTreeData.forEach((node, index) => {
      if (node.content.props.questionNodeIndex !== undefined) {
        const updatedContentProps = { ...node.content.props, questionNodeIndex: index };
        const updatedContent = React.cloneElement(node.content, updatedContentProps);
        node.content = updatedContent;
      }
    });
  };
  console.log('rprint', treeData);
  return (
    <div className="tree-container">
      {treeData && (
        <Tree
          tree={treeData}
          rootId={0}
          render={node => <div>{node.content}</div>}
          onDrop={handleDrop}
          canDrop={() => true}
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
