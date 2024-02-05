import React, { useEffect } from "react";
import "./QuestionTemplatesPage.css";
import CustomQuestionBanksService from "../../services/CustomQuestionBanksService";
import { useDrag } from "react-dnd";

const DraggableQuestionTemplate = ({ questionTemplate }) => {
  const [, drag] = useDrag({
    type: "QUESTION_TEMPLATE",
    item: { questionTemplate },
  });

  function getQuestionHtmlTemplate(questionTemplate) {
    return {
      __html: questionTemplate.textHTML,
    };
  }

  return (
    <li
      className="row qstn-header myLI12"
      ref={drag}
      qstntemplate={questionTemplate.qstnTemplate.toString()}
    >
      <button className="plusIconQT newTest-close glyphicon glyphicon-plus"></button>
      <div
        className="printViewContainer"
        dangerouslySetInnerHTML={getQuestionHtmlTemplate(questionTemplate)}
      ></div>
    </li>
  );
};

const QuestionTemplatesPage = () => {
  const questionTemplates = CustomQuestionBanksService.questionTemplates();

  useEffect(() => {
    console.log("questionTemplates", questionTemplates);
  }, []);

  return (
    <div className="p-2">
      <ul>
        {questionTemplates.map((questionTemplate, index) => (
          <DraggableQuestionTemplate
            key={index}
            questionTemplate={questionTemplate}
          />
        ))}
      </ul>
    </div>
  );
};

export default QuestionTemplatesPage;
