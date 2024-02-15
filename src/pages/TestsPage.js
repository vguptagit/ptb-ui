import TestFolder from "../components/AddTestFolder";
import React, { useEffect, useState } from 'react';
import { getRootTestFolders } from '../services/testfolder.service';
import Toastify from '../components/common/Toastify';

const Tests = () => {
  const [rootFolders, setRootFolders] = useState([]);
  const [doReload, setDoReload] = useState(false);

  useEffect(() => {
    document.title = "Your Tests";
  }, []);

  useEffect(() => {
    getRootTestFolders()
      .then((rootFolders) => {
        setRootFolders(rootFolders);
      })
      .catch((error) => {
        console.error('Error getting root folders:', error);
        if (error?.message?.response?.request?.status === 409) {
          Toastify({ message: error.message.response.data.message, type: 'error' });
        } else {
          Toastify({ message: 'Failed to get root folders', type: 'error' });
        }
      })
  }, [doReload]);

  return (
    <div className="p-2">
      <TestFolder rootFolders={rootFolders} setDoReload={setDoReload} />
    </div>
  );
};

export default Tests;