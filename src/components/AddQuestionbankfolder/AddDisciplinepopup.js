import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import SearchBox from '../SearchBox/SearchBox';
import Loader from '../common/loader/Loader';
import Toastify from '../common/Toastify';
import { getAllDisciplines } from '../../services/discipline.service';
import { useAppContext } from '../../context/AppContext';
import './AddDisciplinepopup.css';

const AddDisciplinepopup = ({ handleNext }) => {
  const [loading, setLoading] = useState(true);
  const [allDisciplines, setAllDisciplines] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const {
    disciplinesData: { userDisciplines, selectedDisciplines },
    dispatchEvent,
  } = useAppContext();

  useEffect(() => {
    document.title = 'Choose Your Discipline';

    loadDisciplinesData();
  }, []);

  const loadDisciplinesData = async () => {
    setLoading(true);
    try {
      const disciplines = await getAllDisciplines();
      setAllDisciplines(disciplines);
      setSearchResults(disciplines);

      if (selectedDisciplines?.length) {
        return;
      }

      if (userDisciplines?.length > 0) {
        const filteredDisciplines = disciplines.filter(item => userDisciplines.includes(item));

        dispatchEvent('UPDATE_SELECTED_DISCIPLINES', {
          disciplines: filteredDisciplines,
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Toastify(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = value => {
    const filteredResults = allDisciplines.filter(item => item.toLowerCase().includes(value.toLowerCase()));

    setSearchResults(filteredResults);
  };

  const handleSelectItem = item => {
    let updatedSelection = [];
    if (selectedDisciplines.includes(item)) {
      updatedSelection = selectedDisciplines.filter(selectedItem => selectedItem !== item);
    } else {
      updatedSelection = [...selectedDisciplines, item];
    }

    dispatchEvent('UPDATE_SELECTED_DISCIPLINES', {
      disciplines: updatedSelection,
    });
  };

  const handleNextStep = () => {
    if (selectedDisciplines.length > 0) {
      handleNext();
    }
  };

  return (
    <div className="disciplineaddpopup-container">
      {loading ? (
        <Loader show={true} />
      ) : allDisciplines.length === 0 ? (
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
