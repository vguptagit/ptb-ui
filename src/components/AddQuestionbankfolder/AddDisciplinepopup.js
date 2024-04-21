import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import SearchBox from '../common/SearchBox/SearchBox';
import { useAppContext } from '../../context/AppContext';
import './AddDisciplinepopup.css';

const AddDisciplinepopup = ({ handleNext }) => {
  const [searchResults, setSearchResults] = useState([]);

  const {
    disciplinesData: { allDisciplines, userDisciplines, selectedDisciplines },
    dispatchEvent,
  } = useAppContext();

  /**
   * useEffect hook that sets the document title, initializes search results,
   * and filters disciplines based on user selections.
   */
  useEffect(() => {
    document.title = 'Choose Your Discipline';

    // Initialize search results
    setSearchResults(allDisciplines);

    // Check if there are any selected disciplines
    if (selectedDisciplines?.length) {
      return;
    }

    // If there are user disciplines, filter the results
    if (userDisciplines?.length > 0) {
      const filteredDisciplines = allDisciplines.filter(item => userDisciplines.includes(item));
      dispatchEvent('UPDATE_DISCIPLINES_DATA', {
        selectedDisciplines: filteredDisciplines,
      });
    }
  }, []);

  /**
   * Filters the allDisciplines array based on the provided search value and updates the searchResults state.
   * @param {string} value - The search value to filter the allDisciplines array.
   */
  const handleSearch = value => {
    const filteredResults = allDisciplines.filter(item => item.toLowerCase().includes(value.toLowerCase()));

    setSearchResults(filteredResults);
  };

  /**
   * Handles the selection of a discipline item.
   * If the item is already selected, it will be removed from the selectedDisciplines array.
   * If the item is not selected, it will be added to the selectedDisciplines array.
   * @param {string} item - The discipline item to be selected or deselected.
   */
  const handleSelectItem = item => {
    const isSelected = selectedDisciplines.includes(item);
    const updatedSelection = isSelected
      ? selectedDisciplines.filter(selectedItem => selectedItem !== item)
      : [...selectedDisciplines, item];

    dispatchEvent('UPDATE_DISCIPLINES_DATA', {
      selectedDisciplines: updatedSelection,
    });
  };

  /**
   * Handles the next step in the discipline selection process.
   * If no disciplines are selected, the function does nothing.
   * Otherwise, it calls the handleNext function.
   */
  const handleNextStep = () => {
    if (!selectedDisciplines.length) return;
    handleNext();
  };

  return (
    <div className="disciplineaddpopup-container">
      {allDisciplines.length === 0 ? (
        <div className="no-data-message">
          <FormattedMessage id="noDisciplinesAvailable" defaultMessage="No disciplines available" />
        </div>
      ) : (
        <>
          <div className="disciplineaddpopup-top-container">
            <h4 className="choose-your-books-or-topics">
              <FormattedMessage id="addDiscipline" defaultMessage="Add Discipline" />
            </h4>
            <button
              className="disciplinePopup btn btn-primary"
              onClick={handleNextStep}
              disabled={selectedDisciplines.length === 0}
            >
              Next
            </button>
          </div>

          <SearchBox placeholder="Search Discipline" onSearch={handleSearch} />

          {searchResults.length === 0 && (
            <div className="no-matching-discipline-message">
              <FormattedMessage id="noMatchingDisciplines" defaultMessage="No matching disciplines found" />
            </div>
          )}

          <ul className="disciplinePopup result-list mt-3">
            {searchResults.map((item, index) => (
              <li
                tabIndex="0"
                key={index}
                className={`result-item ${selectedDisciplines.includes(item) ? 'selected' : ''}`}
                onClick={() => handleSelectItem(item)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSelectItem(item);
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default AddDisciplinepopup;
