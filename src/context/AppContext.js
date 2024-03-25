// context/AppContext.js
import { createContext, useContext, useEffect, useState } from "react";
import Test from "../entities/Test.Entity";

const AppContext = createContext({
  tests: [],
  selectTest: () => {},
  addTest: () => {},
  deleteTest: () => {},
  dispatchEvent: () => {},
  selectedTest: {},
});

const AppProvider = ({ children }) => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState();
  const [editTest, setEditTest] = useState(null);

  const handleEditTest = (clickedTest) => {
    setEditTest(clickedTest);
  };

  const selectTest = (item) => {
    const selectedItem = tests.filter((test) => test.id === item.id);
    if (selectedItem && selectedItem.length > 0) {
      setSelectedTest(selectedItem[0]);
    }
  };

  const addTest = (newTest) => {
      setTests([...tests, newTest]);
      setSelectedTest(newTest);
  };

  const deleteTest = (testSelected) => {
    const updatedTabs = tests.filter((test) => test.id !== testSelected.id);
    setTests(updatedTabs);
  };

  const dispatchEvent = (actionType, payload) => {
    switch (actionType) {
      case "SELECT_TEST":
        selectTest(payload);
        return;
      case "ADD_TEST":
        addTest(payload.test);
        return;
      case "REMOVE_TEST":
        setTests(tests.filter((test) => test.id !== payload.test.id));
        return;
        case "UPDATE_TEST_TITLE":
          console.log("Updating test title:", payload.title);
          setTests(
            tests.map((test) =>
              test.id === payload.id ? { ...test, title: payload.title } : test
            )
          );
        
          if (selectedTest && selectedTest.id === payload.id) {
            setSelectedTest({ ...selectedTest, title: payload.title });
          }
          return;
        
    }
  };

  useEffect(() => {
    if (!tests || (tests && tests.length === 0)) {
      let untitled1Test = tests.find((test) => test.title === "Untitled 1");
      if (!untitled1Test) {
        const defaultTestTab = new Test();
        defaultTestTab.title = "Untitled 1";
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
        selectTest,
        addTest,
        deleteTest,
        dispatchEvent,
        editTest,
        handleEditTest,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => useContext(AppContext);

export { AppProvider, useAppContext };
