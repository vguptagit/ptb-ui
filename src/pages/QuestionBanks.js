import React, { useState, useEffect } from 'react';
import TreeView from './tree-view/TreeView';
import QuestBanks from '../components/AddQuestionbankfolder/AddQuestionsBanks';
import { getUserDisciplines } from '../services/discipline.service';
import SearchBox from '../components/SearchBox/SearchBox';
import Toastify from '../components/common/Toastify';
import { useAppContext } from '../context/AppContext';
import './QuestionBanks.css';

const QuestionBanks = () => {
  const { dispatchEvent } = useAppContext();

  const [disciplineData, setDisciplineData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadDisiplines();
  }, []);

  const loadDisiplines = async () => {
    try {
      const data = await getUserDisciplines();
      setDisciplineData(data);
      dispatchEvent('UPDATE_USER_DISCIPLINES', {
        disciplines: data
      });
    } catch (error) {
      Toastify(error);
    }
  };

  const handleSearch = term => {
    setSearchTerm(term);
  };

  return (
    <div className="p-2">
      <div className='col-lg-7 ml-8'>
        <SearchBox placeholder='Search selected banks' onSearch={handleSearch} />
      </div>
      <div className='questionBank'>
        <QuestBanks reloadDisciplines={loadDisiplines} />
      </div>
      {disciplineData.length > 0 && (
        <div className="discipline-books">
          <TreeView disciplines={disciplineData} searchTerm={searchTerm} />{' '}
        </div>
      )}
    </div>
  );
};
export default QuestionBanks;
