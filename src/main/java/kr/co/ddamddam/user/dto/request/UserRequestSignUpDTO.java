package kr.co.ddamddam.user.dto.request;


import com.fasterxml.jackson.annotation.JsonFormat;
import kr.co.ddamddam.user.entity.User;
import kr.co.ddamddam.user.entity.UserPosition;
import lombok.*;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDate;

@Setter
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "userEmail")
@Builder
public class UserRequestSignUpDTO {

    @NotBlank
    @Email
    private String userEmail;

    @NotBlank
    @Size(min =  8, max = 20)
    private String userPw;

    @NotBlank
    @Size(min=2, max = 5)
    private String userName;

    @NotBlank
    @Size(min=2,max=5)
    private String userNickName;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate userBirth;

    @NotBlank
    private String userPosition;

    @NotNull
    private int userCareer;

    private String userProfile;



    //엔티티로 변경하는 메서드
    public User toEntity(String uploadedFilePath){
        return User.builder()
                .userEmail(this.userEmail)
                .userPassword(this.userPw)
                .userName(this.userName)
                .userBirth(this.userBirth)
                .userCareer(this.userCareer)
                .userNickname(this.userNickName)
                .userPosition(UserPosition.valueOf(this.userPosition))
                .userProfile(uploadedFilePath)
                .build();
    }



}
