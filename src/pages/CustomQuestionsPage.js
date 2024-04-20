import { useEffect } from 'react';
import QTI from '../utils/qti-player';
import CustomQuestionsService from '../services/CustomQuestionsService';
import QuestionTemplatesPage from '../pages/question-templates-page/QuestionTemplatesPage.js';

const CustomQuestionsPage = () => {
  useEffect(() => {
    document.title = 'Custom Questions';
  }, []);

  return (
    <div>
      <QuestionTemplatesPage></QuestionTemplatesPage>
    </div>
  );
};
export default CustomQuestionsPage;
