import React, { useState, useEffect } from 'react';
import './SongDetailModal.css';

const API_BASE_URL = 'http://localhost:8085';

const SongDetailModal = ({ isrc, onClose }) => {
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch song details when isrc changes
  useEffect(() => {
    if (!isrc) return;

    console.log(`Fetching song details for ISRC: ${isrc}`);

    setLoading(true);
    setError(null);
    setSong(null);

    fetch(`${API_BASE_URL}/song/${isrc}`)
      .then(res => {
        console.log(`Response status for ${isrc}: ${res.status}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log('Song details received:', data);
        setSong(data);
      })
      .catch(err => {
        console.error(`Error fetching song ${isrc}:`, err);
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isrc]);

  // Close modal when clicking backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Close modal with Escape key and prevent body scroll
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  // Helper functions
  const formatDuration = (ms) => {
    if (!ms) return 'N/A';
    const minutes = Math.floor(ms / 60000);
    const seconds = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatPercentage = (value) => {
    if (value === undefined || value === null) return 'N/A';
    return `${(value * 100).toFixed(1)}%`;
  };

  const getKeyName = (key) => {
    const keyNames = ['C', 'C♯/D♭', 'D', 'D♯/E♭', 'E', 'F', 'F♯/G♭', 'G', 'G♯/A♭', 'A', 'A♯/B♭', 'B'];
    return keyNames[key] || 'N/A';
  };

  const getModeName = (mode) => {
    return mode === 1 ? 'Major' : mode === 0 ? 'Minor' : 'N/A';
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>

        {/* Header with song title and artist */}
        <div className="modal-header">
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
          {song && (
            <>
              <h1 className="song-title">{song.trackName || 'Unknown Track'}</h1>
              <p className="song-artist">{song.artistNames || 'Unknown Artist'}</p>
            </>
          )}
        </div>

        {/* Scrollable body with all details */}
        <div className="modal-body">

          {/* Loading State */}
          {loading && (
            <div className="modal-loading">
              <div className="modal-loading-spinner"></div>
              <p>Loading song details...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="modal-error">
              <h3>Oops! Something went wrong</h3>
              <p>{error}</p>
              <button className="modal-retry-btn" onClick={() => window.location.reload()}>
                Retry
              </button>
            </div>
          )}

          {/* Song Details */}
          {song && (
            <>
              {/* Album Image Section */}
              <div className="album-image-section">
                {song.albumImageUrl ? (
                  <div className="album-image">
                    <img 
                      src={song.albumImageUrl} 
                      alt={`${song.albumName || 'Unknown Album'} cover`}
                    />
                  </div>
                ) : (
                  <div className="album-placeholder">
                    🎵
                  </div>
                )}
              </div>

              {/* Preview Audio Player with Dark Wrapper */}
              {song.trackPreviewUrl && (
                <div className="preview-section">
                  <h3 className="details-heading">Preview</h3>
                  <div className="audio-wrapper">
                    <audio controls className="preview-audio">
                      <source src={song.trackPreviewUrl} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </div>
              )}

              {/* Basic Song Information */}
              <h3 className="details-heading">Song Information</h3>
              <div className="song-metadata">
                <div className="metadata-item">
                  <span className="metadata-label">Album</span>
                  <span className="metadata-value">{song.albumName || 'Unknown'}</span>
                </div>

                <div className="metadata-item">
                  <span className="metadata-label">Album Artist</span>
                  <span className="metadata-value">{song.albumArtistNames || 'Unknown'}</span>
                </div>

                <div className="metadata-item">
                  <span className="metadata-label">Release Date</span>
                  <span className="metadata-value">{formatDate(song.albumReleaseDate)}</span>
                </div>

                <div className="metadata-item">
                  <span className="metadata-label">Duration</span>
                  <span className="metadata-value">{formatDuration(song.trackDurationMs)}</span>
                </div>

                <div className="metadata-item">
                  <span className="metadata-label">Track Number</span>
                  <span className="metadata-value">{song.trackNumber || 'N/A'}</span>
                </div>

                <div className="metadata-item">
                  <span className="metadata-label">Disc Number</span>
                  <span className="metadata-value">{song.discNumber || 'N/A'}</span>
                </div>

                <div className="metadata-item">
                  <span className="metadata-label">Popularity</span>
                  <span className="metadata-value">{song.popularity || 'N/A'}</span>
                </div>

                <div className="metadata-item">
                  <span className="metadata-label">Explicit</span>
                  <span className="metadata-value">{song.explicit === "true" ? 'Yes' : 'No'}</span>
                </div>

                <div className="metadata-item">
                  <span className="metadata-label">ISRC</span>
                  <span className="metadata-value">{song.isrc}</span>
                </div>
              </div>

              {/* Audio Features */}
              <h3 className="details-heading">Audio Features</h3>
              <div className="song-metadata">
                <div className="metadata-item">
                  <span className="metadata-label">Danceability</span>
                  <span className="metadata-value">{formatPercentage(song.danceability)}</span>
                </div>

                <div className="metadata-item">
                  <span className="metadata-label">Energy</span>
                  <span className="metadata-value">{formatPercentage(song.energy)}</span>
                </div>

                <div className="metadata-item">
                  <span className="metadata-label">Speechiness</span>
                  <span className="metadata-value">{formatPercentage(song.speechiness)}</span>
                </div>

                <div className="metadata-item">
                  <span className="metadata-label">Acousticness</span>
                  <span className="metadata-value">{formatPercentage(song.acousticness)}</span>
                </div>

                <div className="metadata-item">
                  <span className="metadata-label">Instrumentalness</span>
                  <span className="metadata-value">{formatPercentage(song.instrumentalness)}</span>
                </div>

                <div className="metadata-item">
                  <span className="metadata-label">Liveness</span>
                  <span className="metadata-value">{formatPercentage(song.liveness)}</span>
                </div>

                <div className="metadata-item">
                  <span className="metadata-label">Valence</span>
                  <span className="metadata-value">{formatPercentage(song.valence)}</span>
                </div>

                <div className="metadata-item">
                  <span className="metadata-label">Tempo</span>
                  <span className="metadata-value">
                    {song.tempo ? `${song.tempo.toFixed(0)} BPM` : 'N/A'}
                  </span>
                </div>

                <div className="metadata-item">
                  <span className="metadata-label">Key</span>
                  <span className="metadata-value">{getKeyName(song.key)}</span>
                </div>

                <div className="metadata-item">
                  <span className="metadata-label">Mode</span>
                  <span className="metadata-value">{getModeName(song.mode)}</span>
                </div>

                <div className="metadata-item">
                  <span className="metadata-label">Time Signature</span>
                  <span className="metadata-value">{song.timeSignature ? `${song.timeSignature}/4` : 'N/A'}</span>
                </div>

                <div className="metadata-item">
                  <span className="metadata-label">Loudness</span>
                  <span className="metadata-value">
                    {song.loudness ? `${song.loudness.toFixed(1)} dB` : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Genre Information */}
              {(song.artistGenres || song.albumGenres) && (
                <>
                  <h3 className="details-heading">Genre Information</h3>
                  <div className="song-metadata">
                    {song.artistGenres && (
                      <div className="metadata-item full-width">
                        <span className="metadata-label">Artist Genres</span>
                        <span className="metadata-value">{song.artistGenres}</span>
                      </div>
                    )}

                    {song.albumGenres && (
                      <div className="metadata-item full-width">
                        <span className="metadata-label">Album Genres</span>
                        <span className="metadata-value">{song.albumGenres}</span>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Label & Copyright Information */}
              {(song.label || song.copyrights) && (
                <>
                  <h3 className="details-heading">Label & Copyright</h3>
                  <div className="song-metadata">
                    {song.label && (
                      <div className="metadata-item full-width">
                        <span className="metadata-label">Label</span>
                        <span className="metadata-value">{song.label}</span>
                      </div>
                    )}

                    {song.copyrights && (
                      <div className="metadata-item full-width">
                        <span className="metadata-label">Copyrights</span>
                        <span className="metadata-value copyright-text">{song.copyrights}</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SongDetailModal;