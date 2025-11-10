package songservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SongDisplay {

    private String isrc;
    private String trackName;
    private String artistNames;
    private String artistUris;
    private String albumName;
    private String albumUri;
    private String albumImageUrl;
}
