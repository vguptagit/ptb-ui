import React, { useEffect } from 'react';
import Testing from '../components/common/Testing'
import TestFolder from '../components/AddTestFolder';

const Tests = () => {
    useEffect(() => {
        document.title = "Your Tests";
      }, []);
    return (
        <>
            <TestFolder/>
        </>
    );
}
export default Tests;