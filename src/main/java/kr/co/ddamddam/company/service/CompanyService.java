package kr.co.ddamddam.company.service;

import kr.co.ddamddam.company.dto.page.PageDTO;
import kr.co.ddamddam.company.dto.page.PageResponseDTO;
import kr.co.ddamddam.company.dto.request.CompanyRequestDTO;
import kr.co.ddamddam.company.dto.response.CompanyListPageResponseDTO;
import kr.co.ddamddam.company.dto.response.CompanyListResponseDTO;
import kr.co.ddamddam.company.entity.Company;
import kr.co.ddamddam.company.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.XML;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.transaction.Transactional;
import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Timer;

import static java.util.stream.Collectors.toList;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class CompanyService {


    private final CompanyRepository companyRepository;

    @Autowired
    private EntityManager entityManager;
    public static int INDENT_FACTOR = 4;

    //api xml데이터를 json으로 변경해서 DB에 저장
    @Transactional
    public void processExternalData() throws IOException {

        int displayCount = 100;

        String url = "https://openapi.work.go.kr/opi/opi/opia/wantedApi.do?authKey=WNLIS5RDCEK7WOBRD73GA2VR1HJ&returnType=xml&display=100&callTp=L&occupation=024";

        HttpURLConnection conn = (HttpURLConnection) new URL(url).openConnection();
        conn.connect();
        BufferedInputStream bis = new BufferedInputStream(conn.getInputStream());
        BufferedReader reader = new BufferedReader(new InputStreamReader(bis));
        StringBuffer st = new StringBuffer();
        String line;
        while ((line = reader.readLine()) != null) {
            st.append(line);
        }

        // Convert XML to JSON
        JSONObject xmlJSONObj = XML.toJSONObject(st.toString());
        String jsonPrettyPrintString = xmlJSONObj.toString(INDENT_FACTOR);
        JSONObject jsonObject = new JSONObject(jsonPrettyPrintString);

        // Get the 'wantedRoot' object
        JSONObject wantedRoot = jsonObject.getJSONObject("wantedRoot");

        // 전체의 값
        int finalPage = wantedRoot.getInt("total");
        System.out.println("finalPage = " + finalPage);
        // 반복문 횟수
        int arrPage = (int) Math.ceil(finalPage / (double) displayCount);
        System.out.println("arrPage = " + arrPage);

        CompanyRequestDTO dto = new CompanyRequestDTO();
        List<CompanyRequestDTO> wantedList = new ArrayList<>();

        for (int page = 1; page <= arrPage; page++) {
//        for (int page = 1; page <= 1; page++) {
            String pageUrl = "https://openapi.work.go.kr/opi/opi/opia/wantedApi.do?authKey=WNLIS5RDCEK7WOBRD73GA2VR1HJ&returnType=xml&display=100&callTp=L&startPage="+page+"&occupation=024";
//            log.info("pageUrl : {}",pageUrl);
            HttpURLConnection pageConn = (HttpURLConnection) new URL(pageUrl).openConnection();
            pageConn.connect();
            BufferedInputStream pageBis = new BufferedInputStream(pageConn.getInputStream());
            BufferedReader pageReader = new BufferedReader(new InputStreamReader(pageBis));
            StringBuffer pageSt = new StringBuffer();
            String pageLine;
            while ((pageLine = pageReader.readLine()) != null) {
                pageSt.append(pageLine);
            }

            // Convert XML to JSON for each page
            JSONObject pageXmlJSONObj = XML.toJSONObject(pageSt.toString());
            String pageJsonPrettyPrintString = pageXmlJSONObj.toString(INDENT_FACTOR);
            JSONObject pageJsonObject = new JSONObject(pageJsonPrettyPrintString);

            // Get the 'wantedRoot' object for each page
            JSONObject pageWantedRoot = pageJsonObject.getJSONObject("wantedRoot");

            // Get the 'wanted' array from 'wantedRoot' for each page
            JSONArray wantedArray = pageWantedRoot.getJSONArray("wanted");

            for (int i = 0; i < wantedArray.length(); i++) {
                JSONObject value = wantedArray.getJSONObject(i);

                String title = value.getString("title");
                String company = value.getString("company");
                String career = value.getString("career");
                String wantedInfoUrl = value.getString("wantedInfoUrl");
                String basicAddr = value.getString("basicAddr");
                String detailAddr = value.optString("detailAddr", "");
                String sal = value.getString("sal");
                String regDt = value.getString("regDt");
                String closeDt = value.getString("closeDt");

                // Create a new CompanyRequestDTO object
//                Company companyEntity = new Company();
                dto.setCompanyName(company);
                dto.setCompanyTitle(title);
                dto.setCompanyCareer(career);
                dto.setCompanyUrl(wantedInfoUrl);
                dto.setCompanyArea(detailAddr);
                dto.setCompanySal(sal);
//            formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
                dto.setCompanyDate(regDt);
                dto.setCompanyEndDate(closeDt);


                // Create a new Company entity
                Company companyEntity = new Company();
                companyEntity.setCompanyName(company);
                companyEntity.setCompanyTitle(title);
                companyEntity.setCompanyCareer(career);
                companyEntity.setCompanyUrl(wantedInfoUrl);
                companyEntity.setCompanyArea(basicAddr+detailAddr);
                companyEntity.setCompanySal(sal);
                companyEntity.setCompanyDate(regDt);
                companyEntity.setCompanyEnddate(closeDt);

                // Persist the Company entity
                entityManager.persist(companyEntity);
                entityManager.flush();

                // Add the DTO object to the list
                wantedList.add(dto);
            }

            // Close the resources for the current page
            pageReader.close();
            pageBis.close();
            pageConn.disconnect();
        }
    }

    //전체목록 가져오기
    public CompanyListPageResponseDTO getList(PageDTO pageDTO){

        PageRequest pageable = getPageable(pageDTO);
        // 데이터베이스에서 게시글 목록 조회 후 DTO 리스트로 꺼내기
        Page<Company> companies = companyRepository.findAll(pageable);
        List<CompanyListResponseDTO> companyListResponseDTOList = getCompanyDTOList(companies);


        //JSON 형태로 변형
        return CompanyListPageResponseDTO.builder()
                .count(companyListResponseDTOList.size())
                .count(companyListResponseDTOList.size())
                .pageInfo(new PageResponseDTO<Company>(companies))
                .companyList(companyListResponseDTOList)
                .build();

    }
    private PageRequest getPageable(PageDTO pageDTO) {
        return PageRequest.of(
                pageDTO.getPage() - 1,
                pageDTO.getSize(),
                Sort.by("companyDate").descending()
        );
    }
    private List<CompanyListResponseDTO> getCompanyDTOList(Page<Company> companies) {

        return companies.getContent().stream()
                .map(CompanyListResponseDTO::new)
                .collect(toList());
    }


    // 키워드 검색(백엔드 검색)
    public CompanyListPageResponseDTO getKeywordList(String keyword,String keyword2 ,PageDTO pageDTO){

        PageRequest pageable = getPageable(pageDTO);
        Page<Company> companies = companyRepository.findByKeywordback(keyword,keyword2,pageable);
        log.info("pageCompany : {}" , companies);
        List<CompanyListResponseDTO> companyListResponseDTOS = getCompanyListKeyword(companies);

        return CompanyListPageResponseDTO.builder()
                .count(companyListResponseDTOS.size())
                .pageInfo(new PageResponseDTO<>(companies))
                .companyList(companyListResponseDTOS)
                .build();
    }

    // 키워드 검색(프론트엔드 검색)
    public CompanyListPageResponseDTO getKeywordListfront(String keyword,String keyword2 ,PageDTO pageDTO){

        PageRequest pageable = getPageable(pageDTO);
        Page<Company> companies = companyRepository.findByKeywordfront(keyword,keyword2,pageable);
        log.info("pageCompany : {}" , companies);
        List<CompanyListResponseDTO> companyListResponseDTOS = getCompanyListKeyword(companies);

        return CompanyListPageResponseDTO.builder()
                .count(companyListResponseDTOS.size())
                .pageInfo(new PageResponseDTO<>(companies))
                .companyList(companyListResponseDTOS)
                .build();
    }

    private List<CompanyListResponseDTO> getCompanyListKeyword(Page<Company> companies) {
        return companies.stream()
                .map(CompanyListResponseDTO::new)
                .collect(toList());
    }

    // 키워드 전체 검색(경력 정렬 포함)
    public CompanyListPageResponseDTO getKeywordListAll(String keyword,String keyword2 ,PageDTO pageDTO){

        PageRequest pageable = getPageable(pageDTO);
//        keyword2 = keyword2 + " ";
//        keyword = keyword + " ";
        Page<Company> companies = companyRepository.findAllBy(keyword,keyword2,pageable);
        log.info("pageCompany : {}" , companies);
        List<CompanyListResponseDTO> companyListResponseDTOS = getCompanyListKeyword(companies);

        return CompanyListPageResponseDTO.builder()
                .count(companyListResponseDTOS.size())
                .pageInfo(new PageResponseDTO<>(companies))
                .companyList(companyListResponseDTOS)
                .build();
    }




}