package songService.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import songService.Entity.Song;

import java.util.Optional;

@Repository
public interface SongRepository extends JpaRepository<Song, String> {

    @Query("SELECT s FROM Song s WHERE s.isrc = :isrc")
    Optional<Song> findByisrc(String isrc);

    @Query("SELECT s FROM Song s ORDER BY s.popularity DESC")
    Page<Song> findAllSongsbyPopularity(Pageable pageable);

    @Query("SELECT s FROM Song s WHERE LOWER(s.trackName) LIKE LOWER(CONCAT(:songName, '%'))")
    Page<Song> findByTrackName(@Param("songName") String songName, Pageable pageable);

    @Query("SELECT s FROM Song s WHERE LOWER(s.trackName) LIKE LOWER(CONCAT('%', :songName, '%'))")
    Page<Song> findIncludingTrackName(@Param("songName") String songName, Pageable pageable);

}
