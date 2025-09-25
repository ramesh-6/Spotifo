package songService.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SongDTO {

    private String isrc;
    private String trackName;
    private String trackUri;
    private String artistUris;
    private String artistNames;
    private String albumUri;
    private String albumName;
    private String albumArtistUris;
    private String albumArtistNames;
    private String albumReleaseDate;
    private String albumImageUrl;
    private Integer discNumber;
    private Integer trackNumber;
    private Integer trackDurationMs;
    private String trackPreviewUrl;
    private String explicit;
    private Integer popularity;
    private String addedBy;
    private String addedAt;
    private String artistGenres;
    private Double danceability;
    private Double energy;
    private Integer key;
    private Double loudness;
    private Integer mode;
    private Double speechiness;
    private Double acousticness;
    private Double instrumentalness;
    private Double liveness;
    private Double valence;
    private Double tempo;
    private Integer timeSignature;
    private String albumGenres;
    private String label;
    private String copyrights;

}
