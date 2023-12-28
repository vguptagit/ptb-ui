import { useEffect } from "react";
import QTI from "../utils/qti-player";
import CustomQuestionBanksService from "../services/CustomQuestionBanksService";

const CustomQuestionsPage = () => {
    const questionTemplates=CustomQuestionBanksService.questionTemplates();

    useEffect(() => {
        console.log('questionTemplates', questionTemplates);


    }, [])
    return (
        <>
            Custom Questions page
        </>
    );
}
export default CustomQuestionsPage;