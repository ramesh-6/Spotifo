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

  // Enhanced fetchSongs to get detailed song data with album images
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
        url = `${API_BASE_URL}/songs/search/including`;
        params.append('songname', searchQuery.trim());
      } else {
        // Get all songs
        url = `${API_BASE_URL}/songs`;
      }

      const response = await fetch(`${url}?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Enhanced songs with image data
      const enhancedSongs = await Promise.all(
        (data.content || []).map(async (song) => {
          try {
            // If we don't have albumImageUrl from the list endpoint, 
            // fetch detailed song info to get the image
            if (!song.albumImageUrl && song.isrc) {
              const detailResponse = await fetch(`${API_BASE_URL}/song/${song.isrc}`);
              if (detailResponse.ok) {
                const detailData = await detailResponse.json();
                return {
                  ...song,
                  albumImageUrl: detailData.albumImageUrl
                };
              }
            }
            return song;
          } catch (err) {
            console.warn(`Failed to fetch details for song ${song.isrc}:`, err);
            return song;
          }
        })
      );

      setSongs(enhancedSongs);
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

  // Component for rendering album image with fallback
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

    if (!song.albumImageUrl || imageError) {
      return (
        <div 
          className="song-card-image album-placeholder"
          style={{
            backgroundColor: 'var(--spotify-darker)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '3rem',
            color: 'var(--spotify-light-gray)',
            border: '1px solid rgba(179, 179, 179, 0.1)'
          }}
        >
          🎵
        </div>
      );
    }

    return (
      <div className="album-image-wrapper">
        {imageLoading && (
          <div 
            className="song-card-image album-placeholder"
            style={{
              backgroundColor: 'var(--spotify-darker)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              color: 'var(--spotify-light-gray)',
              position: 'absolute',
              inset: 0
            }}
          >
            ⏳
          </div>
        )}
        <img
          src={song.albumImageUrl}
          alt={`${song.albumName} by ${song.artistNames}`}
          className="song-card-image album-cover"
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{
            opacity: imageLoading ? 0 : 1,
            transition: 'opacity 0.3s ease'
          }}
        />
      </div>
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="pagination-container">
        <div className="pagination">
          <button 
            className="pagination-button"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            aria-label="First page"
          >
            ««
          </button>
          <button 
            className="pagination-button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            «
          </button>

          {pages.map(page => (
            <button
              key={page}
              className={`pagination-button ${currentPage === page ? 'active' : ''}`}
              onClick={() => handlePageChange(page)}
              aria-label={`Page ${page}`}
            >
              {page}
            </button>
          ))}

          <button 
            className="pagination-button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next page"
          >
            »
          </button>
          <button 
            className="pagination-button"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            aria-label="Last page"
          >
            »»
          </button>
        </div>

        <div className="page-info">
          Page {currentPage} of {totalPages} • {totalElements} total songs
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      {/* Fixed Navbar */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
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
                <span className="spot">Spot</span><span className="info">ifo</span>
              </h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="main-content">
        {/* Search Container */}
        <div className="search-container">
          {/* Main Search Bar */}
          <div className="search-bar-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search for song"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              className="search-button" 
              onClick={handleSearch}
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
              <span className={`arrow ${showAdvancedFilters ? 'up' : 'down'}`}>
                {showAdvancedFilters ? '▲' : '▼'}
              </span>
            </button>

            <select 
              value={pageSize} 
              onChange={(e) => {
                setPageSize(parseInt(e.target.value));
                setCurrentPage(1);
              }}
              className="page-size-select"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={15}>15 per page</option>
              <option value={20}>20 per page</option>
              <option value={25}>25 per page</option>
              <option value={30}>30 per page</option>
            </select>

            {(searchQuery || showAdvancedFilters) && (
              <button
                onClick={clearAllFilters}
                className="clear-all-btn"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Advanced Filters Dropdown */}
          {showAdvancedFilters && (
            <div className="advanced-filters-container">
              <div className="advanced-filters">
                <h3 className="filters-title">Advanced Search Options</h3>

                <div className="filters-grid">
                  <div className="filter-group">
                    <label>Artist Name</label>
                    <input
                      className="filter-input"
                      type="text"
                      value={advancedFilters.artistname}
                      onChange={(e) => handleAdvancedFilterChange('artistname', e.target.value)}
                      placeholder="Enter artist name"
                    />
                  </div>

                  <div className="filter-group">
                    <label>Album Name</label>
                    <input
                      className="filter-input"
                      type="text"
                      value={advancedFilters.albumname}
                      onChange={(e) => handleAdvancedFilterChange('albumname', e.target.value)}
                      placeholder="Enter album name"
                    />
                  </div>

                  <div className="filter-group">
                    <label>Release Year</label>
                    <input
                      className="filter-input"
                      type="text"
                      value={advancedFilters.releaseyear}
                      onChange={(e) => handleAdvancedFilterChange('releaseyear', e.target.value)}
                      placeholder="YYYY"
                    />
                  </div>

                  <div className="filter-group">
                    <label>Min Popularity (0-100)</label>
                    <div className="number-input-container">
                      <input
                        className="filter-input number-input"
                        type="number"
                        min="0"
                        max="100"
                        value={advancedFilters.minpopularity}
                        onChange={(e) => handleAdvancedFilterChange('minpopularity', parseInt(e.target.value) || 0)}
                        placeholder="0"
                      />
                      <div className="number-controls">
                        <button
                          type="button"
                          className="number-btn number-btn-up"
                          onClick={() => handlePopularityChange(1)}
                          aria-label="Increase popularity"
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M6 3L9 7H3L6 3Z" fill="currentColor"/>
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="number-btn number-btn-down"
                          onClick={() => handlePopularityChange(-1)}
                          aria-label="Decrease popularity"
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M6 9L3 5H9L6 9Z" fill="currentColor"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="filter-group">
                    <label>Sort By</label>
                    <select 
                      className="filter-input"
                      value={sortBy} 
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="popularity">Popularity</option>
                      <option value="trackName">Track Name</option>
                      <option value="artistNames">Artist Names</option>
                      <option value="albumName">Album Name</option>
                    </select>
                  </div>

                  <div className="filter-group">
                    <label>Sort Order</label>
                    <select 
                      className="filter-input"
                      value={sortDirection} 
                      onChange={(e) => setSortDirection(e.target.value)}
                    >
                      <option value="DESC">Descending</option>
                      <option value="ASC">Ascending</option>
                    </select>
                  </div>
                </div>

                <div className="filters-actions">
                  <button 
                    onClick={handleSearch} 
                    className="apply-filters-btn"
                  >
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
            <button onClick={fetchSongs} className="search-button">
              Try Again
            </button>
          </div>
        )}

        {/* Songs Grid */}
        {!loading && !error && (
          <>
            {songs.length === 0 ? (
              <div className="no-results">
                <h3>No songs found</h3>
                <p>Try adjusting your search terms or filters</p>
              </div>
            ) : (
              <div className={getGridClass()}>
                {songs.map((song) => (
                  <div
                    key={song.isrc}
                    className="song-card"
                    onClick={() => handleSongClick(song.isrc)}
                    tabIndex="0"
                    role="button"
                    aria-label={`View details for ${song.trackName} by ${song.artistNames}`}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleSongClick(song.isrc);
                      }
                    }}
                  >
                    {/* Album Image with fallback */}
                    <AlbumImage song={song} />

                    <div className="song-card-title">{song.trackName}</div>
                    <div className="song-card-artist">{song.artistNames}</div>
                    <div className="song-card-album">{song.albumName}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {renderPagination()}
          </>
        )}
      </main>

      {/* Song Detail Modal - IMPORTANT: This is at the end of App, not inside any other component */}
      <SongDetailModal
        isrc={selectedSongIsrc}
        isOpen={showModal}
        onClose={closeModal}
      />
    </div>
  );
}

export default App;