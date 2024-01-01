import { useEffect } from "react";
import QTI from "../../utils/qti-player";
import "./QuestionTemplatesPage.scss"
import CustomQuestionBanksService from "../../services/CustomQuestionBanksService";

const QuestionTemplatesPage = () => {
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
           
              <ul>
                {questionTemplates.map((questionTemplate, index) =>
                    <li  qstntemplate={questionTemplate.qstnTemplate.toString()}  className="row qstn-header myLI12"   key={index}>
                    	<button class="plusIconQT newTest-close glyphicon glyphicon-plus" ></button>
                    <div className="printViewContainer" dangerouslySetInnerHTML={getQuestionHtmlTemplate(questionTemplate)} ></div>
                      </li>
                )}
            </ul>
        </>
    );
}
export default QuestionTemplatesPage;