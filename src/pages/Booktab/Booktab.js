import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import "./Booktab.css";
import Loader from "../../components/common/loader/Loader";
import { getDisciplineBooks, saveUserBooks } from "../../services/book.service";
import { saveUserDiscipline } from "../../services/discipline.service";

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
  const [isOpen, setIsOpen] = useState(true);
  const isSelected = selectedItems.includes(node.id);
  const hasChildNodes = node.nodes && node.nodes.length > 0;

  const handleNodeClick = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectNode = () => {
    if (!hasChildNodes) {
      onSelectItem(node);
    }
  };

  return (
    <div>
      <div
        className={`tree-node ${isSelected ? "selected" : ""}`}
        onClick={hasChildNodes ? handleNodeClick : handleSelectNode}
      >
        {hasChildNodes && (
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
          hasChildNodes && (
            <div className="nested-nodes">
              {node.nodes.map((childNode) => (
                <div key={childNode.id}>
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

const TreeView = ({ selectedItems, onSelectItem, searchTerm, treeData }) => {
  const filterNodes = (nodes, term) => {
    return nodes.flatMap((node) => {
      const filteredChildNodes = filterNodes(node.nodes || [], term);
      return node.text.toLowerCase().includes(term.toLowerCase()) || filteredChildNodes.length > 0
        ? [{ ...node, nodes: filteredChildNodes }]
        : [];
    });
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

const Booktab = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [bookDetails, setBookDetails] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const prevDisciplines = useRef([]);

  useEffect(() => {
    document.title = "Choose Your Books or Topics";
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const disciplines = new URLSearchParams(location.search).get("disciplines");
        if (disciplines) {
          const selectedDisciplines = disciplines.split(",");
          if (JSON.stringify(selectedDisciplines) !== JSON.stringify(prevDisciplines.current)) {
            prevDisciplines.current = selectedDisciplines;
            let newData = [];
            let uniqueDisciplines = new Set();
            for (const setofItem of selectedDisciplines) {
              const data = await getDisciplineBooks(setofItem);
              const formattedData = data.reduce((acc, item) => {
                if (!uniqueDisciplines.has(item.discipline)) {
                  uniqueDisciplines.add(item.discipline);
                  acc.push({
                    id: item.guid,
                    text: `${item.discipline}`,
                    droppable: true,
                    nodes: data
                      .filter(title => title.discipline === item.discipline)
                      .map((title, index) => ({
                        id: `${title.guid}` + index,
                        text: `${title.title}`,
                        droppable: false,
                        parentId: item.guid,
                      })),
                  });
                }
                return acc;
              }, []);

              newData = [...newData, ...formattedData];
            }
            setTreeData(newData);
            setLoading(false);
          } else {
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [location.search, getDisciplineBooks]);

  const handleNext = () => {
    const parentIds = bookDetails.map(book => book.id);
    const disciplinesofbooks = bookDetails.map(discipline => discipline.discipline);
    saveUserDiscipline(disciplinesofbooks, sessionStorage.getItem("userId"));

    saveUserBooks(parentIds, sessionStorage.getItem("userId"));
    if (selectedBooks.length > 0) {
      navigate(`/home?books=${bookDetails.join(',')}`);
    }
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
      const bookDetail = {
        id: node.parentId,
        title: node.text,
        discipline: treeData.find(item => item.id === node.parentId)?.text
      };
      setBookDetails(prevBookDetails => [...prevBookDetails, bookDetail]);
      setSelectedBooks((prevSelectedBooks) => {
        const key = `${node.id}`;
        if (prevSelectedBooks.includes(key)) {
          return prevSelectedBooks.filter((item) => item !== key);
        } else {
          return [...prevSelectedBooks, key];
        }
      });
    }
  };
  console.log("books", bookDetails)

  return (
    <div className="booktab-container">
      {loading ? (
        <Loader show="true" />
      ) : (
        <>
          <div className="top-container">
            <h2 className="choose-your-books-or-topics"><FormattedMessage id="booktab.steps.1" /></h2>
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
                  placeholder="Search Books"
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
