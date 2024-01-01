import { useEffect } from "react";
import QTI from "../utils/qti-player";
import CustomQuestionBanksService from "../services/CustomQuestionBanksService";

const CustomQuestionsPage = () => {
    const questionTemplates = CustomQuestionBanksService.questionTemplates();

    function getQuestionHtmlTemplate(questionTemplate) {
        return {
           __html: questionTemplate.textHTML    };
     }; 


    useEffect(() => {
        console.log('questionTemplates', questionTemplates);
    }, [])


    return (
        <>
            Custom Questions page

              <ul >
                {questionTemplates.map((questionTemplate, index) =>
                
                    <li  key={index}>{questionTemplate.quizType}
                    
                    <div dangerouslySetInnerHTML={getQuestionHtmlTemplate(questionTemplate)} ></div>
                    
                    </li>
                )}
            </ul>
        </>
    );
}
export default CustomQuestionsPage;