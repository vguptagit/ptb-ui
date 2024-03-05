import TestFolder from "../components/AddTestFolder";
import React, { useEffect, useState } from 'react';
import { getRootTestFolders } from '../services/testfolder.service';
import { getFolderTests } from "../services/testcreate.service";
import Toastify from '../components/common/Toastify';

const Tests = () => {
  const [rootFolders, setRootFolders] = useState([]);
  const [doReload, setDoReload] = useState(false);

  useEffect(() => {
    document.title = "Your Tests";
  }, []);

  useEffect(() => {
    Promise.all([getRootTestFolders(), getFolderTests(null)])
        .then(([rootFoldersResponse, folderTestsResponse]) => {
            // Assuming both responses are arrays
            const combinedData = [...rootFoldersResponse, ...folderTestsResponse];
            setRootFolders(combinedData);
        })
        .catch((error) => {
            console.error('Error getting root folders or folder tests:', error);
            if (error?.message?.response?.request?.status === 409) {
                Toastify({ message: error.message.response.data.message, type: 'error' });
            } else {
                Toastify({ message: 'Failed to get root folders or folder tests', type: 'error' });
            }
        });
}, [doReload]);


  return (
    <div className="">
      <TestFolder rootFolders={rootFolders} doReload={doReload} setDoReload={setDoReload} />
    </div>
  );
};

export default Tests;
