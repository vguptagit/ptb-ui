import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import './Booktab.css';
import Loader from "../../components/common/loader/Loader";
import { getDisciplineBooks } from "../../services/book.service";
import { DndProvider } from "react-dnd";
import { Tree, MultiBackend, getBackendOptions } from "@minoru/react-dnd-treeview";

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

const TreeView = ({ searchTerm, selectedItems, onSelectItem, treeData }) => {
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
      className={`tree-node ${!node.children ? 'innermost' : ''} ${selectedItems.includes(node.id) ? 'selected' : ''}`}
      onClick={() => onSelectItem(node)}
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
          onDrop={() => { }}
        />
      </DndProvider>
    </div>
  );
};

const Booktab = () => {
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
    getDisciplineBooks(selectedItems.join(","))
      .then(data => {
        setTreeData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching discipline books:', error);
        setLoading(false);
      });
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
                  treeData={treeData}
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
