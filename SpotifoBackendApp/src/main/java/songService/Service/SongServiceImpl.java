package songService.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import songService.DTO.SongDTO;
import songService.DTO.SongDisplay;
import songService.DTO.SongMapper;
import songService.Entity.Song;
import songService.Exception.DatabaseException;
import songService.Exception.NoSongFoundException;
import songService.Exception.SongAlreadyExistException;
import songService.Exception.SongNotFoundException;
import songService.Repository.SongRepository;

import java.util.Optional;

@Service
@Transactional
public class SongServiceImpl implements SongService {

    private static final Logger logger = LoggerFactory.getLogger(SongServiceImpl.class);
    private final SongRepository songRepository;

    @Autowired
    public SongServiceImpl(SongRepository songRepository) {
        this.songRepository = songRepository;
    }

    @Override
    public SongDTO createSong(SongDTO songDTO) {
        logger.info("Creating song: {}", songDTO);
        try {
            Optional<Song> existingUser = songRepository.findByisrc(songDTO.getIsrc());
            if (existingUser.isPresent()) {
                throw new SongAlreadyExistException("Song already exists with ISRC: " + songDTO.getIsrc());
            }
            Song song = SongMapper.INSTANCE.toEntity(songDTO);
            song.setAcousticness(songDTO.getAcousticness());
            song.setAddedAt(songDTO.getAddedAt());
            return SongMapper.INSTANCE.toDTO(songRepository.save(song));

        } catch (DataAccessException e) {
            logger.error("Database error while creating song: {}", songDTO.getTrackName(), e);
            throw new DatabaseException("Failed to create song", e);
        }
    }


    @Override
    public Page<SongDisplay> getAllSongs(int page, int size) {
        logger.info("Getting all songs by popularity");
        try {
            Pageable pageable = PageRequest.of(page-1, size);
            Page<Song> songPage = songRepository.findAllSongsByPopularity(pageable);
            if (!songPage.isEmpty()) {
                return songPage.map(SongMapper.INSTANCE::toDisplay);
            } else {
                throw new NoSongFoundException("No songs exists in the system");
            }
        } catch (DataAccessException e) {
            logger.error("Database error while fetching all songs", e);
            throw new DatabaseException("Failed to retrieve songs", e);
        }
    }

    @Override
    public Page<SongDisplay> getSongs(int page, int size, String sortBy, String sortDirection, String trackName, String artistName, String albumName, String releaseYear, int minPopularity) {
        logger.info("Getting songs by sort, filter and search");
        try {
            if (sortBy.equalsIgnoreCase("releasedate")){
                sortBy = "albumReleaseDate";
            }
            Sort sort = Sort.by(sortBy);
            if(sortDirection.equalsIgnoreCase("DESC")){
                sort = sort.descending();
            }
            else {
                sort = sort.ascending();
            }
            Pageable pageable = PageRequest.of(page-1, size, sort);
            Page<Song> songPage = songRepository.findSongs(pageable, trackName, artistName, albumName, releaseYear, minPopularity);
            if (!songPage.isEmpty()) {
                return songPage.map(SongMapper.INSTANCE::toDisplay);
            } else {
                throw new NoSongFoundException("No songs exists in the system");
            }
        } catch (DataAccessException e) {
            logger.error("Database error while fetching songs", e);
            throw new DatabaseException("Failed to retrieve songs", e);
        }
    }

    @Override
    public SongDTO getSongByIsrc(String isrc) {
        logger.info("Getting song by ISRC: {}", isrc);
        try {
            Optional<Song> songDB = songRepository.findByisrc(isrc);
            if (songDB.isPresent()) {
                return SongMapper.INSTANCE.toDTO(songDB.get());
            } else {
                throw new SongNotFoundException("song doesn't exist with ISRC: " + isrc);
            }
        } catch (DataAccessException e) {
            logger.error("Database error while fetching song by ISRC", e);
            throw new DatabaseException("Failed to retrieve song by ISRC", e);
        }
    }

}
