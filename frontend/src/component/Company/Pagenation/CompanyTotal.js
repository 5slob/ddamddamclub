import React, {useEffect, useState} from 'react';
import {COMPANY, REVIEW} from "../../common/config/HostConfig";
import {Link, useNavigate} from "react-router-dom";
import ReviewStar from "../../review/StartRating/ReviewStar";
import {IoIosArrowForward} from "react-icons/io";
import viewIcon from "../../../src_assets/view-icon.png";
import PageNation from "../../common/pageNation/PageNation";
import {RxCalendar} from "react-icons/rx"
import {parseString} from "react-native-xml2js"
import axios from "axios";

const CompanyTotal = () => {
    const [companyList, setReviewList] = useState([]);
    const [pageNation, setPageNation] = useState([]);
    const [clickCurrentPage, setClickCurrentPage] = useState(1);

    //워크넷 링크 상태관리
    const [goWorknet, setGoWorknet] = useState([]);

    // const res = `?authKey=WNLIS5RDCEK7WOBRD73GA2VR1HJ&&callTp=L&returnType=XML&startPage=1&display=10`
    const res = `http://openapi.work.go.kr/opi/opi/opia/wantedApi.doauthKey=WNLIS5RDCEK7WOBRD73GA2VR1HJ&&callTp=L&returnType=XML&startPage=1&display=10`

    useEffect(() => {
        asyncCompanyTotalList();

        const fetchData = async () => {
            try {
                const response = await fetch(res, {
                    mode: 'no-cors'
                });
                const data = await response.text(); // 또는 response.json() 등으로 데이터 처리
                console.log(data);
            } catch (e) {
                console.log(e);
            }
        };
        fetchData()

        // }, [clickCurrentPage,goWorknet])
    }, [clickCurrentPage])




    const asyncCompanyTotalList = async () => {
        // console.log(`asyncCompanyTotalList 실행`)
        // const responseUrl = `/list?page=${clickCurrentPage}&size=10`
        const res = await fetch(`${COMPANY}/list`, {
            method: 'GET',
            headers: {'content-type': 'application/json'}
        });

        if (res.status === 500) {
            alert('잠시 후 다시 접속해주세요.[서버오류]');
            return;
        }

        const result = await res.json();
        // console.log(`전체 result : `, result)

        setPageNation(result.pageInfo);

        const companyLists = result.companyList

        //list가공
        const modifyCompanyList = companyLists.map((list) => {
            let endDate = list.companyEnddate;
            if (list.companyEnddate.includes('채용시까지')) {
                endDate = endDate.split("채용시까지")[1].trim();
            }
            const formattedEndDate = convertToEndDate(endDate);

            let modifyLocation = list.companyArea.split(" ");
            let setModifyLocation = modifyLocation[0] + " " + modifyLocation[1];

            return {...list, companyEnddate: endDate, dDay: formattedEndDate, companyArea: setModifyLocation}

        });
        setGoWorknet(new Array(companyLists.length).fill(false))
        // goWorknet.length = companyList.length;
        // for (let i = 0; i < goWorknet.length; i++) {
        //     goWorknet[i] = false
        // }

        // console.log(goWorknet)
        setReviewList(modifyCompanyList);
        // console.log(`modifyCompanyList의 값 : `, modifyCompanyList)
    }

    //d-day계산
    const convertToEndDate = (endDate) => {
        const currentYear = new Date().getFullYear();
        const [endYear, endMonth, endDay] = endDate.split('-');

        //년도에 4자리로 만들기
        const formattedEndYear = currentYear - (currentYear % 100) + parseInt(endYear);
        // const formattedEndYear = `20${endYear}`;

        //yyyy-mm-dd
        const formattedEndDate = new Date(`${formattedEndYear}-${endMonth}-${endDay}`);

        const startDate = new Date();
        const timeDiff = formattedEndDate.getTime() - startDate.getTime();
        const dateDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        const formattedDdayDate = `D-${dateDiff}`

        return formattedDdayDate;
    }


    const currentPageHandler = (clickPageNum) => {
        console.log(`페이지 클릭 시 현재 페이지 번호 : ${clickPageNum}`)
        setClickCurrentPage(clickPageNum);
    }

    const redirection = useNavigate();
    const showLinkHandler = (index) => {
        const updatedGoWorknet = goWorknet.map((item, i) => (i === index ? true : false));
        setGoWorknet(updatedGoWorknet);

        console.log(updatedGoWorknet)
    }
    const hiddenLinkHandler = (index) => {
        setGoWorknet(new Array(goWorknet.length).fill(false));
    }
    return (
        <>
            <section className={'sort-wrapper'}>
                <span className={'sort-dDay'}>D-day</span>
                <span className={'sort-career'}>경력</span>
                <span className={'sort-companyName'}>회사명</span>
                <span className={'sort-title'}>채용내용</span>
                <span className={'sort-date'}>날짜</span>
            </section>
            {companyList.map((company, index) => (
                <>
                    <section
                        key={index}
                        className={'company-list'}
                        onMouseEnter={() => showLinkHandler(index)}
                        onMouseLeave={() => hiddenLinkHandler(index)}
                    >
                        <div className={'d-day'}>{company.dDay}</div>
                        <div className={'company-career'}>{company.companyCareer}</div>
                        <div className={'companyName'}>{company.companyName}</div>
                        <section className={'title-wrapper'}>
                            <div className={'title'}>{company.companyTitle}</div>

                            <div className={'info-wrapper'}>
                                <div className={'info-salary-text'}>
                                    <span className={'info-title'}>월급</span>
                                    <span className={'info-content'}>{company.companySal}</span>
                                </div>
                                <div className={'info-location-text'}>
                                    <span className={'info-title'}>위치</span>
                                    <span className={'info-content'}>{company.companyArea}</span>
                                </div>
                            </div>
                        </section>

                        <div className={'date-wrapper'}>
                            <RxCalendar className={'date-icon'}/>
                            <span className={'date'}>{company.companyDate} ~ {company.companyEnddate}</span>
                        </div>
                        {goWorknet[index] &&
                            <button onClick={() => window.open(`${company.companyUrl}`, '_blank')}
                                    className={'go-worknet'}>
                                클릭시 워크넷 채용정보 페이지로 이동합니다.
                            </button>
                        }

                    </section>

                </>
            ))}
            <button className={'go-worknet2'}>wfeqfeqwfawfaw</button>
        </>
    );
};

export default CompanyTotal;