import React, { useEffect, useState,useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import './Booktab.css';
import { DndProvider } from "react-dnd";
import { Tree, MultiBackend, getBackendOptions } from "@minoru/react-dnd-treeview";
import BooktabData from "./Booktab_data.json";
import Loader from "../../components/common/loader/Loader";


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

const TreeView = ({ searchTerm, selectedItems, onSelectItem }) => {
    const [treeData, setTreeData] = useState(BooktabData);
  
    
    const filteredTreeData = useMemo(() => {
      if (!searchTerm) {
        return treeData;
      }
  
      const filterNodes = (nodes) => {
        return nodes.filter((node) => {
          const isMatch = node.text.toLowerCase().includes(searchTerm.toLowerCase());
          const hasChildMatches = node.children && filterNodes(node.children).length > 0;
  
          return isMatch || hasChildMatches;
        });
      };
  
      return filterNodes(treeData);
    }, [searchTerm, treeData]);
  
    const renderNode = (node, { isOpen, onToggle }) => (
    <div
      className={`tree-node ${selectedItems.includes(node.id) ? 'selected' : ''}`}
      onClick={() => onSelectItem(node.id)}
    >
      {node.droppable && (
        <span onClick={onToggle}>
          {isOpen ? <i className="bi bi-caret-down-fill"></i> : <i className="bi bi-caret-right-fill"></i>}
        </span>
      )}
      {node.text}
    </div>
  );

  return (
    <div className="treeview">
      <DndProvider backend={MultiBackend} options={getBackendOptions()}>
        <Tree
          tree={filteredTreeData}
          rootId={0}
          render={renderNode}
          dragPreviewRender={() => null}
          onDrop={() => {}}
        />
      </DndProvider>
    </div>
  );
};
  
  
  


const Booktab = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    navigate("/home");
  };
  const handleBack = () => {
    navigate("/discipline");
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const inputWidth = Math.max(200, e.target.scrollWidth);
    document.querySelector('.search-input').style.minWidth = inputWidth + 'px';
  };

  const handleSelectItem = (item) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(item)) {
        const newSelectedItems = prevSelectedItems.filter((selectedItem) => selectedItem !== item);
        console.log("Deselected:", item);
        console.log("Selected items:", newSelectedItems);
        return newSelectedItems;
      } else {
        const newSelectedItems = [...prevSelectedItems, item];
        console.log("Selected:", item);
        console.log("Selected items:", newSelectedItems);
        return newSelectedItems;
      }
    });
  };

  return (
    <div className="booktab-container">
         {loading ? (
        <Loader  show="true"/>
      ) : (
      <>
        <div className="top-container">
          <h4><FormattedMessage id="booktab.steps.1" /></h4>
          <button className="booktab  btn btn-secondary " onClick={handleBack}>Back</button>
          <button className="booktab  btn btn-primary" onClick={handleNext}>Next</button>
        </div>
        <div className="booktab d-flex justify-content-between">
          <LeftContent />
          <div className="booktab search-container">
            <div className="booktab input-group rounded">
              <input
                type="search"
                width="100%"
                className="booktab form-control rounded search-input"
                placeholder="Search Books"
                aria-label="Search"
                aria-describedby="search-addon"
                value={searchTerm}
                onChange={handleSearch}
              />
              <div className="booktab input-group-append">
                <span className="booktab input-group-text border-0" id="search-addon">
                  <i className="fas fa-search"></i>
                </span>
              </div>
            </div>
            <div className="booktab result-list mt-3">
              
              <TreeView 
            
                selectedItems={selectedItems}
                onSelectItem={handleSelectItem}
                searchTerm={searchTerm}
              />
            </div>
          </div>
        </div>
      </>
      )}
    </div>
  );
};

export default Booktab;
