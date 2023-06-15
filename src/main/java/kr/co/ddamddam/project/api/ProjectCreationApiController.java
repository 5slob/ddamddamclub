package kr.co.ddamddam.project.api;

import kr.co.ddamddam.common.response.ApplicationResponse;
import kr.co.ddamddam.project.dto.page.PageDTO;
import kr.co.ddamddam.project.dto.request.ProjectSearchRequestDto;
import kr.co.ddamddam.project.dto.response.ProjectListPageResponseDTO;
import kr.co.ddamddam.project.service.ProjectLikeService;
import kr.co.ddamddam.project.service.ProjectService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ddamddam/project")
@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
public class ProjectCreationApiController {

  private final ProjectLikeService projectLikeService;
  private final ProjectService projectService;


  /**
   * 사이드 프로젝트 - 좋아요 기능
   * 한 게시물에 (회원당 ) 좋아요 1번만 가능
   *
   * @param userIdx : 세션에서 내(사용자)정보 받아올 예정
   * @param projectIdx : 좋아요 누른 게시글 번호
   */

  @PostMapping("/like/{userIdx}/{projectIdx}")
  public ApplicationResponse<?> handleLike(
      @PathVariable Long userIdx,
      @PathVariable Long projectIdx
  ) {
    try {
      log.info("좋아요 click : userIdx={}, projectIdx={}",userIdx,projectIdx);
      boolean isLiked = projectLikeService.checkIfLiked(userIdx, projectIdx);

      projectLikeService.handleLike(userIdx, projectIdx);
      if (isLiked) {
        return ApplicationResponse.ok("좋아요가 취소되었습니다.");
      } else {
        return ApplicationResponse.ok("좋아요가 올라갔습니다.");
      }
    } catch (Exception e) {
      return ApplicationResponse.error("좋아요 처리 중 오류가 발생했습니다.");
    }
  }

  /**
   * 퀵 매칭
   * @param searchDto : select : 내 포지션 / 오래된 순 / 남은자리가 작은것 부터
   * @return : select 된 리스트 배열
   */
  @GetMapping("/quick")
  private ApplicationResponse<?> quickMatchingList(
      PageDTO dto, ProjectSearchRequestDto searchDto){
    log.info("/api/ddamddam/quick");

    ProjectListPageResponseDTO quickList = projectService.quickMatching(dto, searchDto);

    return ApplicationResponse.ok(quickList);
  }
}