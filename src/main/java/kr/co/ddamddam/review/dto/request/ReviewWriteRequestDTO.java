package kr.co.ddamddam.review.dto.request;

import kr.co.ddamddam.company.entity.Company;
import kr.co.ddamddam.review.entity.Review;
import kr.co.ddamddam.user.entity.User;
import lombok.*;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.sql.Timestamp;

// TODO: 취업후기 작성하기
@Getter @Setter
@ToString @EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class ReviewWriteRequestDTO {

    @NotBlank(message = "제목을 입력해주세요.")
    @Size(min = 1, max = 100)
    private String reviewTitle;

    @NotBlank(message = "내용을 입력해주세요.")
    @Size(min = 1, max = 3000)
    private String reviewContent;

    @Min(1)
    private Float reviewRating;

    @NotBlank
    private String reviewJob;


    private int reviewTenure;



//    @NotBlank
    private String companyName;

//    @NotBlank
    private String reviewLocation;




    public Review toEntity(User user){
        Company company = new Company();
        company.setCompanyName(this.companyName);
        company.setCompanyArea(this.reviewLocation);

        return Review.builder()
                .reviewTitle(this.reviewTitle)
                .reviewContent(this.reviewContent)
                .reviewRating(this.reviewRating)
                .reviewJob(this.reviewJob)
                .reviewTenure(this.reviewTenure)
                .reviewLocation(this.reviewLocation)
                .reviewCompany(this.companyName)
                .user(user)
                .build();
    }






}
