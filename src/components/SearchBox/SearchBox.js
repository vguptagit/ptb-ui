import React, { useState } from 'react';

function SearchBox({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  // logic to fetch search results here
  const handleSearch = (event) => {
   
    const value = event.target.value;
    setSearchTerm(value)
    onSearch(value); // Call the onSearch prop function
  };
  const handleSelectItem = (item) => {
    // logic to handle item selection here
  };

  return (
    <div className="col-lg-7">
      <div className="input-group rounded">
        <input
          type="search"
          width="100%"
          className=" form-control rounded search-input"
          placeholder="Search selected banks"
          aria-label="Search"
          aria-describedby="search-addon-noborder"
          value={searchTerm}
          onChange={handleSearch}
        />
        <div className="discipline input-group-append">
        <span
            className="input-group-text bg-transparent border-0"
            id="search-addon-noborder"
          >
          </span>
        </div>
      </div>
      <ul className="result-list mt-3">
        {searchResults.map((item, index) => (
          <li
            key={index}
            className="result-item"
            onClick={() => handleSelectItem(item)}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchBox;