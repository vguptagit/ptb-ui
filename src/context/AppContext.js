import { createContext, useContext, useEffect, useState } from "react";
import Test from "../entities/Test.Entity";

const AppContext = createContext({
    tests: [],
    selectTest: () => { },
    addTest: () => { },
    deleteTest: () => { },
    selectedTest: {}
});

const AppProvider = ({ children }) => {
    const [tests, setTests] = useState([]);
    const [selectedTest, setSelectedTest] = useState(null);

    const selectTest = (item) => {
        setSelectedTest(item);
        
    };

    const addTest = (newTest) => {
        console.log("tests count", tests.length);
        console.log("newTest", newTest);

        setTests([...tests, newTest]);
        console.log("tests count", tests.length);
        console.log("tests ", tests);

    };
    const deleteTest = (testSelected) => {
        console.log("tests count", tests.length);
        console.log("testSelected", testSelected);
        const updatedTabs = tests.filter(test => test.id !== testSelected.id);

        setTests(updatedTabs);
        console.log("tests count", tests.length);
        console.log("tests ", tests);

    };
    useEffect(() => {
        const defaultTestTab = new Test();
        defaultTestTab.title = 'Untitled 1';
        setTests([...tests, defaultTestTab]);
        console.log("tests count", tests.length);

    }, [])
    return (
        <AppContext.Provider value={{ tests, selectedTest, selectTest, addTest, deleteTest }}>
            {children}
        </AppContext.Provider>
    )
}

const useAppContext = () => {
    return useContext(AppContext);
}

export { AppProvider, useAppContext }