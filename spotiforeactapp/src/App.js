import React, { useState, useEffect } from 'react';
import SongDetailModal from './SongDetailModal';
import './App.css';

const API_BASE_URL = 'http://localhost:8085';

function App() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // Simple search state
  const [searchQuery, setSearchQuery] = useState('');

  // Advanced search state
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState('popularity');
  const [sortDirection, setSortDirection] = useState('DESC');
  const [advancedFilters, setAdvancedFilters] = useState({
    artistname: '',
    albumname: '',
    releaseyear: '',
    minpopularity: 0
  });

  // Modal state
  const [selectedSongIsrc, setSelectedSongIsrc] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // UPDATED: Primary fetchSongs function - uses /songs endpoint first
  const fetchSongs = async () => {
    setLoading(true);
    setError(null);

    try {
      let url;
      const params = new URLSearchParams({
        page: currentPage.toString(),
        size: pageSize.toString()
      });

      if (showAdvancedFilters) {
        // Use advanced search endpoint
        url = `${API_BASE_URL}/song`;
        params.append('sortby', sortBy);
        params.append('sortdirection', sortDirection);

        // Add song name from simple search
        if (searchQuery.trim()) {
          params.append('songname', searchQuery.trim());
        }

        // Add advanced filters
        Object.entries(advancedFilters).forEach(([key, value]) => {
          if (value !== '' && value !== 0) {
            params.append(key, value.toString());
          }
        });
      } else if (searchQuery.trim()) {
        // Use simple search endpoint
        url = `${API_BASE_URL}/song`;
        params.append('songname', searchQuery.trim());
      } else {
        // UPDATED: Use the main songs endpoint that should include album images
        url = `${API_BASE_URL}/songs`;
      }

      console.log(`Fetching: ${url}?${params}`); // Debug log

      const response = await fetch(`${url}?${params}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data); // Debug log

      // UPDATED: Use songs directly from the main endpoint (should already contain albumImageUrl)
      // No more individual API calls for each song
      const songsData = data.content || [];
      setSongs(songsData);
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
  }, [currentPage, pageSize, sortBy, sortDirection, showAdvancedFilters]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchSongs();
  };

  const handleAdvancedFilterChange = (key, value) => {
    setAdvancedFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePopularityChange = (increment) => {
    const currentValue = advancedFilters.minpopularity;
    let newValue = currentValue + increment;
    newValue = Math.max(0, Math.min(100, newValue));
    handleAdvancedFilterChange('minpopularity', newValue);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setAdvancedFilters({
      artistname: '',
      albumname: '',
      releaseyear: '',
      minpopularity: 0
    });
    setSortBy('popularity');
    setSortDirection('DESC');
    setCurrentPage(1);
  };

  // UPDATED: Only fetch individual song details when user clicks on a song
  const handleSongClick = (isrc) => {
    setSelectedSongIsrc(isrc);
    setShowModal(true);
    console.log('Song clicked:', isrc); // Debug log
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSongIsrc(null);
  };

  const toggleAdvancedFilters = () => {
    setShowAdvancedFilters(!showAdvancedFilters);
    if (showAdvancedFilters) {
      setAdvancedFilters({
        artistname: '',
        albumname: '',
        releaseyear: '',
        minpopularity: 0
      });
      setSortBy('popularity');
      setSortDirection('DESC');
    }
  };

  const getGridClass = () => {
    return pageSize >= 5 ? 'songs-grid grid-5-cols' : 'songs-grid';
  };

  // UPDATED: Simplified AlbumImage component - expects albumImageUrl to be in the song object
  const AlbumImage = ({ song }) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const handleImageLoad = () => {
      setImageLoading(false);
    };

    const handleImageError = () => {
      setImageError(true);
      setImageLoading(false);
    };

    // Show placeholder if no image URL or error loading image
    if (!song.albumImageUrl || imageError) {
      return (
        <div className="album-image-wrapper">
          <div className="album-placeholder">
            🎵
          </div>
        </div>
      );
    }

    return (
      <div className="album-image-wrapper">
        {imageLoading && (
          <div className="album-placeholder">
            ⏳
          </div>
        )}
        <img
          src={song.albumImageUrl}
          alt={`${song.albumName || 'Unknown Album'} cover`}
          className={`album-cover ${imageLoading ? 'loading' : ''}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ display: imageLoading ? 'none' : 'block' }}
        />
      </div>
    );
  };

  // Pagination component
  const Pagination = () => {
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (
        let i = Math.max(2, currentPage - delta);
        i <= Math.min(totalPages - 1, currentPage + delta);
        i++
      ) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, '...');
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push('...', totalPages);
      } else {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    return (
      <div className="pagination-container">
        <div className="pagination">
          <button
            className="pagination-button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ← Previous
          </button>

          {getVisiblePages().map((page, index) => (
            <button
              key={index}
              className={`pagination-button ${
                page === currentPage ? 'active' : ''
              }`}
              onClick={() => typeof page === 'number' && handlePageChange(page)}
              disabled={typeof page !== 'number'}
            >
              {page}
            </button>
          ))}

          <button
            className="pagination-button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next →
          </button>
        </div>

        <div className="page-info">
          Showing {songs.length} of {totalElements} songs (Page {currentPage} of {totalPages})
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand" onClick={() => window.location.reload()}>
            <div className="logo">
              <div className="logo-icon">
                <div className="sound-wave">
                  <div className="bar bar1"></div>
                  <div className="bar bar2"></div>
                  <div className="bar bar3"></div>
                  <div className="bar bar4"></div>
                  <div className="bar bar5"></div>
                </div>
              </div>
              <h1 className="logo-text">
                <span className="spot">Spot</span>
                <span className="info">ifo</span>
              </h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="main-content">
        <div className="search-container">
          {/* Search Bar */}
          <div className="search-bar-container">
            <input
              type="text"
              placeholder="Search for songs by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="search-button"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* Search Controls */}
          <div className="search-controls">
            <button
              onClick={toggleAdvancedFilters}
              className={`advanced-toggle-btn ${showAdvancedFilters ? 'active' : ''}`}
            >
              {showAdvancedFilters ? 'Hide Advanced Search' : 'Advanced Search'}
              <span className="arrow">▼</span>
            </button>

            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="page-size-select"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={15}>15 per page</option>
              <option value={20}>20 per page</option>
            </select>

            <button onClick={clearAllFilters} className="clear-all-btn">
              Clear All
            </button>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="advanced-filters-container">
              <div className="advanced-filters">
                <h3 className="filters-title">Advanced Search Options</h3>

                <div className="filters-grid">
                  <div className="filter-group">
                    <label>Artist Name</label>
                    <input
                      type="text"
                      placeholder="Enter artist name"
                      value={advancedFilters.artistname}
                      onChange={(e) => handleAdvancedFilterChange('artistname', e.target.value)}
                      className="filter-input"
                    />
                  </div>

                  <div className="filter-group">
                    <label>Album Name</label>
                    <input
                      type="text"
                      placeholder="Enter album name"
                      value={advancedFilters.albumname}
                      onChange={(e) => handleAdvancedFilterChange('albumname', e.target.value)}
                      className="filter-input"
                    />
                  </div>

                  <div className="filter-group">
                    <label>Release Year</label>
                    <input
                      type="text"
                      placeholder="YYYY"
                      value={advancedFilters.releaseyear}
                      onChange={(e) => handleAdvancedFilterChange('releaseyear', e.target.value)}
                      className="filter-input"
                    />
                  </div>

                  <div className="filter-group">
                    <label>Min Popularity (0-100)</label>
                    <div className="number-input-container">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={advancedFilters.minpopularity}
                        onChange={(e) => handleAdvancedFilterChange('minpopularity', parseInt(e.target.value) || 0)}
                        className="filter-input number-input"
                      />
                      <div className="number-controls">
                        <button
                          className="number-btn number-btn-up"
                          onClick={() => handlePopularityChange(1)}
                          type="button"
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7 14l5-5 5 5z"/>
                          </svg>
                        </button>
                        <button
                          className="number-btn number-btn-down"
                          onClick={() => handlePopularityChange(-1)}
                          type="button"
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7 10l5 5 5-5z"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="filter-group">
                    <label>Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="filter-input"
                    >
                      <option value="popularity">Popularity</option>
                      <option value="releasedate">Release Date</option>
                    </select>
                  </div>

                  <div className="filter-group">
                    <label>Sort Order</label>
                    <select
                      value={sortDirection}
                      onChange={(e) => setSortDirection(e.target.value)}
                      className="filter-input"
                    >
                      <option value="DESC">Descending</option>
                      <option value="ASC">Ascending</option>
                    </select>
                  </div>
                </div>

                <div className="filters-actions">
                  <button onClick={handleSearch} className="apply-filters-btn">
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading songs...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-state">
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && songs.length === 0 && (
          <div className="no-results">
            <h3>No songs found</h3>
            <p>Try adjusting your search terms or filters</p>
          </div>
        )}

        {/* Songs Grid */}
        {!loading && !error && songs.length > 0 && (
          <>
            <div className={getGridClass()}>
              {songs.map((song) => (
                <div
                  key={song.isrc}
                  className="song-card"
                  onClick={() => handleSongClick(song.isrc)}
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleSongClick(song.isrc);
                    }
                  }}
                >
                  <AlbumImage song={song} />
                  <div className="song-info">
                    <h3 className="song-card-title">{song.trackName || 'Unknown Track'}</h3>
                    <p className="song-card-artist">{song.artistNames || 'Unknown Artist'}</p>
                    <p className="song-card-album">{song.albumName || 'Unknown Album'}</p>
                  </div>
                </div>
              ))}
            </div>

            <Pagination />
          </>
        )}
      </div>

      {/* Modal for song details */}
      {showModal && selectedSongIsrc && (
        <SongDetailModal
          isrc={selectedSongIsrc}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default App;