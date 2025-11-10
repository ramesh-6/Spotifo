package songservice.exception;

public class SongAlreadyExistException extends RuntimeException {
    public SongAlreadyExistException(String message) {
        super(message);
    }
}
