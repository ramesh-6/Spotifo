package songservice.dto;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;
import songservice.entity.Song;

@Mapper
public interface SongMapper {

    SongMapper INSTANCE = Mappers.getMapper(SongMapper.class);

    SongDTO toDTO(Song song);

    Song toEntity(SongDTO dto);

    SongDisplay toDisplay(Song song);
}

