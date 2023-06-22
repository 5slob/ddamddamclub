import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {getToken, getUserIdx} from "../common/util/login-util";
import {BASE_URL, MYPAGE} from "../common/config/HostConfig";
import {Link, useNavigate} from "react-router-dom";
import Common from "../common/Common";

const MypageProjectList = props => {

  const ACCESS_TOKEN = getToken();
  const USER_IDX = getUserIdx();
  const API_BASE_URL = BASE_URL + MYPAGE;
  const redirection = useNavigate();

  // headers
  const headerInfo = {
    'content-type': 'application/json',
    'Authorization': 'Bearer ' + ACCESS_TOKEN
  }

  const [projectList, setProjectList] = useState([]);

  // 로그인 상태 검증 핸들러
  const loginCheckHandler = (e) => {
    console.log(`ACCESS_TOKEN = ${ACCESS_TOKEN}`)
    if (ACCESS_TOKEN === '' || ACCESS_TOKEN === null){
      alert('로그인 후 이용가능합니다.')
      e.preventDefault();
      redirection('/login');
    }
  }

  const asyncProjectList = async () => {

    console.log(`ACCESS_TOKEN : ${ACCESS_TOKEN}`); // 토큰 잘 나옴;;
    console.log(`USER_IDX : ${USER_IDX}`);

    const res = await fetch(API_BASE_URL + `/project-list`, {
      method: 'GET',
      headers: headerInfo,
    });

    if (res.status === 400) {
      alert('잘못된 요청 값 입니다.')
      return;
    } else if (res.status === 401) {
      alert('로그인이 만료되었습니다.')
      window.location.href = "/";
    } else if (res.status === 403) {
      alert('권한이 없습니다.')
      window.location.href = "/";
    } else if (res.status === 404) {
      alert('요청을 찾을 수 없습니다.');
      return;
    } else if (res.status === 500) {
      alert('잠시 후 다시 접속해주세요.[서버오류]');
      return;
    }

    // 오류 없이 값을 잘 받아왔다면
    const result = await res.json();
    console.log(`result : ${result[0]}`);
    setProjectList(result);
  };

  // 첫 렌더링 시 작성 게시글 전체 출력
  useEffect(() => {
    asyncProjectList();
  }, []);

  // [
  //   {
  //     "boardTitle": "제목9이다",
  //     "boardWriter": null,
  //     "writerPosition": "BACKEND",
  //     "front": [],
  //     "back": []
  //   } + 게시글 눌러서 프로젝트 상세보기로 이동해야하기때문에 boardIdx 필요함!!!
  // ]

  return (
    <Common className={'mypage-list-wrapper'}>

      {projectList.map((project) => (
        <>
        </>
      ))}

    </Common>
  );
};

export default MypageProjectList;