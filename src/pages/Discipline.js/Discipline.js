import React, { useEffect, useRef, useState } from "react";
import './Discipline.css';

const Discipline = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [allData, setAllData] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
  
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
      const filteredResults = allData.filter(item =>
        item.toLowerCase().includes(term.toLowerCase())
      );
  
      setSearchResults(filteredResults);
    };
  
    const handleSelectItem = (item) => {
      setSelectedItem(item);
    };
  
    return (
      <div className="container">
        <div className="d-flex justify-content-end mt-3">
          <button className="btn btn-secondary me-2">Secondary</button>
          <button className="btn btn-primary">Primary</button>
        </div>
        <div className="search-container">
          <div className="input-group rounded mt-3" style={{ width: '550px' }}>
            <input
              type="search"
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
    );
  };
export default Discipline;