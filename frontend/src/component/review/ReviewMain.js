import React, {useEffect, useState} from 'react';
import Common from "../common/Common";
import './scss/ReviewMain.scss';
import {QNA, REVIEW} from "../common/config/HostConfig";
import {Link, useNavigate} from "react-router-dom";
import ReviewStar from "./StartRating/ReviewStar";
import {httpStateCatcher} from "../common/util/HttpStateCatcherWrite";
import {useMediaQuery} from "react-responsive";
import {getToken} from '../common/util/login-util';

const QnaMain = () => {
    const [topReview, setTopReview] = useState([]);
    const ACCESS_TOKEN = getToken();
    const redirection = useNavigate();

    const subStringContent = (str, n) => {
        return str.length > n
          ? str.substr(0, n - 1) + "..."
          : str;
      }

    const presentationScreen = useMediaQuery({
        query: "(max-width: 414px)",
    });

    const loginCheckHandler = e => {
        if (ACCESS_TOKEN === '' || ACCESS_TOKEN === null){
          alert('로그인 후 이용가능합니다.')
          e.preventDefault();
          redirection('/login');
          // return;
      }
      };

    //top3 목록 렌더링 필터 async
    const asyncTopList = async () => {
        const res = await fetch(`${REVIEW}/viewTop3`, {
            method: 'GET',
            headers: {'content-type': 'application/json'}
        });

        httpStateCatcher(res.status);
        // if (res.status === 500) {
        //     alert('잠시 후 다시 접속해주세요.[서버오류]');
        //     return;
        // }

        const reivewList = await res.json();
        // console.log(reivewList)
        // console.log(`top3의 결과 : ${reivewList}` );
        setTopReview(reivewList);

    }

    useEffect(() => {
        asyncTopList();
    }, [])


    return (

        <Common className={'review-top-wrapper'}>
            <div className={'title-wrapper'}>
                <p className={'main-title'}>취업 후기</p>
                <p className={'main-sub-title'}>근무했던 기업에 대한 정보를 공유해보세요.</p>
            </div>

            {!presentationScreen && 
                <section className={'top-view-wrapper'}>
                {topReview.map((review, index) => (
                    <div className={'top-section-one'} key={review.boardIdx}>

                        <h1 className={'top-section-title'}>🔥 주간 조회수 TOP{index + 1} 🔥</h1>
                        <Link to={`/reviews/detail/${review.boardIdx}`} className={'detail-link'} onClick={loginCheckHandler}>
                            <section className={'top-section-wrapper'}>

                                <div className={'company-name'}>{review.companyName}</div>
                                <ReviewStar starCount ={review.boardRating}/>

                                <div className={'review-title'}>{subStringContent(review.boardTitle,15)}</div>
                                {/*<div className={'qna-content'}>{review.boardTitle}</div>*/}
                                <section className={'detail-wrapper'}>
                                    <div className={'detail-reviewJob'}><span className={'sub-title'}>직무</span>{review.boardJob}</div>
                                    <div className={'detail-reviewJob'}><span className={'sub-title'}>근속년수</span>{review.boardTenure}년</div>
                                    <div className={'detail-reviewJob'}><span className={'sub-title'}>위치</span>{review.boardLocation}</div>
                                </section>
                            </section>
                        </Link>
                    </div>
                ))}
            </section>
            }
            
        </Common>
    );
};

export default QnaMain;
