package songService.Service;

import org.springframework.data.domain.Page;
import songService.DTO.SongDTO;
import songService.DTO.SongDisplay;

public interface SongService {

    Page<SongDisplay> getAllSongs(int page, int size);

    Page<SongDisplay> getSongs(int page, int size, String sortBy, String sortDirection, String trackName, String artistName, String albumName, String releaseYear, int minPopularity);

    SongDTO getSongByIsrc(String isrc);

    SongDTO createSong(SongDTO songDTO);
}
