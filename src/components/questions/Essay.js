import CustomQuestionBanksService from "../../services/CustomQuestionBanksService";
import QtiService from "../../utils/qtiService";

const Essay = () => {debugger;
    const essayTemplate = CustomQuestionBanksService.Essay_Template;
    console.log(essayTemplate);
    //const qtiService=QtiService.getQtiJsonModal(essayTemplate,"Essay");
        
    return (
        <>
            Essay Question
            <input type="text" id="catiopn"></input>
        </>
    );
}
export default Essay;