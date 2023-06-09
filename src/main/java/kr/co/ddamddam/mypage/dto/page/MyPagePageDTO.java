package kr.co.ddamddam.mypage.dto.page;

import lombok.*;

/**
 * mypage 패키지 전체에서 사용합니다.
 */

@Setter
@Getter
@ToString
@EqualsAndHashCode
@AllArgsConstructor
@Builder
public class MyPagePageDTO {
    
    private int page;
    private int size;
    
    // 첫 페이지는 1로 지정, 한 페이지에 10개의 게시글 보이도록 지정
    public MyPagePageDTO() {
        this.page = 1;
        this.size = 10;
    }
    
}
