import React, { useState, useEffect } from 'react';
import TreeView from '../tree-view/TreeView';
import AddQuestionBanks from '../../components/AddQuestionbankfolder/AddQuestionBanks';
import SearchBox from '../../components/common/SearchBox/SearchBox';
import Toastify from '../../components/common/Toastify';
import { getAllDisciplines, getUserDisciplines } from '../../services/discipline.service';
import { getUserBooks } from '../../services/book.service';
import { useAppContext } from '../../context/AppContext';
import './QuestionBanks.css';

const QuestionBanks = () => {
  const {
    disciplinesData: { userDisciplines },
    dispatchEvent,
  } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  // Load user disciplines and books when the component mounts
  useEffect(() => {
    loadUserResources();
  }, []);

  /**
   * Loads the user's selected disciplines and books from the server and updates the state with the fetched data.
   *
   * This function uses the `Promise.all` method to fetch the user's selected disciplines and books in parallel,
   * which improves the performance of the application.
   *
   * If an error occurs during the fetch request, the function will display an error message to the user using the `Toastify` component.
   */
  const loadUserResources = async () => {
    try {
      // Fetch user selected disciplines and books in parallel
      const [allDisciplines, disciplines, books] = await Promise.all([
        getAllDisciplines(),
        getUserDisciplines(),
        getUserBooks(),
      ]);

      // Update user disciplines and books in the state
      dispatchEvent('UPDATE_DISCIPLINES_DATA', {
        allDisciplines,
        userDisciplines: disciplines,
        userBooks: books,
        selectedBooks: books,
      });
    } catch (error) {
      // Display error message using Toastify
      Toastify(error.message);
    }
  };

  /**
   * Updates the search term state with the given value.
   * @param {string} searchTerm - The new search term to set.
   */
  const handleSearch = searchTerm => {
    setSearchTerm(searchTerm);
  };

  return (
    <div className="p-2">
      <div className="col-lg-7 ml-8">
        <SearchBox placeholder="Search selected banks" onSearch={handleSearch} />
      </div>
      <div className="questionBank">
        <AddQuestionBanks reloadDisciplines={loadUserResources} />
      </div>
      {userDisciplines?.length > 0 && (
        <div className="discipline-books">
          <TreeView disciplines={userDisciplines} searchTerm={searchTerm} />{' '}
        </div>
      )}
    </div>
  );
};
export default QuestionBanks;
