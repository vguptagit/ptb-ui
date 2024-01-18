import React from 'react';
import { Button } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

const QuestBanks = () => {

       
      

  return (
    <div className="p-1">
      <div className="button-container">
        <Button className="color-black" variant="outline-light" Add Questions Banks>
          <i className="fa-solid fa-plus"></i>&nbsp;
          <FormattedMessage id="questionbanks.addquestionsbanks" />
        </Button>
        
      </div>
      </div>
  );
};

export default QuestBanks;
