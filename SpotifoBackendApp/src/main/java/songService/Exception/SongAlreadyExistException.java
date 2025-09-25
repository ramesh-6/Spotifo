package songService.Exception;

public class SongAlreadyExistException extends RuntimeException {
    public SongAlreadyExistException(String message) {
        super(message);
    }
}
