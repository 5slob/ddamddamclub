package kr.co.ddamddam.chat.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageResponseDTO {
    private Long messageId;
    private Long roomId;
    private String message;
    private UserResponseDTO sender;
    private UserResponseDTO receiver;
    @JsonFormat(pattern = "a hh:mm")
    private LocalDateTime sentAt;
}
