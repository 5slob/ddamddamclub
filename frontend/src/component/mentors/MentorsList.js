import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import Common from "../common/Common";
import Modal from 'react-bootstrap/Modal';
import {TfiClose} from 'react-icons/tfi';
import './scss/MentorsList.scss';
import {MENTOR, CHAT} from "../common/config/HostConfig";
import less from "../../src_assets/less.png";
import than from "../../src_assets/than.png";
import {MdEmojiPeople} from "react-icons/md";
import {getToken, getUserIdx, isLogin} from '../common/util/login-util';
import {debounce} from "lodash";
import {httpStateCatcher, httpStateCatcherDelete} from "../common/util/HttpStateCatcherWrite";
import profileImg from "../../src_assets/ProfileLogo.png"
import {useMediaQuery} from 'react-responsive';


const MentorsList = ({selectedSubjects}) => {

  const [mentorsList, setMentorsList] = useState([]);
  const [pageNation, setPageNation] = useState([]);
  const [prevBtn, setPrevBtn] = useState(false);
  const [nextBtn, setNextBtn] = useState(false);
  const redirection = useNavigate();

  //로그인 판별
  const [checkLogin, setCheckLogin] = useState(false);

  // 모달 useState
  const [detailMember, setDetailMember] = useState([]);
  const [show, setShow] = useState(false);

  //채팅 페이지 이동
  const [chatPageIdx, setChatPageIdx] = useState("");

  // 접속한 유저 idx
  const enterUserIdx = +getUserIdx();

  // 멘티 모집완료
  const [menteeCount, setMenteeCount] = useState(0);

  //캐러셀
  // const [currentPage, setCurrentPage] = useState(1);
  const [carouselIndex, setCarouselIndex] = useState(1);

  const ACCESS_TOKEN = getToken(); // 토큰


  // headers
  const headerInfo = {
    'content-type': 'application/json',
    'Authorization': 'Bearer ' + ACCESS_TOKEN
  }

  const handlePrevious = () => {
    if (pageNation.prev === true) {
      setCarouselIndex(prevIndex => prevIndex - 1);
    }
    // if (pageNation.currentPage > 1) {
    //     setCarouselIndex(prevIndex => prevIndex - 1);
    //     setPrevBtn(true);
    // }
  };

  const handleNext = () => {
    if (pageNation.next === true) {
      setCarouselIndex(prevIndex => prevIndex + 1);
    }
    // if (pageNation.currentPage === pageNation.endPage) {
    //     setNextBtn(false);
    // } else {
    //     setCarouselIndex(prevIndex => prevIndex + 1);
    //     setNextBtn(true);
    // }
  };


  const handleDelete = e => {
    if (window.confirm('삭제하시겠습니까?')) {
      fetch(`${MENTOR}/${idx}`, {
        method: 'DELETE',
        headers: headerInfo
      })
        .then(res => {
          httpStateCatcherDelete(res.status);
          return res.json();
        })
        .then(json => {
          setMentorsList(json.mentors);
          setPageNation(json.pageInfo);
          handleClose(); // 모달창 닫기
        });
    } else {
      return;
    }
  };

  const handleClose = () => {
    setShow(false)
  };

  const handleShow = (e) => {
    
    if (ACCESS_TOKEN === '' || ACCESS_TOKEN === null){
      alert('로그인 후 이용가능합니다.')
      e.preventDefault();
      redirection('/login');
      return;
    }
    setShow(true)
    const detailIdx = e.target.closest('.mentors-list').querySelector('.member-idx').value;

    fetch(MENTOR + '/detail?mentorIdx=' + detailIdx, {
      method: 'GET',
      headers: headerInfo
    })
      .then(res => {
        httpStateCatcher(res.status);
        // if (res.status === 500) {
        //   alert('잠시 후 다시 접속해주세요.[서버오류]');
        //   return;
        // }
        return res.json();
      })
      .then(result => {
        setDetailMember(result);
        setMenteeCount(result.completeMentee)
        //로그인 판별
        if (result.userIdx === +getUserIdx()) {
          setCheckLogin(true)
        }
        // console.log(result);
        setChatPageIdx(result.idx);
        // console.log(result.idx);
      });
  };

  const createChatRoom = debounce((e) => {
    e.preventDefault();
    const data = {
      senderId: enterUserIdx,
      mentorIdx: chatPageIdx
    };

    fetch(CHAT + '/rooms', {
      method: 'POST',
      headers: headerInfo,
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(result => {
        // alert('채팅방 입장! 멘토와 즐거운 채팅~');
        window.location.href = `/mentors/detail/chat/${chatPageIdx}/${result.roomId}`;

      })
  },300)

  const {title, content, subject, current, nickName, date, mentee, career, idx, userIdx, profile} = detailMember;


  // 첫 렌더링 시 출력
  useEffect(() => {
    let subjectsParam = '';
    if (selectedSubjects !== null) {
      subjectsParam = selectedSubjects.join(',');
    }


    // console.log(`subjectsParam : ${subjectsParam}`)
    fetch(MENTOR + `/sublist?page=${carouselIndex}&size=9&subjects=${subjectsParam}`)
      .then(res => {
        httpStateCatcher(res.status);
        // if (res.status === 500) {
        //   alert('잠시 후 다시 접속해주세요.[서버오류]');
        //   return;
        // }
        return res.json();
      })
      .then(result => {
        if (!!result) {
          setMentorsList(result.mentors);
          setPageNation(result.pageInfo);

          // console.log(`result.pageInfo : ${result.pageInfo.prev}`);
        }
      });


  }, [selectedSubjects, carouselIndex]);

  const subStringContent = (str, n) => {
    return str?.length > n
      ? str.substr(0, n - 1) + "..."
      : str;
  }

  return (
    <div className={'mentors-list-wrapper'}>

      {/*{prevBtn &&*/}
      {pageNation.prev &&
        <img src={less} alt={"less-icon"} className={'less-icon'} onClick={handlePrevious}/>
      }
      {/*{nextBtn &&*/}
      {pageNation.next &&
        <img src={than} alt={"than-icon"} className={'than-icon'} onClick={handleNext}/>
      }
      {mentorsList.map((mentor, index) => (
        <div className={`mentors-list ${index === carouselIndex ? 'active' : ''}`} key={`${mentor.idx}-${index}`}
             onClick={handleShow}>
          <input type={'hidden'} value={mentor.idx} className={'member-idx'}/>
          <div className={'speech-bubble'} key={mentor.title}>
            {subStringContent(mentor.title, 25)}
          </div>
          {
            mentor.profile !== null
              ? <div className={'profile-img'} style={{backgroundImage: `url(${mentor.profile})`}}>
              </div>
              : <div className={'profile-img'} style={{backgroundImage : `url(${profileImg})`}}></div>
          }


          <div className={'list-text-wrapper'}>
            <div className={'writer'}>
              {mentor.nickName}
            </div>
            <div className={'text'}>
              {subStringContent(mentor.content, 55)}
              {/*{mentor.content}*/}
            </div>
            <ul className={'category'}>
              <li>{mentor.subject}</li>
            </ul>
            <div className={'mentor-career'}>경력 : { mentor.career === '신입' ? mentor.career : mentor.career+'년'}</div>
          </div>
          {/*</Link>*/}
        </div>
      ))}

      {/*모달창 띄워주기*/}
      <Modal show={show} onHide={handleClose} id={'modal-container'}>


        <section className={'top-section'}>
          <div className={'top-title'}>
            <h1 className={'top-title-text'}>멘토 소개</h1>
            <div className={'write-date'}>{date}</div>

            {detailMember.userIdx === enterUserIdx &&
              <>
                <div className={'writer-wrapper'}>
                  <Link to={`/mentors/modify/${idx}`} className={'modify-btn'}>
                    수정
                  </Link>
                  <div className={'delete-btn'} onClick={handleDelete}>삭제</div>
                </div>
              </>
            }

          </div>

          <div className={'close-btn'} onClick={handleClose}><TfiClose/></div>
        </section>

        <section className={'writer-section'}>
        {profile !== null 
          ? <div className={'detail-profile-img'} style={{backgroundImage: `url(${profile})`}}></div>
          : <div className={'detail-profile-img'} style={{backgroundImage: `url(${profile})`}}></div>
          }
          
          <div className={'writer-text-wrapper'}>
            <h2 className={'detail-writer'}>{nickName}</h2>
            <h3 className={'detail-sub-title'}>{title}</h3>
            <div className={'etc-wrapper'}>
              <div className={'member-count'}><p className={'detail-sub-text'}>인원</p>{mentee}명 모집</div>
              <div className={'mentor-career'}>
                <p className={'detail-sub-text'}>모집완료</p>
                {menteeCount} 명
              </div>
              <div className={'subject'}><p className={'detail-sub-text'}>주제</p>{subject}</div>
              <div className={'current'}><p className={'detail-sub-text'}>현직</p>{current}</div>
            </div>

          </div>
        </section>

        <section className={'main-section'}>
          <div className={'main-section-text'}>
            {content}
          </div>
        </section>

                <div className={'btn-wrapper'}>
                    <Link to={`#`} onClick={createChatRoom}>
                        {detailMember.userIdx === enterUserIdx
                         ? <button className={'application-btn'}>입장</button>
                         : <button className={'application-btn'}>신청하기</button>
                        }
                    </Link>
                </div>
            </Modal>
        </div>
    );
};

export default MentorsList;