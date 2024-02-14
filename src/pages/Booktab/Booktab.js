import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import './Booktab.css';
import Loader from "../../components/common/loader/Loader";
import { getDisciplineBooks } from "../../services/book.service";
// import { DndProvider } from "react-dnd";
import { Tree, MultiBackend, getBackendOptions } from "@minoru/react-dnd-treeview";
import {  DndProvider, useDrag, useDrop } from 'react-dnd';

const LeftContent = () => {
  return (
    <div className="left-content">
      <ul>
        <li><FormattedMessage id="booktab.steps.2" /></li>
        <li><FormattedMessage id="booktab.steps.3" /></li>
        <li><FormattedMessage id="booktab.steps.4" /></li>
      </ul>
    </div>
  );
};

const TreeNode = ({ node, onDrop }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'NODE', 
    item: { id: node.guid },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'NODE', 
    drop: () => onDrop(node),
  });

  return (
    <div ref={drop} className={`tree-node ${isDragging ? 'dragging' : ''}`}>
      <div ref={drag}>{node.text}</div>
    </div>
  );
};

const Booktab = ({ onDropNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Choose Your Books or Topics";
  }, []);

  useEffect(() => {
    const disciplines = new URLSearchParams(location.search).get("disciplines");
    if (disciplines) {
      const selectedDisciplines = disciplines.split(",");
      setSelectedItems(selectedDisciplines);
    }
  }, [location.search]);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
        for (const setofItem of selectedItems) {
            try {
                const data = await getDisciplineBooks(setofItem);
                const formattedData = data.map(item => ({
                    id: item.guid,
                    text: `${item.discipline} - ${item.title}`,
                    droppable: true,
                    nodes: item.nodes && item.nodes.map(node => ({
                        id: node.guid,
                        text: node.title,
                        droppable: true,
                        nodes: node.nodes && node.nodes.map(innerNode => ({
                            id: innerNode.guid,
                            text: innerNode.title,
                            droppable: false,
                        })),
                    })),
                }));
                setTreeData(prevTreeData => [...prevTreeData, ...formattedData]);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching discipline books:', error);
                setLoading(false);
            }
        }
    };
    fetchData();
}, [selectedItems]);

  
  const handleNext = () => {
    navigate("/home");
  };

  const handleBack = () => {
    navigate("/discipline");
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const inputWidth = Math.max(200, e.target.scrollWidth);
    document.querySelector('.search-input').style.minWidth = inputWidth + 'px';
  };

  const handleSelectItem = (node) => {
    if (!node.droppable || node.droppable.length === 0) {
      setSelectedItems((prevSelectedItems) => {
        if (prevSelectedItems.includes(node.id)) {
          const newSelectedItems = prevSelectedItems.filter((selectedItem) => selectedItem !== node.id);
          console.log("Deselected:", node.id);
          console.log("Selected items:", newSelectedItems);
          return newSelectedItems;
        } else {
          const newSelectedItems = [...prevSelectedItems, node.id];
          console.log("Selected:", node.id);
          console.log("Selected items:", newSelectedItems);
          return newSelectedItems;
        }
      });
    }
  };
  const handleNodeClick = (node) => {
    if (!node.nodes || node.nodes.length === 0) {
      alert(node.title);
    }
  };

  const renderNode = (node) => (
    <div key={node.id}>
      <div 
        className={node.droppable ? 'droppable-node' : 'regular-node'}
        onClick={() => handleNodeClick(node)}
      >
        {node.text}
      </div>
      {node.nodes && node.nodes.map((childNode) => renderNode(childNode))}
    </div>
  );
  return (
    <div className="booktab-container">
    {loading ? (
      <Loader show="true" />
    ) : (
      <>
        <div className="top-container">
          <h4><FormattedMessage id="booktab.steps.1" /></h4>
          <button className="booktab btn btn-secondary " onClick={handleBack}>Back</button>
          <button className="booktab btn btn-primary" onClick={handleNext} >Next</button>
        </div>
        <div className="booktab d-flex justify-content-between">
          <LeftContent />
          <div className="booktab search-container">
            <div className="booktab result-list mt-3">
              <DndProvider backend={MultiBackend} options={getBackendOptions()}>
                <Tree tree={treeData} render={renderNode} />
              </DndProvider>
            </div>
          </div>
        </div>
      </>
    )}
  </div>
  );
};

export default Booktab;
