package songservice.exception;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class ErrorResponse {
    private String message;
    private int status;
    private String error;
    private LocalDateTime timestamp;

    public ErrorResponse(String message, int status, String error, LocalDateTime timestamp) {
        this.message = message;
        this.status = status;
        this.error = error;
        this.timestamp = timestamp;
    }
}
