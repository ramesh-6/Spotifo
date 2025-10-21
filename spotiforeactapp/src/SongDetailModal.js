import React, { useState, useEffect } from 'react';
import './SongDetailModal.css';

const API_BASE_URL = 'http://localhost:8085';

const SongDetailModal = ({ isrc, isOpen, onClose }) => {
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !isrc) return;

    setLoading(true);
    setError(null);

    fetch(`${API_BASE_URL}/song/${isrc}`)
      .then(res => {
        if (!res.ok) throw new Error('HTTP error! status: ' + res.status);
        return res.json();
      })
      .then(data => setSong(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [isOpen, isrc]);

  // Formatter functions
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

  // Don't render if modal is not open
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header with song title and artist */}
        <div className="modal-header">
          <div className="song-title">
            {song ? song.trackName : 'Song Details'}
          </div>
          {song && (
            <div className="song-artist">
              {song.artistNames}
            </div>
          )}
          <button 
            className="modal-close" 
            onClick={onClose} 
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {loading && (
            <div className="modal-loading">
              <div className="modal-loading-spinner"></div>
              <p>Loading song details...</p>
            </div>
          )}

          {error && (
            <div className="modal-error">
              <h3>Error Loading Song</h3>
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="modal-retry-btn"
              >
                Try Again
              </button>
            </div>
          )}

          {song && (
            <>
              {/* Album Image */}
              <div className="album-image-section">
                <div className="album-image">
                  {song.albumImageUrl ? (
                    <img 
                      src={song.albumImageUrl} 
                      alt={song.albumName}
                    />
                  ) : (
                    <div className="album-placeholder">🎵</div>
                  )}
                </div>
              </div>

              {/* Basic Song Metadata */}
              <div className="song-metadata">
                <div className="metadata-item">
                  <span className="metadata-label">Duration</span>
                  <span className="metadata-value">
                    {formatDuration(song.trackDurationMs)}
                  </span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Popularity</span>
                  <span className="metadata-value">
                    {song.popularity}/100
                  </span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Release Date</span>
                  <span className="metadata-value">
                    {formatDate(song.albumReleaseDate)}
                  </span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Explicit</span>
                  <span className="metadata-value">
                    {song.explicit === 'true' || song.explicit === true ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Track Number</span>
                  <span className="metadata-value">
                    {song.trackNumber}
                  </span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">ISRC</span>
                  <span className="metadata-value" style={{ fontFamily: 'monospace' }}>
                    {song.isrc}
                  </span>
                </div>
              </div>

              {/* Audio Preview */}
              {song.trackPreviewUrl && (
                <div className="preview-section">
                  <audio
                    controls
                    src={song.trackPreviewUrl}
                    style={{
                      width: '100%',
                      maxWidth: '400px',
                      borderRadius: '12px',
                      background: 'rgba(40, 40, 40, 0.6)'
                    }}
                  >
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}

              {/* Audio Features */}
              {(typeof song.danceability !== 'undefined' || typeof song.energy !== 'undefined') && (
                <>
                  <div className="details-heading">Audio Features</div>
                  <div className="song-metadata">
                    {typeof song.danceability !== 'undefined' && (
                      <div className="metadata-item">
                        <span className="metadata-label">Danceability</span>
                        <span className="metadata-value">
                          {formatPercentage(song.danceability)}
                        </span>
                      </div>
                    )}
                    {typeof song.energy !== 'undefined' && (
                      <div className="metadata-item">
                        <span className="metadata-label">Energy</span>
                        <span className="metadata-value">
                          {formatPercentage(song.energy)}
                        </span>
                      </div>
                    )}
                    {typeof song.valence !== 'undefined' && (
                      <div className="metadata-item">
                        <span className="metadata-label">Valence</span>
                        <span className="metadata-value">
                          {formatPercentage(song.valence)}
                        </span>
                      </div>
                    )}
                    {typeof song.acousticness !== 'undefined' && (
                      <div className="metadata-item">
                        <span className="metadata-label">Acousticness</span>
                        <span className="metadata-value">
                          {formatPercentage(song.acousticness)}
                        </span>
                      </div>
                    )}
                    {typeof song.instrumentalness !== 'undefined' && (
                      <div className="metadata-item">
                        <span className="metadata-label">Instrumentalness</span>
                        <span className="metadata-value">
                          {formatPercentage(song.instrumentalness)}
                        </span>
                      </div>
                    )}
                    {typeof song.liveness !== 'undefined' && (
                      <div className="metadata-item">
                        <span className="metadata-label">Liveness</span>
                        <span className="metadata-value">
                          {formatPercentage(song.liveness)}
                        </span>
                      </div>
                    )}
                    {typeof song.speechiness !== 'undefined' && (
                      <div className="metadata-item">
                        <span className="metadata-label">Speechiness</span>
                        <span className="metadata-value">
                          {formatPercentage(song.speechiness)}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Technical Information */}
              {(song.tempo || typeof song.key !== 'undefined' || song.loudness) && (
                <>
                  <div className="details-heading">Technical Information</div>
                  <div className="song-metadata">
                    {song.tempo && (
                      <div className="metadata-item">
                        <span className="metadata-label">Tempo</span>
                        <span className="metadata-value">
                          {song.tempo.toFixed(1)} BPM
                        </span>
                      </div>
                    )}
                    {typeof song.key !== 'undefined' && (
                      <div className="metadata-item">
                        <span className="metadata-label">Key</span>
                        <span className="metadata-value">
                          {song.key}
                        </span>
                      </div>
                    )}
                    {typeof song.mode !== 'undefined' && (
                      <div className="metadata-item">
                        <span className="metadata-label">Mode</span>
                        <span className="metadata-value">
                          {song.mode === 1 ? 'Major' : 'Minor'}
                        </span>
                      </div>
                    )}
                    {song.timeSignature && (
                      <div className="metadata-item">
                        <span className="metadata-label">Time Signature</span>
                        <span className="metadata-value">
                          {song.timeSignature}/4
                        </span>
                      </div>
                    )}
                    {song.loudness && (
                      <div className="metadata-item">
                        <span className="metadata-label">Loudness</span>
                        <span className="metadata-value">
                          {song.loudness.toFixed(2)} dB
                        </span>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Additional Information */}
              {(song.artistGenres || song.label || song.copyrights) && (
                <>
                  <div className="details-heading">Additional Information</div>
                  <div className="song-metadata">
                    {song.artistGenres && (
                      <div className="metadata-item">
                        <span className="metadata-label">Artist Genres</span>
                        <span className="metadata-value">
                          {song.artistGenres}
                        </span>
                      </div>
                    )}
                    {song.label && (
                      <div className="metadata-item">
                        <span className="metadata-label">Label</span>
                        <span className="metadata-value">
                          {song.label}
                        </span>
                      </div>
                    )}
                    {song.copyrights && (
                      <div className="metadata-item">
                        <span className="metadata-label">Copyright</span>
                        <span className="metadata-value">
                          {song.copyrights}
                        </span>
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