import TreeView from "./tree-view/TreeView";
import QuestBanks from "../components/AddQuestionbankfolder/AddQuestionsBanks";
import { getUserDisciplines } from "../services/discipline.service";
import React, { useState, useEffect } from "react";
import SearchBox from "../components/SearchBox/SearchBox";
import "./QuestionBanks.css"
const QuestionBanks = () => {
  const [disciplineData, setDisciplineData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");


  const handleSelectItem = (item) => {
    setSelectedItems([...selectedItems, item]);
  };
 
  useEffect(() => {
    // Fetch data from the API using getAllBooks
    getUserDisciplines()
      .then((data) => {
        if (data) {
          const objCopy = [...data];
          setDisciplineData(objCopy);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  const handleSearch = (term) => {
    console.log("term in questions bank is as follows", term);
    setSearchTerm(term);
  };
  return (
    <div className="pt-2">
      <SearchBox
        onSearch={handleSearch}
        selectedItems={selectedItems}
        handleSelectItem={handleSelectItem}
      />
      <div className="questionBank">
        <QuestBanks 
        />
      </div>
      {disciplineData.length > 0 && (
        <div>
          <TreeView disciplines={disciplineData} searchTerm={searchTerm} />{" "}
        </div>
      )}
    </div>
  );
};
export default QuestionBanks;
