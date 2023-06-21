package kr.co.ddamddam;

import kr.co.ddamddam.common.exception.custom.ErrorCode;
import kr.co.ddamddam.common.exception.custom.NotFoundBoardException;
import kr.co.ddamddam.user.entity.User;
import kr.co.ddamddam.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserUtil {
    
    private final UserRepository userRepository;
    
    public User getUser(Long userIdx) {
        return userRepository.findById(userIdx)
            .orElseThrow(() -> {
                throw new NotFoundBoardException(ErrorCode.NOT_FOUND_USER, userIdx);
            });
    }

}
