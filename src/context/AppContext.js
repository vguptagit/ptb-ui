// context/AppContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import Test from '../entities/Test.Entity';
import { getTestQuestions } from '../services/testcreate.service';
import QtiService from '../utils/qtiService';
import Toastify from '../components/common/Toastify';
import { getUserTestFolders } from '../services/testfolder.service';
import { getFolderTests, getRootTests } from '../services/testcreate.service';
import CustomQuestionBanksService from '../services/CustomQuestionBanksService';
import jquery from 'jquery';

const AppContext = createContext({
  tests: [],
  disciplinesData: { allDisciplines: [], userDisciplines: [], selectedDisciplines: [] },
  selectTest: () => {},
  addTest: () => {},
  deleteTest: () => {},
  dispatchEvent: () => {},
  selectedTest: {},
});

const AppProvider = ({ children }) => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState();
  const [selectedQuestion, setSelectedQuestion] = useState();
  const [editTest, setEditTest] = useState(null);
  const [savedFolders, setSavedFolders] = useState([]);
  const [rootFolderGuid, setRootFolderGuid] = useState('');
  const [editTestHighlight, setEditTestHighlight] = useState();
  const [selectedViewTest, setSelectedViewTest] = useState(null);
  const [isMigratedTests, setIsMigratedTests] = useState(false);
  const [disciplinesData, setDisciplinesData] = useState({});

  const getQuestionFromDto = questionDto => {
    let question = questionDto;
    var qtiModel = QtiService.getQtiModel(question.qtixml, question.metadata.quizType);
    qtiModel.EditOption = false;
    question.qtiModel = qtiModel;
    question.masterData = JSON.parse(JSON.stringify(qtiModel));
    question.itemId = questionDto.guid;
    question.quizType = question.metadata.quizType;
    question.data = question.qtixml;
    const questionTemplates = CustomQuestionBanksService.questionTemplates(question);

    if (question.quizType == 'FillInBlanks') {
      let xmlToHtml = getPrintModeFbCaption(question.qtiModel.Caption);
      question.textHTML = xmlToHtml;
    } else {
      let xmlToHtml = questionTemplates[0].textHTML;
      question.textHTML = xmlToHtml;
    }
    question.spaceLine = 0;
    return question;
  };

  const getPrintModeFbCaption = Caption => {
    try {
      var htmlText = Caption.trim().replaceAll('&amp;nbsp;', ' ');
      htmlText = htmlText.replaceAll('&lt;', '<').replaceAll('&gt;', '>');
      var element = jquery('<p></p>');
      jquery(element).append(htmlText);
      element.find('button').each(function (i, obj) {
        let blankSpace = "<span class='blank'> _____________________ </span>";
        jquery(obj).replaceWith(blankSpace);
      });
      return element[0].innerHTML;
    } catch (e) {}
  };

  const handleViewTest = node => {
    //setTestName(name.text);
    makeViewTestQuestion(node);
  };

  const makeViewTestQuestion = async node => {
    try {
      let questions = await getTestQuestions(node.guid);
      if (questions) {
        let test = new Test();
        test.title = node.title;
        test.tabTitle = node.title;
        test.folderGuid = node.parent == 0 ? null : node.parent;
        test.testId = node.guid;
        test.metadata = {};
        questions.forEach(question => {
          test.questions.push(getQuestionFromDto(question));
        });
        addTest(test);
      }
    } catch (error) {
      console.error('Error getting test :', error);
      if (error?.message?.response?.request?.status === 409) {
        Toastify({
          message: error.message.response.data.message,
          type: 'error',
        });
      } else {
        Toastify({ message: 'Error while fetching test', type: 'error' });
      }
    }
  };

  const handleEditTest = node => {
    //setTestName(name.text);
    makeTestQuestion(node);
  };

  const handleQuestionAdd = node => {
    console.log('adding question', node);
    selectedTest.questions.push(node);
    setSelectedQuestion(node);
  };

  const makeTestQuestion = async node => {
    try {
      let questions = await getTestQuestions(node.id);
      if (questions) {
        let test = new Test();
        test.title = node.text;
        test.tabTitle = node.text;
        test.folderGuid = node.parent == 0 ? null : node.parent;
        test.testId = node.id;
        test.metadata = {};
        questions.forEach(question => {
          test.questions.push(getQuestionFromDto(question));
        });
        addTest(test);
      }
    } catch (error) {
      console.error('Error getting test :', error);
      if (error?.message?.response?.request?.status === 409) {
        Toastify({
          message: error.message.response.data.message,
          type: 'error',
        });
      } else {
        Toastify({ message: 'Error while fetching test', type: 'error' });
      }
    }
  };

  const selectTest = item => {
    const selectedItem = tests.filter(test => test.id === item.id);
    if (selectedItem && selectedItem.length > 0) {
      setSelectedTest(selectedItem[0]);
    }
  };

  const addTest = newTest => {
    setTests([...tests, newTest]);
    setSelectedTest(newTest);
  };

  const deleteTest = testSelected => {
    const updatedTabs = tests.filter(test => test.id !== testSelected.id);
    setTests(updatedTabs);
  };

  const fetchUserFolders = async () => {
    const rootFolder = await getRootTests();
    setRootFolderGuid(rootFolder.guid);

    Promise.all([getUserTestFolders(rootFolder.guid), getFolderTests(rootFolder.guid)])
      .then(([rootFoldersResponse, folderTestsResponse]) => {
        const combinedData = [...rootFoldersResponse, ...folderTestsResponse];
        setSavedFolders(combinedData);
        localStorage.setItem('savedFolders', JSON.stringify(combinedData));
      })
      .catch(error => {
        console.error('Error getting root folders or folder tests:', error);
        if (error?.message?.response?.request?.status === 409) {
          Toastify({ message: error.message.response.data.message, type: 'error' });
        } else {
          Toastify({ message: 'Failed to get root folders or folder tests', type: 'error' });
        }
      });
  };

  const dispatchEvent = (actionType, payload) => {
    switch (actionType) {
      case 'SELECT_TEST':
        selectTest(payload);
        return;
      case 'ADD_TEST':
        addTest(payload.test);
        return;
      case 'REMOVE_TEST':
        setTests(tests.filter(test => test.id !== payload.test.id));
        return;
      case 'UPDATE_TEST_TITLE':
        setTests(tests.map(test => (test.id === payload.id ? { ...test, title: payload.title } : test)));

        if (selectedTest && selectedTest.id === payload.id) {
          setSelectedTest({ ...selectedTest, title: payload.title });
        }
        return;
      case 'UPDATE_SELECTED_TEST':
        setSelectedTest(payload.test);
        return;
      case 'UPDATE_ALL_DISCIPLINES':
        setDisciplinesData({ ...disciplinesData, allDisciplines: payload.disciplines });
        return;
      case 'UPDATE_USER_DISCIPLINES':
        setDisciplinesData({ ...disciplinesData, userDisciplines: payload.disciplines });
        return;
      case 'UPDATE_SELECTED_DISCIPLINES':
        setDisciplinesData({ ...disciplinesData, selectedDisciplines: payload.disciplines });
        return;
      default:
        return;
    }
  };

  useEffect(() => {
    if (!tests || (tests && tests.length === 0)) {
      let untitled1Test = tests.find(test => test.title === 'Untitled 1');
      if (!untitled1Test) {
        const defaultTestTab = new Test();
        defaultTestTab.title = 'Untitled 1';
        untitled1Test = defaultTestTab;
        setTests([...tests, untitled1Test]);
      }
      setSelectedTest(untitled1Test);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        tests,
        selectedTest,
        setSelectedTest,
        selectTest,
        addTest,
        deleteTest,
        dispatchEvent,
        editTest,
        handleEditTest,
        handleViewTest,
        savedFolders,
        setSavedFolders,
        rootFolderGuid,
        setRootFolderGuid,
        fetchUserFolders,
        editTestHighlight,
        setEditTestHighlight,
        setSelectedViewTest,
        selectedViewTest,
        setIsMigratedTests,
        isMigratedTests,
        handleQuestionAdd,
        disciplinesData,
        selectedQuestion,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => useContext(AppContext);

export { AppProvider, useAppContext };
