package kr.co.ddamddam.chat.repository;

import kr.co.ddamddam.chat.entity.ChatRoom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    // 추가적인 쿼리 메서드가 필요한 경우 작성
    List<ChatRoom> findByMentorMentorIdx(Long mentorIdx);
    // userID로 채팅방 목록 조회
    List<ChatRoom> findBySenderUserIdx(Long userIdx);
    Page<ChatRoom> findBySenderUserIdx(Long userIdx, Pageable pageable);
    // 멘티의 아이디로 채팅방 찾기
    ChatRoom findByMentorMentorIdxAndSenderUserIdx(Long mentorIdx, Long senderIdx);
    ChatRoom findByMentorMentorIdxAndReceiverUserIdxAndSenderUserIdx(Long mentorIdx, Long receiverIdx, Long senderIdx);
}