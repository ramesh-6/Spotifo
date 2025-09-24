package songService.Exception;

import org.springframework.dao.DataAccessException;

public class DatabaseException extends RuntimeException {
    public DatabaseException(String message, DataAccessException e) {
        super(message);
    }
}
