package kr.co.ddamddam.project.dto.request;

import kr.co.ddamddam.project.entity.Project;
import kr.co.ddamddam.user.entity.User;
import lombok.*;

import javax.validation.constraints.Max;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProjectWriteDTO {

  @NotNull
  private Long boardWriterIdx;

  @NotBlank
  @Size(max = 100)
  private String boardTitle;
  @NotBlank
  @Size(max = 3000)
  private String boardContent;
  private String projectType;

  //모집인원
  @NotNull @Max(5)
  private int maxFront;
  @NotNull @Max(5)
  private int maxBack;

  private LocalDateTime offerPeriod; //모집기간

  public Project toEntity(User user, String uploadedFilePath) {
    return Project.builder()
        .user(user)
        .userNickname(user.getUserNickname())
        .projectTitle(this.boardTitle)
        .projectImg(uploadedFilePath)
        .projectContent(this.boardContent)
        .projectType(this.projectType)
        .maxFront(this.maxFront)
        .maxBack(this.maxBack)
        .offerPeriod(this.offerPeriod)
        .build();
  }
}
