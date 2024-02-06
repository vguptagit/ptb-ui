// AppContext.js
import { createContext, useContext, useEffect, useState } from "react";
import Test from "../entities/Test.Entity";

const AppContext = createContext({
    tests: [],
    selectTest: () => { },
    addTest: () => { },
    deleteTest: () => { },
    dispatchEvent: () => { },
    selectedTest: {}
});

const AppProvider = ({ children }) => {
    const [tests, setTests] = useState([]);
    const [selectedTest, setSelectedTest] = useState(new Test());

    const selectTest = (item) => {
        setSelectedTest(item);
    };

    const addTest = (newTest) => {
        setTests([...tests, newTest]);
    };

    const deleteTest = (testSelected) => {
        const updatedTabs = tests.filter(test => test.id !== testSelected.id);
        setTests(updatedTabs);
    };

    const dispatchEvent = (actionType, payload) => {
        switch (actionType) {
            case "SELECT_TEST":
                setSelectedTest(payload);
                return;
            case "ADD_TEST":
                setTests([...tests, payload.test]);
                return;
            case "REMOVE_TEST":
                setTests(tests.filter((test) => test.id !== payload.test.id));
                return;
            case "UPDATE_TEST_TITLE":
                const updatedTests = tests.map(test => {
                    if (test.id === payload.id) {
                        return { ...test, title: payload.title };
                    }
                    return test;
                });
                setTests(updatedTests);
                setSelectedTest(test => {
                    if (test.id === payload.id) {
                        return { ...test, title: payload.title };
                    }
                    return test;
                });
                return;
            default:
                return;
        }
    };

    useEffect(() => {
        const defaultTestTab = new Test();
        defaultTestTab.title = 'Untitled 1';
        setTests([defaultTestTab]);
    }, []);

    return (
        <AppContext.Provider value={{ tests, selectedTest, selectTest, addTest, deleteTest, dispatchEvent }}>
            {children}
        </AppContext.Provider>
    );
};

const useAppContext = () => useContext(AppContext);

export { AppProvider, useAppContext };
