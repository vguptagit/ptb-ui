import React, { useState, useRef, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import './SearchBox.css';

function SearchBox({ placeholder, searchText, onSearch }) {
  const [searchTerm, setSearchTerm] = useState(searchText || '');
  const debouncedSearch = useDebounce(searchTerm);

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch]);

  return (
    <div className='input-group rounded'>
      <input
        type='text'
        width='100%'
        className='form-control rounded'
        placeholder={placeholder || 'Search...'}
        aria-label='Search'
        aria-describedby='search-addon-noborder'
        value={searchTerm}
        onChange={event => setSearchTerm(event.target.value)}
      />
      <div className='input-group-append'>
        <span className='input-group-icon border-0'>
          {searchTerm ? (
            <i className='fas fa-times pointer' onClick={() => setSearchTerm('')}></i>
          ) : (
            <i className='fas fa-search'></i>
          )}
        </span>
      </div>
    </div>
  );
}

export default SearchBox;
