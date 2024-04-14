import React, { useState, useRef, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import './SearchBox.css';

function SearchBox({ searchText, onSearch }) {
  const [searchTerm, setSearchTerm] = useState(searchText || '');
  const debouncedSearch = useDebounce(searchTerm, 1000);

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch]);

  return (
    <div className='col-lg-7'>
      <div className='input-group rounded'>
        <input
          type='text'
          width='100%'
          className='form-control rounded'
          placeholder='Search selected banks'
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
    </div>
  );
}

export default SearchBox;
