import React, { useState,useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import SearchBox from './SearchBox/SearchBox';
const QuestBanks = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  useEffect(() => {
    document.title = "Question Banks";
  }, []);


  
  const handleSelectItem = (item) => {
    setSelectedItems([...selectedItems, item]); 
  };


  return (
    <>

    <SearchBox
        selectedItems={selectedItems}
        handleSelectItem={handleSelectItem}
      />
    
      <div className="button-container">
          <Button className="color-black" variant="outline-light" Add Questions Banks>
            <i className="fa-solid fa-plus"></i>&ensp;
            <FormattedMessage id="questionbanks.addquestionsbanks" />
          </Button>
      </div>
    </>
  );
};

export default QuestBanks;
