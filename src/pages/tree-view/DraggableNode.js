import { useDrag } from 'react-dnd';

const DraggableNode = ({ node, isOpen, onToggle, onDataUpdate, onLensClick, clickedNodeIds }) => {
  const [, drag] = useDrag({
    type: 'TREE_NODE',
    item: { node },
  });

  const isClicked = clickedNodeIds.includes(node.id);

  const handleLensClick = e => {
    e.stopPropagation();
    onLensClick(node);
  };

  const handleCaretClick = e => {
    e.stopPropagation();
    onToggle();
    onDataUpdate && onDataUpdate(node);
  };

  return (
    <div key={node.id} ref={drag} className={`tree-nodeqb ${isClicked ? 'clicked' : ''}`}>
      {node.droppable && (
        <span onClick={handleCaretClick}>
          {isOpen ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-right-fill"></i>}
        </span>
      )}
      {node.type !== 'book' && node.text}
      {node.type === 'book' && <span onClick={handleLensClick}>{node.text}</span>}
    </div>
  );
};

export default DraggableNode;
