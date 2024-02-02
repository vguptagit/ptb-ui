import TreeView from "./tree-view/TreeView";
import QuestBanks from "../components/AddQuestionsBanks";
import { getUserDisciplines } from "../services/discipline.service";
import React, { useState, useEffect } from "react";
const QuestionBanks = () => {
    const [disciplineData, setDisciplineData] = useState([]);
    useEffect(() => {
        // Fetch data from the API using getAllBooks
        getUserDisciplines()
          .then((data) => {
            // Set the fetched data to the state
            if(data)
            {
              //console.log("data is as follows ->>>", data);
              const objCopy=[...data]
              setDisciplineData(objCopy);
            }
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      }, []); 
    return (
        <>
           <QuestBanks/>
           {disciplineData.length > 0 && <div><TreeView disciplines = {disciplineData}/>  </div> }
        </>
    );
}
export default QuestionBanks;