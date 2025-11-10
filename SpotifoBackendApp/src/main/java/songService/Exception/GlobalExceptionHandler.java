package songservice.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(SongNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUserNotFound(SongNotFoundException ex){
        logger.error(ex.getMessage());
        ErrorResponse response = new ErrorResponse(
                ex.getMessage(),
                HttpStatus.NOT_FOUND.value(),
                HttpStatus.NOT_FOUND.getReasonPhrase(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(SongAlreadyExistException.class)
    public ResponseEntity<ErrorResponse> handleUserAlreadyExistException(SongAlreadyExistException ex){
        logger.error(ex.getMessage());
        ErrorResponse response = new ErrorResponse(
                ex.getMessage(),
                HttpStatus.CONFLICT.value(),
                HttpStatus.CONFLICT.getReasonPhrase(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(response, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(NoSongFoundException.class)
    public ResponseEntity<ErrorResponse> handleNoUsersFoundException(NoSongFoundException ex){
        logger.error(ex.getMessage());
        ErrorResponse response = new ErrorResponse(
                ex.getMessage(),
                HttpStatus.NO_CONTENT.value(),
                HttpStatus.NO_CONTENT.getReasonPhrase(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(response, HttpStatus.NO_CONTENT);
    }

    @ExceptionHandler(DatabaseException.class)
    public ResponseEntity<ErrorResponse> handleDatabaseException(DatabaseException ex){
        logger.error(ex.getMessage());
        ErrorResponse response = new ErrorResponse(
                ex.getMessage(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex){
        logger.error(ex.getMessage());
        ErrorResponse response = new ErrorResponse(
                "Internal Server Error",
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
