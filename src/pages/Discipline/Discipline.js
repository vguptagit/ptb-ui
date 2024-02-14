import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import './Discipline.css';
import Loader from "../../components/common/loader/Loader";
import { getAllDisciplines } from "../../services/discipline.service";


const LeftContent = () => {
  return (
    <div className="left-content">
      <ul>
        <li><FormattedMessage id="discipline.steps.3" /></li>
        <li><FormattedMessage id="discipline.steps.4" /></li>
        <li><FormattedMessage id="discipline.steps.5" /></li>
      </ul>
    </div>
  );
};

const Discipline = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [allData, setAllData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleNext = () => {
    if (selectedItems.length > 0) {
      navigate("/booktab");
    }
  };

  useEffect(() => {
    document.title = "Choose Your Discipline";
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiData = await getAllDisciplines();
        console.log("api data",apiData)
        setAllData(apiData);
        setSearchResults(apiData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filteredResults = allData.filter(item =>
      item.toLowerCase().includes(term.toLowerCase())
    );

    setSearchResults(filteredResults);
  };

  const handleSelectItem = (item) => {
    setSelectedItems(prevSelectedItems => {
      if (prevSelectedItems.includes(item)) {
        return prevSelectedItems.filter(selectedItem => selectedItem !== item);
      } else {
        return [...prevSelectedItems, item];
      }
    });
  };

  return (
    <div className="discipline-container">
      {loading ? (
        <Loader show="true"/>
      ) : (
        <>
          <div className="top-container">
            <h4><FormattedMessage id="discipline.steps.2" /></h4>
            <button className="discipline btn btn-primary" onClick={handleNext}   disabled={selectedItems.length === 0}>Next</button>
          </div>
          <div className="discipline d-flex justify-content-between">
            <LeftContent />
            <div className="discipline search-container">
              <div className="discipline input-group rounded">
                <input
                  type="search"
                  width="100%"
                  className="discipline form-control rounded search-input"
                  placeholder="Search Discipline"
                  aria-label="Search"
                  aria-describedby="search-addon"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <div className="discipline input-group-append">
                  <span className="discipline input-group-text border-0" id="search-addon">
                    <i className="fas fa-search"></i>
                  </span>
                </div>
              </div>
              <ul className="discipline result-list mt-3">
                {searchResults.map((item, index) => (
                  <li tabindex="0"
                    key={index}
                    className={`result-item ${selectedItems.includes(item) ? "selected" : ""}`}
                    onClick={() => handleSelectItem(item)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter")
                        handleSelectItem(item);
                      }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Discipline
