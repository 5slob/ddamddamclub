package kr.co.ddamddam.project.api;

import kr.co.ddamddam.common.exception.custom.UnauthorizationException;
import kr.co.ddamddam.common.response.ApplicationResponse;
import kr.co.ddamddam.config.security.TokenUserInfo;
import kr.co.ddamddam.project.dto.response.ProjectDetailResponseDTO;
import kr.co.ddamddam.project.entity.Project;
import kr.co.ddamddam.project.service.ApplicantService;
import kr.co.ddamddam.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ddamddam/project/applicant")
@Slf4j
public class ApplicantApiController {

    private final ApplicantService applicantService;

    /**
     * 프로젝트 참가 신청
     * 게시글에서 신청하기 버튼을 누르면
     * 자동으로 내가 입력했던 포지션을 가져와서 신청
     *
     */
    @PatchMapping("/{projectIdx}")
    private ResponseEntity<?> apply(
            @AuthenticationPrincipal TokenUserInfo tokenUserInfo,
            @PathVariable Long projectIdx
    ) {

        if (tokenUserInfo.getUserIdx()==null) log.info("토큰 XX");
        log.info("/api/ddamddam/applicant/board={}" , projectIdx);

        try {
            ProjectDetailResponseDTO projectDto = applicantService.apply(tokenUserInfo, projectIdx);

            log.info("신청하기 - {}", projectDto);
            return ResponseEntity.ok().body(projectDto);
        } catch (UnauthorizationException e){
            e.printStackTrace();
            return ResponseEntity.badRequest().body("자신의 게시글에는 신청을 할 수 없습니다");
        } catch (Exception e) {
          log.info("e.error msg : {}",e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 신청 취소
    @DeleteMapping("/{boardIdx}")
    public ApplicationResponse<?> cancel(
            @AuthenticationPrincipal TokenUserInfo tokenUserInfo,
            @RequestBody @PathVariable Long boardIdx
    ) {
        log.info("/api/ddamddam/applicant/user={}/board={} DELETE !! ", tokenUserInfo.getUserIdx(), boardIdx);

        try {
            applicantService.cancel(tokenUserInfo, boardIdx);
            return ApplicationResponse.ok("프로젝트 신청이 취소되었습니다.");
        } catch (Exception e) {
            return ApplicationResponse.error(e.getMessage());
        }
    }
}

