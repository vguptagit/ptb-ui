const SimpleNode = ({ node, isOpen, onToggle }) => {
  const handleCaretClick = e => {
    e.stopPropagation();
    onToggle();
  };

  return (
    <div className="tree-nodeqb">
      {node.droppable && (
        <span onClick={handleCaretClick}>
          {isOpen ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-right-fill"></i>}
        </span>
      )}
      {node.text}
    </div>
  );
};

export default SimpleNode;
