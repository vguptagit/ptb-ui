import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import Toastify from '../common/Toastify';
import TreeView from './TreeView';
import Loader from '../../components/common/loader/Loader';
import SearchBox from '../common/SearchBox/SearchBox';
import { getDisciplineBooks, saveUserBooks } from '../../services/book.service';
import { saveUserDiscipline } from '../../services/discipline.service';
import { useAppContext } from '../../context/AppContext';
import './AddBookspopup.css';

const AddBookspopup = ({ handleBack, handleSave }) => {
  const intl = useIntl();
  const [searchTerm, setSearchTerm] = useState('');
  const [treeData, setTreeData] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    disciplinesData: { selectedDisciplines, selectedBooks },
    dispatchEvent,
  } = useAppContext();

  useEffect(() => {
    document.title = 'Choose Your Books or Topics';
  }, []);

  useEffect(() => {
    fetchData();
  }, [selectedDisciplines]);

  /**
   * Fetches data for the selected disciplines and updates the tree data.
   * @param {string[]} selectedDisciplines - The selected disciplines to fetch data for.
   */
  const fetchData = async () => {
    setLoading(true);

    try {
      if (selectedDisciplines) {
        let result = [];
        const availableBooks = [];

        // Loop through each selected discipline
        for (const discipline of selectedDisciplines) {
          const data = await getDisciplineBooks(discipline);

          // Filter and map the data to the desired format
          const nodes = data
            .filter(node => discipline === node.discipline)
            .map(node => {
              availableBooks.push(node.guid);
              return {
                id: node.guid,
                text: node.title,
                droppable: false,
                parentId: result.length,
                discipline,
              };
            });

          // Add the discipline to the result array
          result.push({
            id: result.length,
            text: discipline,
            droppable: true,
            nodes,
          });
        }

        // Filter the selectedBooks array to only include books that are available
        const selection = selectedBooks.filter(book => availableBooks.includes(book));
        dispatchEvent('UPDATE_DISCIPLINES_DATA', { selectedBooks: selection });

        setTreeData(result);
      }
    } catch (error) {
      console.error('Error fetching data:', error);

      Toastify({
        message: error.message,
        type: 'warn',
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Saves the selected books and disciplines for the current user and displays a success toast message.
   * @returns {Promise} A promise that resolves when the books and disciplines have been saved and the toast message has been displayed.
   */
  const handleNext = async () => {
    try {
      await saveUserBooks(selectedBooks, sessionStorage.getItem('userId'));
      await saveUserDiscipline(selectedDisciplines, sessionStorage.getItem('userId'));
      handleSave();
      Toastify({
        message: intl.formatMessage({ id: 'booksAndDiscipline' }),
        type: 'success',
      });
    } catch (error) {
      Toastify({
        message: intl.formatMessage({ id: 'errorSavingBooksAndDiscipline' }),
        type: 'error',
      });
    }
  };

  /**
   * Handles the search functionality by setting the search term.
   * @param {string} searchValue - The search term entered by the user.
   */
  const handleSearch = searchValue => {
    setSearchTerm(searchValue);
  };

  const handleSelectItem = node => {
    if (!node.droppable) {
      const isSelected = selectedBooks.includes(node.id);

      // Create a new array with the updated selection
      const updatedSelection = isSelected ? selectedBooks.filter(id => id !== node.id) : [...selectedBooks, node.id];

      // Update selectedBooks state with updated selection
      dispatchEvent('UPDATE_DISCIPLINES_DATA', { selectedBooks: updatedSelection });
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
            <button className="booktab btn btn-primary" disabled={selectedBooks?.length === 0} onClick={handleNext}>
              <FormattedMessage id="saveButton" defaultMessage="Save" />
            </button>
          </div>
          <SearchBox placeholder="Search Books" onSearch={handleSearch} />
          <ul className="booktabaddpopup result-list mt-3">
            <TreeView
              selectedItems={selectedBooks || []}
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
