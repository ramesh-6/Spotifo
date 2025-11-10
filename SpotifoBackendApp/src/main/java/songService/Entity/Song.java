package songservice.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "songs2025")
public class Song {

    @Id
    @Column(name = "ISRC")
    private String isrc;

    @Column(name = "Track Name")
    private String trackName;

    @Column(name = "Track URI")
    private String trackUri;

    @Column(name = "Artist URI(s)")
    private String artistUris;

    @Column(name = "Artist Name(s)")
    private String artistNames;

    @Column(name = "Album URI")
    private String albumUri;

    @Column(name = "Album Name")
    private String albumName;

    @Column(name = "Album Artist URI(s)")
    private String albumArtistUris;

    @Column(name = "Album Artist Name(s)")
    private String albumArtistNames;

    @Column(name = "Album Release Date")
    private String albumReleaseDate;

    @Column(name = "Album Image URL")
    private String albumImageUrl;

    @Column(name = "Disc Number")
    private Integer discNumber;

    @Column(name = "Track Number")
    private Integer trackNumber;

    @Column(name = "Track Duration (ms)")
    private Integer trackDurationMs;

    @Column(name = "Track Preview URL")
    private String trackPreviewUrl;

    @Column(name = "Explicit")
    private String explicit;

    @Column(name = "Popularity")
    private Integer popularity;

    @Column(name = "Added By")
    private String addedBy;

    @Column(name = "Added At")
    private String addedAt;

    @Column(name = "Artist Genres")
    private String artistGenres;

    @Column(name = "Danceability")
    private Double danceability;

    @Column(name = "Energy")
    private Double energy;

    @Column(name = "Key")
    private Integer key;

    @Column(name = "Loudness")
    private Double loudness;

    @Column(name = "Mode")
    private Integer mode;

    @Column(name = "Speechiness")
    private Double speechiness;

    @Column(name = "Acousticness")
    private Double acousticness;

    @Column(name = "Instrumentalness")
    private Double instrumentalness;

    @Column(name = "Liveness")
    private Double liveness;

    @Column(name = "Valence")
    private Double valence;

    @Column(name = "Tempo")
    private Double tempo;

    @Column(name = "Time Signature")
    private Integer timeSignature;

    @Column(name = "Album Genres")
    private String albumGenres;

    @Column(name = "Label")
    private String label;

    @Column(name = "Copyrights", columnDefinition = "TEXT")
    private String copyrights;

    @OneToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "ISRC", referencedColumnName = "ISRC")
    private SongV2 songV2;
}
