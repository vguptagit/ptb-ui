import { useEffect, useState } from 'react';

const TreeNode = ({ node, onSelectItem, selectedItems, searchTerm }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isSelected, setIsSelected] = useState(selectedItems.includes(node.id));
  const hasChildNodes = node.nodes && node.nodes.length > 0;

  // The useEffect hook is used here to update the 'isSelected' state whenever there's a change in 'selectedItems' or 'node.id'.
  useEffect(() => {
    setIsSelected(selectedItems.includes(node.id));
  }, [selectedItems, node.id]);

  /**
   * Handles a click event on a node in the component.
   */
  const handleNodeClick = () => {
    // Toggle the value of `isOpen` by setting it to the opposite of its current value.
    setIsOpen(!isOpen);
  };

  /**
   * Handles a click event on a node in the component and selects or deselects the node based on its current state.
   */
  const handleSelectNode = () => {
    if (!hasChildNodes) {
      onSelectItem(node);
      setIsSelected(!isSelected);
    }
  };

  // Function to check if the node is a header discipline node
  const isHeaderDisciplineNode = () => {
    return node.droppable && node.nodes && node.nodes.length > 0;
  };

  // Function to check if the node should be rendered based on search term
  const shouldRenderNode = () => {
    return !isHeaderDisciplineNode() || searchTerm === '';
  };

  return (
    <div>
      {/* Render the node only if it is not a header discipline node during search */}
      {shouldRenderNode() && (
        <div
          className={`tree-node ${hasChildNodes ? '' : isSelected ? 'selected' : ''}`}
          onClick={hasChildNodes ? handleNodeClick : handleSelectNode}
        >
          {hasChildNodes && (
            <div className="tree-node-header">
              {isOpen ? <i className="fa fa-caret-down"></i> : <i className="fa fa-caret-right"></i>}
            </div>
          )}
          <span>{node.text}</span>
        </div>
      )}

      <div>
        {isOpen && hasChildNodes && (
          <div className="nested-nodes">
            {node.nodes.map(childNode => (
              <div key={childNode.id}>
                <TreeNode
                  node={childNode}
                  onSelectItem={onSelectItem}
                  selectedItems={selectedItems}
                  searchTerm={searchTerm}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TreeNode;
