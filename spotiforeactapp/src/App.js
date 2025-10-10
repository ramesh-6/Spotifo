import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = 'http://localhost:8085';

function App() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Sorting state
  const [sortBy, setSortBy] = useState('popularity');
  const [sortDirection, setSortDirection] = useState('DESC');

  // Filter state
  const [filters, setFilters] = useState({
    songname: '',
    artistname: '',
    albumname: '',
    releaseyear: '',
    minpopularity: 0
  });

  // Search mode state
  const [searchMode, setSearchMode] = useState('advanced'); // 'advanced', 'simple', 'including'

  const fetchSongs = async () => {
    setLoading(true);
    setError(null);

    try {
      let url;
      const params = new URLSearchParams({
        page: currentPage.toString(),
        size: pageSize.toString()
      });

      if (searchMode === 'advanced') {
        url = `${API_BASE_URL}/song`;
        params.append('sortby', sortBy);
        params.append('sortdirection', sortDirection);

        // Add filters
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== '' && value !== 0) {
            params.append(key, value.toString());
          }
        });
      } else if (searchMode === 'simple') {
        url = `${API_BASE_URL}/songs/search`;
        if (filters.songname) {
          params.append('songname', filters.songname);
        }
      } else if (searchMode === 'including') {
        url = `${API_BASE_URL}/songs/search/including`;
        if (filters.songname) {
          params.append('songname', filters.songname);
        }
      } else {
        url = `${API_BASE_URL}/songs`;
      }

      const response = await fetch(`${url}?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setSongs(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);

    } catch (err) {
      setError(err.message);
      setSongs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, [currentPage, pageSize, sortBy, sortDirection, searchMode]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchSongs();
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(prev => prev === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(field);
      setSortDirection('ASC');
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const clearFilters = () => {
    setFilters({
      songname: '',
      artistname: '',
      albumname: '',
      releaseyear: '',
      minpopularity: 0
    });
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>Spotifo - Music Database</h1>
      </header>

      <div className="controls-container">
        {/* Search Mode Selection */}
        <div className="search-mode-section">
          <h3>Search Mode</h3>
          <div className="search-mode-buttons">
            <button 
              className={searchMode === 'advanced' ? 'active' : ''}
              onClick={() => setSearchMode('advanced')}
            >
              Advanced Search
            </button>
            <button 
              className={searchMode === 'simple' ? 'active' : ''}
              onClick={() => setSearchMode('simple')}
            >
              Simple Search
            </button>
            <button 
              className={searchMode === 'including' ? 'active' : ''}
              onClick={() => setSearchMode('including')}
            >
              Including Search
            </button>
            <button 
              className={searchMode === 'all' ? 'active' : ''}
              onClick={() => setSearchMode('all')}
            >
              All Songs
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <h3>Filters</h3>
          <div className="filters-grid">
            <div className="filter-group">
              <label>Song Name:</label>
              <input
                type="text"
                value={filters.songname}
                onChange={(e) => handleFilterChange('songname', e.target.value)}
                placeholder="Enter song name"
              />
            </div>

            {searchMode === 'advanced' && (
              <>
                <div className="filter-group">
                  <label>Artist Name:</label>
                  <input
                    type="text"
                    value={filters.artistname}
                    onChange={(e) => handleFilterChange('artistname', e.target.value)}
                    placeholder="Enter artist name"
                  />
                </div>

                <div className="filter-group">
                  <label>Album Name:</label>
                  <input
                    type="text"
                    value={filters.albumname}
                    onChange={(e) => handleFilterChange('albumname', e.target.value)}
                    placeholder="Enter album name"
                  />
                </div>

                <div className="filter-group">
                  <label>Release Year:</label>
                  <input
                    type="text"
                    value={filters.releaseyear}
                    onChange={(e) => handleFilterChange('releaseyear', e.target.value)}
                    placeholder="YYYY"
                  />
                </div>

                <div className="filter-group">
                  <label>Min Popularity:</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={filters.minpopularity}
                    onChange={(e) => handleFilterChange('minpopularity', parseInt(e.target.value) || 0)}
                  />
                </div>
              </>
            )}
          </div>

          <div className="filter-actions">
            <button onClick={handleSearch} className="search-btn">Search</button>
            <button onClick={clearFilters} className="clear-btn">Clear Filters</button>
          </div>
        </div>

        {/* Sorting (only for advanced mode) */}
        {searchMode === 'advanced' && (
          <div className="sorting-section">
            <h3>Sorting</h3>
            <div className="sorting-controls">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="popularity">Popularity</option>
                <option value="trackName">Track Name</option>
                <option value="artistNames">Artist Names</option>
                <option value="albumName">Album Name</option>
              </select>
              <button 
                onClick={() => setSortDirection(prev => prev === 'ASC' ? 'DESC' : 'ASC')}
                className="sort-direction-btn"
              >
                {sortDirection === 'ASC' ? '↑ Ascending' : '↓ Descending'}
              </button>
            </div>
          </div>
        )}

        {/* Page Size */}
        <div className="page-size-section">
          <label>Items per page:</label>
          <select value={pageSize} onChange={(e) => setPageSize(parseInt(e.target.value))}>
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
            <option value={48}>48</option>
          </select>
        </div>
      </div>

      {/* Results Info */}
      <div className="results-info">
        <p>
          Showing {songs.length} of {totalElements} songs 
          (Page {currentPage} of {totalPages})
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading">
          <p>Loading songs...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error">
          <p>Error: {error}</p>
        </div>
      )}

      {/* Songs Table */}
      {!loading && !error && (
        <div className="songs-container">
          <table className="songs-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('trackName')}>
                  Track Name 
                  {sortBy === 'trackName' && (
                    <span className="sort-indicator">
                      {sortDirection === 'ASC' ? ' ↑' : ' ↓'}
                    </span>
                  )}
                </th>
                <th onClick={() => handleSort('artistNames')}>
                  Artist Names
                  {sortBy === 'artistNames' && (
                    <span className="sort-indicator">
                      {sortDirection === 'ASC' ? ' ↑' : ' ↓'}
                    </span>
                  )}
                </th>
                <th onClick={() => handleSort('albumName')}>
                  Album Name
                  {sortBy === 'albumName' && (
                    <span className="sort-indicator">
                      {sortDirection === 'ASC' ? ' ↑' : ' ↓'}
                    </span>
                  )}
                </th>
                <th>ISRC</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {songs.map((song) => (
                <tr key={song.isrc}>
                  <td className="track-name">{song.trackName}</td>
                  <td className="artist-names">{song.artistNames}</td>
                  <td className="album-name">{song.albumName}</td>
                  <td className="isrc">{song.isrc}</td>
                  <td className="actions">
                    <button 
                      className="view-btn"
                      onClick={() => alert(`View details for ${song.trackName}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {songs.length === 0 && (
            <div className="no-results">
              <p>No songs found.</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            First
          </button>
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {/* Page numbers */}
          <div className="page-numbers">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={currentPage === pageNum ? 'active' : ''}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
          <button 
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            Last
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
