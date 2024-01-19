import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import './Discipline.css';
import Loader from "../../components/common/loader/Loader";

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
    navigate("/home");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos');
        const data = await response.json();
        const titles = data.map(item => item.title);
        setAllData(titles);
        setSearchResults(titles);
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
    const inputWidth = Math.max(200, e.target.scrollWidth);
    document.querySelector('.search-input').style.minWidth = inputWidth + 'px';
    const filteredResults = allData.filter(item =>
      item.toLowerCase().includes(term.toLowerCase())
    );

    setSearchResults(filteredResults);
  };

  const handleSelectItem = (item) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(item)) {
        const newSelectedItems = prevSelectedItems.filter((selectedItem) => selectedItem !== item);
        console.log("Deselected:", item);
        console.log("Selected items:", newSelectedItems);
        return newSelectedItems;
      } else {
        const newSelectedItems = [...prevSelectedItems, item];
        console.log("Selected:", item);
        console.log("Selected items:", newSelectedItems);
        return newSelectedItems;
      }
    });
  };

  return (
    <div className="discipline-container">
      {loading ? (
        <Loader  show="true"/>
      ) : (
        <>
          <div className="top-container">
            <h4><FormattedMessage id="discipline.steps.2" /></h4>
            <button className="discipline btn btn-primary" onClick={handleNext}>Next</button>
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
                  <li
                    key={index}
                    className={`result-item ${selectedItems.includes(item) ? "selected" : ""}`}
                    onClick={() => handleSelectItem(item)}
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

export default Discipline;
