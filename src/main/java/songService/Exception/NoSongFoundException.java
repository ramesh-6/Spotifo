package songService.Exception;

public class NoSongFoundException extends RuntimeException {
    public NoSongFoundException(String message) {
        super(message);
    }
}
