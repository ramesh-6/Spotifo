package songservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SongV2DTO {

    private String isrc;
    private String track;
    private String albumName;
    private String artist;
    private String releaseDate;
    private Integer allTimeRank;
    private Double trackScore;
    private String spotifyStreams;
    private String spotifyPlaylistCount;
    private String spotifyPlaylistReach;
    private Integer spotifyPopularity;
    private String youtubeViews;
    private String youtubeLikes;
    private String tiktokPosts;
    private String tiktokLikes;
    private String tiktokViews;
    private String youtubePlaylistReach;
    private Integer appleMusicPlaylistCount;
    private String airplaySpins;
    private String siriusxmSpins;
    private Integer deezerPlaylistCount;
    private String deezerPlaylistReach;
    private Integer amazonPlaylistCount;
    private String pandoraStreams;
    private String pandoraTrackStations;
    private String soundcloudStreams;
    private String shazamCounts;
    private String tidalPopularity;
    private Integer explicitTrack;
}
