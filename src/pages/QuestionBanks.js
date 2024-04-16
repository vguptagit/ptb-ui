import TreeView from './tree-view/TreeView';
import QuestBanks from '../components/AddQuestionbankfolder/AddQuestionsBanks';
import { getUserDisciplines } from '../services/discipline.service';
import React, { useState, useEffect } from 'react';
import SearchBox from '../components/SearchBox/SearchBox';
import Toastify from '../components/common/Toastify';
import './QuestionBanks.css';

const QuestionBanks = () => {
  const [disciplineData, setDisciplineData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadDisiplines();
  }, []);

  const loadDisiplines = async () => {
    try {
      const data = await getUserDisciplines();
      setDisciplineData(data);
    } catch (error) {
      Toastify(error);
    }
  };

  const handleSearch = term => {
    setSearchTerm(term);
  };

  return (
    <div className='pt-2'>
      <div className='col-lg-7 ml-8'>
        <SearchBox placeholder='Search selected banks' onSearch={handleSearch} />
      </div>
      <div className='questionBank'>
        <QuestBanks reloadDisciplines={loadDisiplines}/>
      </div>
      {disciplineData.length > 0 && (
        <div>
          <TreeView disciplines={disciplineData} searchTerm={searchTerm} />{' '}
        </div>
      )}
    </div>
  );
};
export default QuestionBanks;
