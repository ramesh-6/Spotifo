package songservice.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "songs2024")
public class SongV2 {

    @Id
    @Column(name = "ISRC")
    private String isrc;

    @Column(name = "Track")
    private String track;

    @Column(name = "Album Name")
    private String albumName;

    @Column(name = "Artist")
    private String artist;

    @Column(name = "Release Date")
    private String releaseDate;

    @Column(name = "All Time Rank")
    private Integer allTimeRank;

    @Column(name = "Track Score")
    private Double trackScore;

    @Column(name = "Spotify Streams")
    private String spotifyStreams;

    @Column(name = "Spotify Playlist Count")
    private String spotifyPlaylistCount;

    @Column(name = "Spotify Playlist Reach")
    private String spotifyPlaylistReach;

    @Column(name = "Spotify Popularity")
    private Integer spotifyPopularity;

    @Column(name = "YouTube Views")
    private String youtubeViews;

    @Column(name = "YouTube Likes")
    private String youtubeLikes;

    @Column(name = "TikTok Posts")
    private String tiktokPosts;

    @Column(name = "TikTok Likes")
    private String tiktokLikes;

    @Column(name = "TikTok Views")
    private String tiktokViews;

    @Column(name = "YouTube Playlist Reach")
    private String youtubePlaylistReach;

    @Column(name = "Apple Music Playlist Count")
    private Integer appleMusicPlaylistCount;

    @Column(name = "AirPlay Spins")
    private String airplaySpins;

    @Column(name = "SiriusXM Spins")
    private String siriusxmSpins;

    @Column(name = "Deezer Playlist Count")
    private Integer deezerPlaylistCount;

    @Column(name = "Deezer Playlist Reach")
    private String deezerPlaylistReach;

    @Column(name = "Amazon Playlist Count")
    private Integer amazonPlaylistCount;

    @Column(name = "Pandora Streams")
    private String pandoraStreams;

    @Column(name = "Pandora Track Stations")
    private String pandoraTrackStations;

    @Column(name = "Soundcloud Streams")
    private String soundcloudStreams;

    @Column(name = "Shazam Counts")
    private String shazamCounts;

    @Column(name = "TIDAL Popularity")
    private String tidalPopularity;

    @Column(name = "Explicit Track")
    private Integer explicitTrack;
}
