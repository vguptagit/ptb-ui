import React, { useEffect, useMemo, useState, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import './AddBookspopup.css';
import Loader from '../../components/common/loader/Loader';
import { getDisciplineBooks, getUserBooks, saveUserBooks } from '../../services/book.service';
import { saveUserDiscipline } from '../../services/discipline.service';
import Toastify from '../common/Toastify';
import SearchBox from '../SearchBox/SearchBox';
import { useAppContext } from '../../context/AppContext';

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

const TreeView = ({ selectedItems, onSelectItem, searchTerm, treeData }) => {
  const filterNodes = (nodes, term, isBookNode) => {
    return nodes.flatMap(node => {
      // if (!isBookNode && node.droppable) {
      //   return []; // Exclude discipline nodes when searching for books
      // }
      const filteredChildNodes = filterNodes(node.nodes || [], term, isBookNode || node.droppable);
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
        filteredTreeData.map(node => (
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

const AddBookspopup = ({ handleBack, handleSave }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    disciplinesData: { selectedDisciplines },
  } = useAppContext();

  useEffect(() => {
    document.title = 'Choose Your Books or Topics';
    loadUserBooks();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (selectedDisciplines) {
          let result = [];

          for (const [index, discipline] of selectedDisciplines.entries()) {
            const data = await getDisciplineBooks(discipline);

            result.push({
              id: index,
              text: discipline,
              droppable: true,
              nodes: data
                .filter(node => discipline === node.discipline)
                .map(node => ({
                  id: node.guid,
                  text: node.title,
                  droppable: false,
                  parentId: index,
                  discipline,
                })),
            });
          }

          setTreeData(result);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDisciplines]);

  const loadUserBooks = async () => {
    setLoading(true);
    try {
      const books = await getUserBooks();
      setSelectedBooks(books);
    } catch (error) {
      Toastify(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    try {
      await saveUserBooks(selectedBooks, sessionStorage.getItem('userId'));

      await saveUserDiscipline(selectedDisciplines, sessionStorage.getItem('userId'));
      handleSave();
      Toastify({ message: 'Books and Discipline  have been saved successfully!', type: 'success' });
    } catch (error) {
      Toastify(error);
    }
  };

  const handleSearch = value => {
    setSearchTerm(value);
  };

  const handleSelectItem = node => {
    if (!node.droppable) {
      // Update selectedBooks state to include both the newly selected book ID and previously selected user book IDs
      setSelectedBooks(prevSelectedBooks => {
        if (prevSelectedBooks.includes(node.id)) {
          return prevSelectedBooks.filter(id => id !== node.id);
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
          <SearchBox placeholder="Search Books" onSearch={handleSearch} />
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
