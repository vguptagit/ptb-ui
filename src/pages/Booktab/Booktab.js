import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import "./Booktab.css";
import Loader from "../../components/common/loader/Loader";
import { getDisciplineBooks } from "../../services/book.service";

const LeftContent = () => {
  return (
    <div className="left-content">
      <ul>
        <li>
          <FormattedMessage id="booktab.steps.2" />
        </li>
        <li>
          <FormattedMessage id="booktab.steps.3" />
        </li>
        <li>
          <FormattedMessage id="booktab.steps.4" />
        </li>
      </ul>
    </div>
  );
};

const TreeNode = ({ node, onSelectItem, selectedItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isSelected = selectedItems.includes(node.id);

  const handleNodeClick = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectChild = (childNode) => {
    onSelectItem(childNode);
  };

  return (
    <div>
      <div
        className={`tree-node ${isSelected ? "selected" : ""}`}
        onClick={() => handleNodeClick()}
      >
        {node.nodes && node.nodes.length > 0 && (
          <div className="tree-node-header">
            {isOpen ? (
              <i className="fa fa-caret-down"></i>
            ) : (
              <i className="fa fa-caret-right"></i>
            )}
          </div>
        )}
        <span>{node.text}</span>
      </div>
      <div>
        {isOpen &&
          node.nodes &&
          node.nodes.length > 0 && (
            <div className="nested-nodes">
              {node.nodes.map((childNode) => (
                <div key={childNode.id} onClick={() => handleSelectChild(childNode)}>
                  <TreeNode
                    node={childNode}
                    onSelectItem={onSelectItem}
                    selectedItems={selectedItems}
                  />
                </div>
              ))}
            </div>
          )}
      </div>
    </div>
  );
};

const TreeView = ({ searchTerm, selectedItems, onSelectItem, treeData }) => {
  const filterNodes = (nodes, term) => {
    const filteredNodes = nodes.map((node) => {
      const filteredChildNodes = node.nodes ? filterNodes(node.nodes, term) : [];
      return {
        ...node,
        nodes: filteredChildNodes,
      };
    }).filter((node) => {
      const isMatch = node.text.toLowerCase().includes(term.toLowerCase());
      return isMatch || node.nodes.length > 0;
    });
    return filteredNodes;
  };
  
  
  

  const filteredTreeData = useMemo(() => {
    if (!searchTerm) {
      return treeData;
    }
    return filterNodes(treeData, searchTerm);
  }, [searchTerm, treeData]);

  return (
    <div className="treeview">
      {filteredTreeData.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          onSelectItem={onSelectItem}
          selectedItems={selectedItems}
        />
      ))}
    </div>
  );
};

const Booktab = ({ onDropNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDisciplines, setSelectedDisciplines] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]); 
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Choose Your Books or Topics";
  }, []);

  useEffect(() => {
    const disciplines = new URLSearchParams(location.search).get("disciplines");
    if (disciplines) {
      const selectedDisciplines = disciplines.split(",");
      setSelectedDisciplines(selectedDisciplines);
    }
  }, [location.search]);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        let newData = [];
        for (const setofItem of selectedDisciplines) {
          const data = await getDisciplineBooks(setofItem);
          const formattedData = data.map((item) => ({
            id: item.guid,
            text: `${item.discipline}`,
            droppable: true,
            nodes:
              item.nodes &&
              item.nodes.map((node) => ({
                id: node.guid,
                text: node.title,
                droppable: false,
              })),
          }));
          newData = [...newData, ...formattedData];
        }
        setTreeData(newData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching discipline books:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedDisciplines]);

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
    document.querySelector(".search-input").style.minWidth = inputWidth + "px";
  };

  const handleSelectItem = (node) => {
    if (!node.droppable) {
      setSelectedBooks((prevSelectedBooks) => {
        if (prevSelectedBooks.includes(node.id)) {
          return prevSelectedBooks.filter((item) => item !== node.id);
        } else {
          return [...prevSelectedBooks, node.id];
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
            <h4>Choose Your Books or Topics</h4>
            <button className="booktab btn btn-secondary" onClick={handleBack}>
              Back
            </button>
            <button className="booktab btn btn-primary" onClick={handleNext}>
              Next
            </button>
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
                  <span
                    className="discipline input-group-text border-0"
                    id="search-addon"
                  >
                    <i className="fas fa-search"></i>
                  </span>
                </div>
              </div>
              <ul className="discipline result-list mt-3">
                <TreeView
                  selectedItems={selectedBooks}
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
