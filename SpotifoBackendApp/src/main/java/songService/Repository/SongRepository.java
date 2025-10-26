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
    Page<Song> findAllSongsByPopularity(Pageable pageable);

    @Query("SELECT s FROM Song s WHERE " +
            "(:trackName IS NULL OR LOWER(s.trackName) LIKE LOWER(CONCAT('%', :trackName, '%'))) " +
            "AND (:artistNames IS NULL OR LOWER(s.artistNames) LIKE LOWER(CONCAT('%', :artistNames, '%'))) " +
            "AND (:albumName IS NULL OR LOWER(s.albumName) LIKE LOWER(CONCAT('%', :albumName, '%'))) " +
            "AND (:albumReleaseDate IS NULL OR LOWER(s.albumReleaseDate) LIKE LOWER(CONCAT(:albumReleaseDate, '%'))) " +
            "AND s.popularity >= :minPopularity")
    Page<Song> findSongs(Pageable pageable,
                         @Param("trackName") String trackName,
                         @Param("artistNames") String artistNames,
                         @Param("albumName") String albumName,
                         @Param("albumReleaseDate") String albumReleaseDate,
                         @Param("minPopularity") int minPopularity);
}
