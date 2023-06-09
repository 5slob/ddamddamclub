package kr.co.ddamddam.project.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum  ExceptionEnum {

  INVALID_PARAMETER(HttpStatus.BAD_REQUEST, "400", "Invalid Parameter Values Or Duplicated Key Values"),
  UNAUTHORIZED_ACCESS(HttpStatus.UNAUTHORIZED, "401", "Token Is Required🤬"),
  MESSAGE_NOT_FOUND(HttpStatus.NOT_FOUND, "404", "Unable to Find Message By Given Message ID"),
  USER_NOT_EXIST(HttpStatus.NOT_FOUND, "404", "User Does Not Exist With Given User ID"),
  INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "500", "Internal Server Error Occurred")
  ;


  private final HttpStatus status;
  private final String code;
  private final String message;

  private ExceptionEnum(HttpStatus status, String code, String message) {
    this.status = status;
    this.code = code;
    this.message = message;
  }

}
