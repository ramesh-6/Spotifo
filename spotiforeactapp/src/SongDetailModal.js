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

  const handlePlayOnSpotify = () => {
    if (song?.trackUri) {
      window.open(song.trackUri, '_blank');
    }
  };

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

  const formatNumber = (value) => {
    if (!value || value === 'N/A') return 'N/A';
    const num = parseInt(value);
    if (isNaN(num)) return value;
    return num.toLocaleString();
  };

  const formatLargeNumber = (value) => {
  if (!value || value === 'N/A' || value === null || value === undefined) return 'N/A';
  
  // Convert string to number, removing any commas if present
  let num;
  if (typeof value === 'string') {
    num = parseFloat(value.replace(/,/g, ''));
  } else {
    num = parseFloat(value);
  }
  
  // Check if conversion was successful
  if (isNaN(num)) return value;
  
  // Format based on magnitude
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(2)} B`;
  } else if (num >= 1000000) {
    return `${(num / 1000000).toFixed(2)} M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(2)} K`;
  }
  
  return num.toLocaleString();
};

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <button className="modal-close" onClick={onClose}>×</button>
          <h2 className="song-title">{song?.trackName || 'Loading...'}</h2>
          <p className="song-artist">{song?.artistNames || 'Unknown Artist'}</p>
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
              <h3>⚠️ Error</h3>
              <p>{error}</p>
              <button className="modal-retry-btn" onClick={() => window.location.reload()}>
                Retry
              </button>
            </div>
          )}

          {song && (
            <>
              {/* Album Image */}
              <div className="album-image-section">
                {song.albumImageUrl ? (
                  <div className="album-image">
                    <img src={song.albumImageUrl} alt={song.albumName} />
                  </div>
                ) : (
                  <div className="album-placeholder">🎵</div>
                )}
              </div>

              {/* Play on Spotify Button - NEW SECTION */}
              {song.trackUri && (
                <div className="spotify-button-section">
                  <button className="spotify-play-button" onClick={handlePlayOnSpotify}>
                    <svg className="spotify-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                    </svg>
                    Play on Spotify
                  </button>
                </div>
              )}

              {/* Preview Player */}
              {song.trackPreviewUrl && (
                <div className="preview-section">
                  <div className="audio-wrapper">
                    <audio controls className="preview-audio" src={song.trackPreviewUrl}>
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </div>
              )}

              {/* Basic Track Information */}
              <h3 className="details-heading">Track Information</h3>
              <div className="song-metadata">
                <div className="metadata-item">
                  <span className="metadata-label">ISRC</span>
                  <span className="metadata-value">{song.isrc || 'N/A'}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Duration</span>
                  <span className="metadata-value">{formatDuration(song.trackDurationMs)}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Popularity</span>
                  <span className="metadata-value">{song.popularity || 'N/A'}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Explicit</span>
                  <span className="metadata-value">{song.explicit || 'N/A'}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Disc Number</span>
                  <span className="metadata-value">{song.discNumber || 'N/A'}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Track Number</span>
                  <span className="metadata-value">{song.trackNumber || 'N/A'}</span>
                </div>
              </div>

              {/* Playlist Information */}
              {/* <h3 className="details-heading">Playlist Information</h3>
              <div className="song-metadata">
                <div className="metadata-item">
                  <span className="metadata-label">Added By</span>
                  <span className="metadata-value">{song.addedBy || 'N/A'}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Added At</span>
                  <span className="metadata-value">{formatDate(song.addedAt)}</span>
                </div>
              </div> */}

              {/* SongV2 Data - Platform Statistics */}
              {song.songV2 && (
                <>
                  <h3 className="details-heading">Platform Statistics</h3>
                  
                  {/* Rankings & Scores */}
                  <div className="song-metadata">
                    <div className="metadata-item">
                      <span className="metadata-label">All Time Rank</span>
                      <span className="metadata-value">{formatNumber(song.songV2.allTimeRank)}</span>
                    </div>
                    <div className="metadata-item">
                      <span className="metadata-label">Track Score</span>
                      <span className="metadata-value">{song.songV2.trackScore?.toFixed(2) || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Spotify Statistics */}
                  <h3 className="details-heading">Spotify Metrics</h3>
                  <div className="song-metadata">
                    <div className="metadata-item">
                      <span className="metadata-label">Streams</span>
                      <span className="metadata-value">{formatLargeNumber(song.songV2.spotifyStreams)}</span>
                    </div>
                    <div className="metadata-item">
                      <span className="metadata-label">Playlist Count</span>
                      <span className="metadata-value">{formatNumber(song.songV2.spotifyPlaylistCount)}</span>
                    </div>
                    <div className="metadata-item">
                      <span className="metadata-label">Playlist Reach</span>
                      <span className="metadata-value">{formatLargeNumber(song.songV2.spotifyPlaylistReach)}</span>
                    </div>
                    <div className="metadata-item">
                      <span className="metadata-label">Popularity</span>
                      <span className="metadata-value">{song.songV2.spotifyPopularity || 'N/A'}</span>
                    </div>
                  </div>

                  {/* YouTube Statistics */}
                  <h3 className="details-heading">YouTube Metrics</h3>
                  <div className="song-metadata">
                    <div className="metadata-item">
                      <span className="metadata-label">Views</span>
                      <span className="metadata-value">{formatLargeNumber(song.songV2.youtubeViews)}</span>
                    </div>
                    <div className="metadata-item">
                      <span className="metadata-label">Likes</span>
                      <span className="metadata-value">{formatLargeNumber(song.songV2.youtubeLikes)}</span>
                    </div>
                    <div className="metadata-item">
                      <span className="metadata-label">Playlist Reach</span>
                      <span className="metadata-value">{formatLargeNumber(song.songV2.youtubePlaylistReach)}</span>
                    </div>
                  </div>

                  {/* TikTok Statistics */}
                  <h3 className="details-heading">TikTok Metrics</h3>
                  <div className="song-metadata">
                    <div className="metadata-item">
                      <span className="metadata-label">Posts</span>
                      <span className="metadata-value">{formatLargeNumber(song.songV2.tiktokPosts)}</span>
                    </div>
                    <div className="metadata-item">
                      <span className="metadata-label">Likes</span>
                      <span className="metadata-value">{formatLargeNumber(song.songV2.tiktokLikes)}</span>
                    </div>
                    <div className="metadata-item">
                      <span className="metadata-label">Views</span>
                      <span className="metadata-value">{formatLargeNumber(song.songV2.tiktokViews)}</span>
                    </div>
                  </div>

                  {/* Other Platforms */}
                  <h3 className="details-heading">Other Platform Metrics</h3>
                  <div className="song-metadata">
                    <div className="metadata-item">
                      <span className="metadata-label">Apple Music Playlists</span>
                      <span className="metadata-value">{formatNumber(song.songV2.appleMusicPlaylistCount)}</span>
                    </div>
                    <div className="metadata-item">
                      <span className="metadata-label">Deezer Playlists</span>
                      <span className="metadata-value">{formatNumber(song.songV2.deezerPlaylistCount)}</span>
                    </div>
                    <div className="metadata-item">
                      <span className="metadata-label">Deezer Reach</span>
                      <span className="metadata-value">{formatLargeNumber(song.songV2.deezerPlaylistReach)}</span>
                    </div>
                    <div className="metadata-item">
                      <span className="metadata-label">Amazon Playlists</span>
                      <span className="metadata-value">{formatNumber(song.songV2.amazonPlaylistCount)}</span>
                    </div>
                    <div className="metadata-item">
                      <span className="metadata-label">Pandora Streams</span>
                      <span className="metadata-value">{formatLargeNumber(song.songV2.pandoraStreams)}</span>
                    </div>
                    <div className="metadata-item">
                      <span className="metadata-label">Pandora Stations</span>
                      <span className="metadata-value">{formatNumber(song.songV2.pandoraTrackStations)}</span>
                    </div>
                    <div className="metadata-item">
                      <span className="metadata-label">SoundCloud Streams</span>
                      <span className="metadata-value">{formatLargeNumber(song.songV2.soundcloudStreams)}</span>
                    </div>
                    <div className="metadata-item">
                      <span className="metadata-label">Shazam Counts</span>
                      <span className="metadata-value">{formatLargeNumber(song.songV2.shazamCounts)}</span>
                    </div>
                    <div className="metadata-item">
                      <span className="metadata-label">Airplay Spins</span>
                      <span className="metadata-value">{formatLargeNumber(song.songV2.airplaySpins)}</span>
                    </div>
                    <div className="metadata-item">
                      <span className="metadata-label">SiriusXM Spins</span>
                      <span className="metadata-value">{formatLargeNumber(song.songV2.siriusxmSpins)}</span>
                    </div>
                    <div className="metadata-item">
                      <span className="metadata-label">Tidal Popularity</span>
                      <span className="metadata-value">{song.songV2.tidalPopularity || 'N/A'}</span>
                    </div>
                  </div>
                </>
              )}

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
                  <span className="metadata-label">Valence</span>
                  <span className="metadata-value">{formatPercentage(song.valence)}</span>
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
                  <span className="metadata-label">Speechiness</span>
                  <span className="metadata-value">{formatPercentage(song.speechiness)}</span>
                </div>
              </div>

              {/* Musical Characteristics */}
              <h3 className="details-heading">Musical Characteristics</h3>
              <div className="song-metadata">
                <div className="metadata-item">
                  <span className="metadata-label">Key</span>
                  <span className="metadata-value">{getKeyName(song.key)}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Mode</span>
                  <span className="metadata-value">{getModeName(song.mode)}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Tempo</span>
                  <span className="metadata-value">{song.tempo ? `${song.tempo.toFixed(1)} BPM` : 'N/A'}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Loudness</span>
                  <span className="metadata-value">{song.loudness ? `${song.loudness.toFixed(1)} dB` : 'N/A'}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Time Signature</span>
                  <span className="metadata-value">{song.timeSignature ? `${song.timeSignature}/4` : 'N/A'}</span>
                </div>
              </div>

              {/* Genre Information */}
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

              {/* Album Information */}
              <h3 className="details-heading">Album Information</h3>
              <div className="song-metadata">
                <div className="metadata-item full-width">
                  <span className="metadata-label">Album</span>
                  <span className="metadata-value">{song.albumName || 'N/A'}</span>
                </div>
                <div className="metadata-item full-width">
                  <span className="metadata-label">Album Artists</span>
                  <span className="metadata-value">{song.albumArtistNames || 'N/A'}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Release Date</span>
                  <span className="metadata-value">{formatDate(song.albumReleaseDate)}</span>
                </div>
                <div className="metadata-item">
                  <span className="metadata-label">Label</span>
                  <span className="metadata-value">{song.label || 'N/A'}</span>
                </div>
                {song.copyrights && (
                  <div className="metadata-item full-width">
                    <span className="metadata-label">Copyrights</span>
                    <span className="metadata-value copyright-text">{song.copyrights}</span>
                  </div>
                )}
              </div>

            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SongDetailModal;