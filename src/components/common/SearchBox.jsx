import React, { useState, useEffect } from 'react';
import { SEARCH_DEBOUNCE_MS } from '../../utils/constants';

/**
 * Search box with debounced input
 */
const SearchBox = ({ placeholder = 'Search...', value, onChange, debounceMs = SEARCH_DEBOUNCE_MS }) => {
  const [localValue, setLocalValue] = useState(value || '');

  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, debounceMs, onChange, value]);

  return (
    <div className="search-box">
      <i className="bi bi-search search-icon"></i>
      <input
        type="text"
        className="form-control form-control-sm"
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
      />
    </div>
  );
};

export default SearchBox;
