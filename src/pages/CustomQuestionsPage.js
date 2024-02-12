import { useEffect } from "react";
import QTI from "../utils/qti-player";
import CustomQuestionBanksService from "../services/CustomQuestionBanksService";
import QuestionTemplatesPage from '../pages/question-templates-page/QuestionTemplatesPage.js';

const CustomQuestionsPage = () => {
    
    useEffect(() => {
        document.title = "Custom Questions";
    }, [])

    return (
        <div>
            <QuestionTemplatesPage></QuestionTemplatesPage>
        </div>
    );
}
export default CustomQuestionsPage;