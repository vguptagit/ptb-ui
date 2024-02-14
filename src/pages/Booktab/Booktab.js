import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import './Booktab.css';
import Loader from "../../components/common/loader/Loader";
import { getDisciplineBooks } from "../../services/book.service";
// import { DndProvider } from "react-dnd";
import { Tree, MultiBackend, getBackendOptions } from "@minoru/react-dnd-treeview";
import { DndProvider, useDrag, useDrop } from 'react-dnd';

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
        const hasChildMatches = node.nodes && filterNodes(node.nodes).length > 0;

        return isMatch || hasChildMatches;
      });
    };

    return filterNodes(treeData);
  }, [searchTerm, treeData]);

  const renderNode = (node, { isOpen, onToggle }) => (
    <div
      className={`tree-node ${!node.nodes ? 'innermost' : ''} ${selectedItems.includes(node.id) ? 'selected' : ''}`}
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
      <Tree
        tree={filteredTreeData}
        rootId={0}
        render={renderNode}
        dragPreviewRender={() => null}
        onDrop={() => { }}
      />
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
      try {
        let newData = [];
        for (const setofItem of selectedItems) {
          const data = await getDisciplineBooks(setofItem);
          console.log("Fetched data:", data); 
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
          newData = [...newData, ...formattedData];
        }
        console.log("New data:", newData); 
        setTreeData(newData);
        console.log("treeview", treeData)
        setLoading(false);
      } catch (error) {
        console.error('Error fetching discipline books:', error);
        setLoading(false);
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
            <div className="discipline search-container">
              <div className="discipline input-group rounded">
                <input
                  type="search"
                  width="100%"
                  className="discipline form-control rounded search-input"
                  placeholder="Search Discipline"
                  aria-label="Search"
                  aria-describedby="search-addon"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <div className="discipline input-group-append">
                  <span className="discipline input-group-text border-0" id="search-addon">
                    <i className="fas fa-search"></i>
                  </span>
                </div>
              </div>
              <ul className="discipline result-list mt-3">
                <TreeView
                  selectedItems={selectedItems}
                  onSelectItem={handleSelectItem}
                  searchTerm={searchTerm}
                  treeData={treeData}
                />

              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Booktab;
