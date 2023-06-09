package kr.co.ddamddam.qna.qnaHashtag.repository;

import kr.co.ddamddam.qna.qnaHashtag.entity.Hashtag;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HashtagRepository extends JpaRepository<Hashtag, Long> {

    Hashtag findByHashtagIdx(Long hashtagIdx);

    Hashtag findByHashtagContent(String hashtag);

    void deleteByQnaQnaIdx(Long qnaIdx);
}
