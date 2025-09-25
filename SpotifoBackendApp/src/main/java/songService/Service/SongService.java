package songService.Service;

import org.springframework.data.domain.Page;
import songService.DTO.SongDTO;
import songService.DTO.SongDisplay;

public interface SongService {

    Page<SongDisplay> getAllSongs(int page, int size);

    Page<SongDisplay> getSongs(int page, int size, String sortBy, String sortDirection, String trackName, String artistName, String albumName, String releaseYear, int minPopularity);

    Page<SongDisplay> getSongsBySongName(int page, int size , String trackName);

    Page<SongDisplay> getSongsIncludingSongName(int page, int size , String trackName);

    SongDTO getSongByIsrc(String isrc);

    SongDTO createSong(SongDTO songDTO);
}
