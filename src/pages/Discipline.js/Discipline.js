import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import './Discipline.css';

const LeftContent = () => {
  return (
    <div className="left-content">
      <h3><FormattedMessage id="discipline.steps.1" /></h3>
      <p><b><FormattedMessage id="discipline.steps.2" /></b></p>
      <ul>
        <li><FormattedMessage id="discipline.steps.3" /></li>
        <li><FormattedMessage id="discipline.steps.4" /></li>
        <li><FormattedMessage id="discipline.steps.5" /></li>
        <li><FormattedMessage id="discipline.steps.6" /></li>
      </ul>
    </div >
  );
};


const Discipline = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [allData, setAllData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
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
      } catch (error) {
        console.error('Error fetching data:', error);
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
    console.log(document.querySelector('.search-input').offsetWidth);
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between mt-3">
        <LeftContent />
        <div className="search-container">
          <button className="btn btn-primary" onClick={handleNext}>Next</button>
          <div className="input-group rounded">
            <input
              type="search"
              width="100%"
              className="form-control rounded search-input"
              placeholder="Search Discipline"
              aria-label="Search"
              aria-describedby="search-addon"
              value={searchTerm}
              onChange={handleSearch}
            />
            <span className="input-group-text border-0" id="search-addon">
              <i className="fas fa-search"></i>
            </span>
          </div>

          <ul className="result-list mt-3">
            {searchResults.map((item, index) => (
              <li
                key={index}
                className={item === selectedItem ? "selected" : ""}
                onClick={() => handleSelectItem(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Discipline;
