package songService.Controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import songService.DTO.SongDTO;
import songService.DTO.SongDisplay;
import songService.Service.SongService;

@RestController
public class SongController {

    private static final Logger logger = LoggerFactory.getLogger(SongController.class);
    private final SongService songService;

    @Autowired
    public SongController(SongService songService) {
        this.songService = songService;
    }

    @GetMapping("/songs")
    public ResponseEntity<Page<SongDisplay>> getAllSongs(@RequestParam(name = "page", required = false, defaultValue = "1") int page,
                                                         @RequestParam(name = "size", required = false, defaultValue = "12") int size) {
        logger.info("Received Request to get all songs");
        Page<SongDisplay> songDisplays = songService.getAllSongs(page, size);
        return ResponseEntity.ok(songDisplays);
    }

    @GetMapping("/songs/search")
    public ResponseEntity<Page<SongDisplay>> getSongsBySongName(@RequestParam(required = false, defaultValue = "1") int page,
                                                      @RequestParam(required = false, defaultValue = "12") int size,
                                                      @RequestParam(required = false, defaultValue = "") String songname) {
        logger.info("Received Request to get songs by song name");
        Page<SongDisplay> songDisplays = songService.getSongsBySongName(page, size, songname);
        return ResponseEntity.ok(songDisplays);
    }

    @GetMapping("/songs/search/including")
    public ResponseEntity<Page<SongDisplay>> getSongsIncludingSongName(@RequestParam(required = false, defaultValue = "1") int page,
                                                                @RequestParam(required = false, defaultValue = "12") int size,
                                                                @RequestParam(required = false, defaultValue = "") String songname) {
        logger.info("Received Request to get songs including song name");
        Page<SongDisplay> songDisplays = songService.getSongsIncludingSongName(page, size, songname);
        return ResponseEntity.ok(songDisplays);
    }

    @GetMapping("/song/{isrc}")
    public ResponseEntity<SongDTO> getSongByIsrc(@PathVariable String isrc) {
        logger.info("Received Request to get song by ISRC: {}", isrc);
        return ResponseEntity.ok(songService.getSongByIsrc(isrc));
    }

    @PostMapping("/song")
    public ResponseEntity<SongDTO> createSong(@RequestBody SongDTO songDTO) {
        logger.info("Received Request to create user");
        return new ResponseEntity<>(songService.createSong(songDTO), HttpStatus.CREATED);
    }
}
