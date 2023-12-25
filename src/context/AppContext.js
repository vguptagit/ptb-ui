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
    const dispatchEvent = (actionType, payload) => {
        switch (actionType) {
            case "SELECT_TEST":
                setSelectedTest(payload);
                return;
            case "ADD_TEST":
                setTests([...tests, payload.test]);
                console.log(payload.test);
                console.log(tests);
                return;
            case "REMOVE_TEST":
                console.log('REMOVE_TEST', payload.test);

                setTests(tests.filter((test) => test.id !== payload.test.id));
                return;
            default:
                return;
        }
    };

    useEffect(() => {
        const defaultTestTab = new Test();
        defaultTestTab.title = 'Untitled 1';
        setTests([...tests, defaultTestTab]);
        console.log("tests count", tests.length);

    }, [])
    return (
        <AppContext.Provider value={{ tests, selectedTest, selectTest, addTest, deleteTest, dispatchEvent }}>
            {children}
        </AppContext.Provider>
    )
}

const useAppContext = () => {
    return useContext(AppContext);
}

export { AppProvider, useAppContext }