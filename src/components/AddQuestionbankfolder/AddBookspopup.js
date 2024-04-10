import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import "./AddBookspopup.css";
import Loader from "../../components/common/loader/Loader";
import { getDisciplineBooks, getUserBooks, saveUserBooks } from "../../services/book.service";
import { saveUserDiscipline } from "../../services/discipline.service";
import Toastify from "../common/Toastify";

const TreeNode = ({ node, onSelectItem, selectedItems, searchTerm }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isSelected, setIsSelected] = useState(selectedItems.includes(node.id));
  const hasChildNodes = node.nodes && node.nodes.length > 0;
  
  useEffect(() => {
    setIsSelected(selectedItems.includes(node.id));
  }, [selectedItems, node.id]);

  const handleNodeClick = () => {
    setIsOpen(!isOpen);
  };

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
          className={`tree-node ${hasChildNodes ? "" : isSelected ? "selected" : ""}`}
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
      )}
      
      <div>
        {isOpen && hasChildNodes && (
          <div className="nested-nodes">
            {node.nodes.map((childNode) => (
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


const TreeView = ({ selectedItems, onSelectItem, searchTerm, treeData }) => {
  const filterNodes = (nodes, term,isBookNode) => {
    return nodes.flatMap((node) => {
      // if (!isBookNode && node.droppable) {
      //   return []; // Exclude discipline nodes when searching for books
      // }
      const filteredChildNodes = filterNodes(node.nodes || [], term , isBookNode || node.droppable);
      if (filteredChildNodes.length > 0) {
        return [{ ...node, nodes: filteredChildNodes }];
      }
      if (isBookNode && node.text.toLowerCase().includes(term.toLowerCase())) {
        return [{ ...node, nodes: [] }];
      }
      return [];
    });
  };

  const filteredTreeData = useMemo(() => {
    if (!searchTerm) {
      return treeData;
    }
    return filterNodes(treeData, searchTerm, false);
  }, [searchTerm, treeData]);

  return (
    <div className="treeview">
      {searchTerm && filteredTreeData.length === 0 ? (
          <div className="no-matching-books-message">
          <FormattedMessage id="no_matching_books_message" defaultMessage="No matching books found" />
         </div>
      ) : (
        filteredTreeData.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            onSelectItem={onSelectItem}
            selectedItems={selectedItems}
            searchTerm={searchTerm}
          />
        ))
      )}
    </div>
  );
};

const AddBookspopup = ({ handleBack,handleSave }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [bookDetails, setBookDetails] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const prevDisciplines = useRef([]);
  const [userbooksData, setUserbooksData] = useState([]);
  const disciplines = sessionStorage.getItem("selectedDisciplinesAddpopup");
  const selectedDisciplines = disciplines ? JSON.parse(disciplines) : [];

  useEffect(() => {
    document.title = "Choose Your Books or Topics";
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (selectedDisciplines) {
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
                        id: `${title?.guid}`,
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
  }, [location.search, getDisciplineBooks, selectedDisciplines]);

  useEffect(() => {
    getUserBooks()
      .then((data) => {
        if (data) {
          setUserbooksData(data);

          const userBookIds = data.map(book => book);
          setSelectedBooks(userBookIds);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);
  console.log("api dayta of user ", userbooksData)
  console.log("selctedboos in api pass", selectedBooks)

  const handleNext = () => {
    let parentIds = [];
    if (bookDetails.length > 0) {
      parentIds = bookDetails.map(book => book.id)  ;
    } else {
      parentIds = selectedBooks;
    }

    saveUserBooks(parentIds, sessionStorage.getItem("userId"));
  
    const uniqueDisciplines = new Set(selectedDisciplines);
    const uniqueDisciplinesArray = Array.from(uniqueDisciplines);
    saveUserDiscipline(uniqueDisciplinesArray, sessionStorage.getItem("userId"));

    handleSave(); 

    
    Toastify({ message: "Books and Discipline  have been saved successfully!", type: "success" });
    
  };



  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const inputWidth = Math.max(200, e.target.scrollWidth);
    document.querySelector(".search-input").style.minWidth = inputWidth + "px";
  };
  const handleSelectItem = (node) => {
    if (!node.droppable) {
      const bookId = `${node.id}`;
      // Check if the book is already selected
      if (!selectedBooks.includes(bookId)) {
        const bookDetail = {
          id: bookId,
          title: node.text,
          discipline: treeData.find(item => item.id === node.parentId)?.text
        };
        setBookDetails(prevBookDetails => [...prevBookDetails, bookDetail]);
      }

      // Update selectedBooks state to include both the newly selected book ID and previously selected user book IDs
      setSelectedBooks(prevSelectedBooks => {
        if (prevSelectedBooks.includes(bookId)) {
          return prevSelectedBooks.filter(id => id !== bookId);
        } else {
          return [...prevSelectedBooks, bookId];
        }
      });
    }
  };


  console.log("book details ", bookDetails)



  return (
    <div className="booktab-container">
      {loading ? (
        <Loader show="true" />
      ) : (
        <>
          <div className="top-containerbooks">
          <h2 className="choose-your-books-or-topics">
              <FormattedMessage id="addBooks" defaultMessage="Add Books" />
         </h2>
          <button className="booktab btn btn-secondary" onClick={handleBack}>
              <FormattedMessage id="backButton" defaultMessage="Back" />
          </button>
          <button className="booktab btn btn-primary" disabled={selectedBooks.length === 0} onClick={handleNext}>
              <FormattedMessage id="saveButton" defaultMessage="Save" />
          </button>
          </div>
          <div className="discipline input-group rounded">
            <input
              type="search"
              width="100%"
              className=" form-control rounded search-inputbox"
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
          <ul className="booktabaddpopup result-list mt-3">
            <TreeView
              selectedItems={selectedBooks}
              onSelectItem={handleSelectItem}
              searchTerm={searchTerm}
              treeData={treeData}
            />
          </ul>
        </>
      )}
    </div>
  );
};

export default AddBookspopup;
