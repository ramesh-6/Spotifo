import React, { useState, useEffect } from 'react';
import './SongDetailModal.css';

const API_BASE_URL = 'http://localhost:8085';

const SongDetailModal = ({ isrc, isOpen, onClose }) => {
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSongDetails = async () => {
    if (!isrc) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/song/${isrc}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSong(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && isrc) {
      fetchSongDetails();
    }
  }, [isOpen, isrc]);

  const formatDuration = (ms) => {
    if (!ms) return 'N/A';
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Song Details</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {loading && <div className="loading">Loading song details...</div>}
          {error && <div className="error">Error: {error}</div>}

          {song && (
            <div className="song-details">
              {/* Album Image */}
              {song.albumImageUrl && (
                <div className="album-image-container">
                  <img 
                    src={song.albumImageUrl} 
                    alt={song.albumName}
                    className="album-image"
                  />
                </div>
              )}

              {/* Basic Info */}
              <div className="basic-info">
                <h3>{song.trackName}</h3>
                <p className="artist">{song.artistNames}</p>
                <p className="album">{song.albumName}</p>
              </div>

              {/* Detailed Info */}
              <div className="detailed-info">
                <div className="info-grid">
                  <div className="info-item">
                    <span className="label">ISRC:</span>
                    <span className="value">{song.isrc}</span>
                  </div>

                  <div className="info-item">
                    <span className="label">Duration:</span>
                    <span className="value">{formatDuration(song.trackDurationMs)}</span>
                  </div>

                  <div className="info-item">
                    <span className="label">Popularity:</span>
                    <span className="value">{song.popularity}/100</span>
                  </div>

                  <div className="info-item">
                    <span className="label">Release Date:</span>
                    <span className="value">{formatDate(song.albumReleaseDate)}</span>
                  </div>

                  <div className="info-item">
                    <span className="label">Explicit:</span>
                    <span className="value">{song.explicit === 'true' ? 'Yes' : 'No'}</span>
                  </div>

                  <div className="info-item">
                    <span className="label">Disc Number:</span>
                    <span className="value">{song.discNumber}</span>
                  </div>

                  <div className="info-item">
                    <span className="label">Track Number:</span>
                    <span className="value">{song.trackNumber}</span>
                  </div>

                  <div className="info-item">
                    <span className="label">Label:</span>
                    <span className="value">{song.label || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Audio Features */}
              {(song.danceability !== undefined || song.energy !== undefined) && (
                <div className="audio-features">
                  <h4>Audio Features</h4>
                  <div className="features-grid">
                    {song.danceability !== undefined && (
                      <div className="feature-item">
                        <span className="feature-label">Danceability:</span>
                        <div className="feature-bar">
                          <div 
                            className="feature-fill" 
                            style={{width: `${song.danceability * 100}%`}}
                          ></div>
                        </div>
                        <span className="feature-value">{(song.danceability * 100).toFixed(1)}%</span>
                      </div>
                    )}

                    {song.energy !== undefined && (
                      <div className="feature-item">
                        <span className="feature-label">Energy:</span>
                        <div className="feature-bar">
                          <div 
                            className="feature-fill" 
                            style={{width: `${song.energy * 100}%`}}
                          ></div>
                        </div>
                        <span className="feature-value">{(song.energy * 100).toFixed(1)}%</span>
                      </div>
                    )}

                    {song.valence !== undefined && (
                      <div className="feature-item">
                        <span className="feature-label">Valence:</span>
                        <div className="feature-bar">
                          <div 
                            className="feature-fill" 
                            style={{width: `${song.valence * 100}%`}}
                          ></div>
                        </div>
                        <span className="feature-value">{(song.valence * 100).toFixed(1)}%</span>
                      </div>
                    )}

                    {song.acousticness !== undefined && (
                      <div className="feature-item">
                        <span className="feature-label">Acousticness:</span>
                        <div className="feature-bar">
                          <div 
                            className="feature-fill" 
                            style={{width: `${song.acousticness * 100}%`}}
                          ></div>
                        </div>
                        <span className="feature-value">{(song.acousticness * 100).toFixed(1)}%</span>
                      </div>
                    )}

                    {song.instrumentalness !== undefined && (
                      <div className="feature-item">
                        <span className="feature-label">Instrumentalness:</span>
                        <div className="feature-bar">
                          <div 
                            className="feature-fill" 
                            style={{width: `${song.instrumentalness * 100}%`}}
                          ></div>
                        </div>
                        <span className="feature-value">{(song.instrumentalness * 100).toFixed(1)}%</span>
                      </div>
                    )}

                    {song.liveness !== undefined && (
                      <div className="feature-item">
                        <span className="feature-label">Liveness:</span>
                        <div className="feature-bar">
                          <div 
                            className="feature-fill" 
                            style={{width: `${song.liveness * 100}%`}}
                          ></div>
                        </div>
                        <span className="feature-value">{(song.liveness * 100).toFixed(1)}%</span>
                      </div>
                    )}

                    {song.speechiness !== undefined && (
                      <div className="feature-item">
                        <span className="feature-label">Speechiness:</span>
                        <div className="feature-bar">
                          <div 
                            className="feature-fill" 
                            style={{width: `${song.speechiness * 100}%`}}
                          ></div>
                        </div>
                        <span className="feature-value">{(song.speechiness * 100).toFixed(1)}%</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Technical Info */}
              <div className="technical-info">
                <h4>Technical Information</h4>
                <div className="info-grid">
                  {song.tempo && (
                    <div className="info-item">
                      <span className="label">Tempo:</span>
                      <span className="value">{song.tempo.toFixed(1)} BPM</span>
                    </div>
                  )}

                  {song.key !== undefined && (
                    <div className="info-item">
                      <span className="label">Key:</span>
                      <span className="value">{song.key}</span>
                    </div>
                  )}

                  {song.mode !== undefined && (
                    <div className="info-item">
                      <span className="label">Mode:</span>
                      <span className="value">{song.mode === 1 ? 'Major' : 'Minor'}</span>
                    </div>
                  )}

                  {song.timeSignature && (
                    <div className="info-item">
                      <span className="label">Time Signature:</span>
                      <span className="value">{song.timeSignature}/4</span>
                    </div>
                  )}

                  {song.loudness && (
                    <div className="info-item">
                      <span className="label">Loudness:</span>
                      <span className="value">{song.loudness.toFixed(2)} dB</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Genres */}
              {(song.artistGenres || song.albumGenres) && (
                <div className="genres-info">
                  <h4>Genres</h4>
                  {song.artistGenres && (
                    <div className="genre-section">
                      <span className="genre-label">Artist Genres:</span>
                      <span className="genre-value">{song.artistGenres}</span>
                    </div>
                  )}
                  {song.albumGenres && (
                    <div className="genre-section">
                      <span className="genre-label">Album Genres:</span>
                      <span className="genre-value">{song.albumGenres}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Preview */}
              {song.trackPreviewUrl && (
                <div className="preview-section">
                  <h4>Preview</h4>
                  <audio controls src={song.trackPreviewUrl}>
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SongDetailModal;