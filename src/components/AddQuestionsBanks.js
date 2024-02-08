import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

const QuestBanks = () => {

  useEffect(() => {
    document.title = "Question Banks";
  }, []);
    
  return (
    <div className="p-2">
      <div className="button-container">
          <Button className="color-black" variant="outline-light" Add Questions Banks>
            <i className="fa-solid fa-plus"></i>&ensp;
            <FormattedMessage id="questionbanks.addquestionsbanks" />
          </Button>
      </div>
    </div>
  );
};

export default QuestBanks;
