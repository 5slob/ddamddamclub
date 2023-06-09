import React, {useEffect, useState} from 'react';
import "./scss/MypageProjectList.scss";
import {RiVipCrownFill} from "react-icons/ri";
import {getToken, getUserIdx} from "../common/util/login-util";
import {BASE_URL, MYPAGE, PROJECT} from "../common/config/HostConfig";
import {Link, useNavigate} from "react-router-dom";
import less from "../../src_assets/less.png";
import than from "../../src_assets/than.png";
import {httpStateCatcher} from "../common/util/HttpStateCatcherWrite";
import {useMediaQuery} from "react-responsive";

const MypageProjectList = props => {

  const ACCESS_TOKEN = getToken();
  const API_BASE_URL = BASE_URL + MYPAGE;
  const redirection = useNavigate();

  // headers
  const headerInfo = {
    'content-type': 'application/json',
    'Authorization': 'Bearer ' + ACCESS_TOKEN
  }

  const presentationScreen = useMediaQuery({
    query: "(max-width: 414px)",
  });

  const [projectList, setProjectList] = useState([]);
  const [pageNation, setPageNation] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(1);

  const subStringContent = (str, n) => {
    return str?.length > n
      ? str.substr(0, n - 1) + "..."
      : str;
  }

  const handlePrevious = () => {
    if (pageNation.prev === true) {
      setCarouselIndex(prevIndex => prevIndex - 1);
    }
  };

  const handleNext = () => {
    if (pageNation.next === true) {
      setCarouselIndex(prevIndex => prevIndex + 1);
    }
  };

  // 로그인 상태 검증 핸들러
  const loginCheckHandler = (e) => {
    // console.log(`ACCESS_TOKEN = ${ACCESS_TOKEN}`)
    if (ACCESS_TOKEN === '' || ACCESS_TOKEN === null) {
      alert('로그인 후 이용가능합니다.')
      e.preventDefault();
      redirection('/login');
    }
  }

  const asyncProjectList = async () => {

    // console.log(`ACCESS_TOKEN : ${ACCESS_TOKEN}`); // 토큰 잘 나옴;;

    // http://localhost:8181/api/ddamddam/mypage/project-list?page=1&size=3
    const res = await fetch(`${API_BASE_URL}/project-list?page=${carouselIndex}&size=3`, {
      method: 'GET',
      headers: headerInfo,
    });

    httpStateCatcher(res.status);

    // 오류 없이 값을 잘 받아왔다면
    const result = await res.json();
    // console.log(`result :`, result);
    setProjectList(result.posts);
    setPageNation(result.pageInfo);
  };

  // 첫 렌더링 시 작성 게시글 전체 출력
  useEffect(() => {
    asyncProjectList();
  }, [carouselIndex]);

  const projectClose = async (boardIdx) =>{
    if (window.confirm("삭제 하시겠습니까?")) {
      await fetch(`${PROJECT}/applicant/${boardIdx}`, {
        method: 'DELETE',
        headers: headerInfo
      })
          .then((response) => {
            if (!response.ok) {
              throw new Error('삭제에 실패하였습니다. 잠시 후에 다시 시도해주세요.');
            }
            return response.json();
          })
          .then((data) => {
            alert(data.payload);
            asyncProjectList();
          })
          .catch((error) => {
            // console.log(error);
            alert('서버와의 통신이 불안정합니다. 잠시 후에 다시 시도해주세요.');
          });
    }
  };

  return (
    <div className={'mypage-pj-wrapper'}>

      {projectList.length === 0 ? (
        <div>참여중인 프로젝트가 없습니다.</div>
      ) : null}

      {pageNation.prev &&
        <img src={less} alt={"less-icon"} className={'mypage-less-icon'} onClick={handlePrevious}/>
      }
      <div className={'pj-wrapper'}>
        {projectList.map((project, index) => (
          <div className={'pj-box'} key={index}>
            <button className={'project-close'}
            style={{
              backgroundColor:'transparent',
              float: 'right',
              border: 'none'
            }}
            onClick={()=>projectClose(project.boardIdx)}>
              {presentationScreen
                ? '신청취소'
                : 'X'
              }
            </button>
            <Link to={`/projects/detail?projectIdx=${project.boardIdx}`} onClick={loginCheckHandler}>
              {presentationScreen
                ? <div className={'pj-title'}>{subStringContent(project.boardTitle, 40)}</div>
                : <div className={'pj-title'}>{subStringContent(project.boardTitle, 35)}</div>
              }
            </Link>
            <div className={'pj-writer small-text'}>
            </div>
            {/*백, 프론트 리스트 뿌리기*/}
            {presentationScreen
              ? null
              :
            <div className={'participants-list'}>
              <div className={'list-box'}>
                <p className={'pj-sub-title small-text'}>FRONT</p>
                <div className={'participants-box'}>
                  {
                    project.writerPosition === 'FRONTEND'
                      ? <p className={'small-text writer'}>
                        <RiVipCrownFill/>
                        &nbsp;{project.boardWriter}
                      </p>
                      : null
                  }
                  {project.front.map((front,i) => (
                    <p className={'small-text'}
                    key={i}>{front}</p>
                  ))}
                </div>
              </div>
              <div className={'list-box'}>
                <p className={'pj-sub-title small-text'}>BACK</p>
                {
                  project.writerPosition === 'BACKEND'
                    ? <p className={'small-text writer'}>
                      <RiVipCrownFill/>
                      &nbsp;{project.boardWriter}
                    </p>
                    : null
                }
                {project.back.map((back,index) => (
                  <p className={'small-text'}
                  key={index}>{back}</p>

                ))}
              </div>
            </div>
            }
          </div>
        ))}
      </div>
      {pageNation.next &&
        <img src={than} alt={"than-icon"} className={'mypage-than-icon'} onClick={handleNext}/>
      }

    </div>
  );
};

export default MypageProjectList;
