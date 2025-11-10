package songservice.exception;

public class NoSongFoundException extends RuntimeException {
    public NoSongFoundException(String message) {
        super(message);
    }
}
