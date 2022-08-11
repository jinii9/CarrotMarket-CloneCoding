module.exports = {

    // Success
    SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" },
    SIGNUP_SUCCESS : { "isSuccess": true, "code": 1001, "message":"회원가입 성공" },
    LOGIN_SUCCESS : { "isSuccess": true, "code": 1019, "message":"로그인 성공" },
    POSTPRODUCT_SUCCESS : { "isSuccess": true, "code": 1002, "message":"중고거래 글쓰기 성공" },
    POSTTOWN_SUCCESS : { "isSuccess": true, "code": 1003, "message":"동네 생성 성공" },
    GETUSERBYTOWN_SUCCESS : { "isSuccess": true, "code": 1004, "message":"유저 동네 정보 가져오기 성공" },
    GETUSERBYCURRENTTOWN_SUCCESS : { "isSuccess": true, "code": 1019, "message":"현재 위치의 근처 동네들 조회 성공" },
    PATCHUSERTOWNSCALE_SUCCESS : { "isSuccess": true, "code": 1005, "message":"유저 동네 범위 수정 성공" },
    PATCHUSERTOWNSTATUS_SUCCESS : { "isSuccess": true, "code": 1006, "message":"유저 동네 삭제처리 성공" },
    PATCHUSERTOWNMAIN_SUCCESS : { "isSuccess": true, "code": 1007, "message":"유저 메인 동네 수정 성공" },
    GETPRODUCTS_SUCCESS : { "isSuccess": true, "code": 1008, "message":"전체 상품 조회 성공" },
    GETTITLEPRODUCTS_SUCCESS : { "isSuccess": true, "code": 1009, "message":"특정 상품 조회 성공" },
    PATCHUSERRODUCTS_SUCCESS : { "isSuccess": true, "code": 1010, "message":"유저 상품 수정 성공" },
    PATCHUSERRODUCTSSTATUS_SUCCESS : { "isSuccess": true, "code": 1010, "message":"유저 상품 삭제처리 성공" },
    POSTWISHLIST_SUCCESS : { "isSuccess": true, "code": 1011, "message":"관심목록 생성 성공" },
    GETUSERBYWISHLIST_SUCCESS : { "isSuccess": true, "code": 1012, "message":"관심목록 조회 성공" },
    PATCHWISHLIST_SUCCESS : { "isSuccess": true, "code": 1013, "message":"위시리스트 수정 성공" },
    GETSALESLIST_SUCCESS : { "isSuccess": true, "code": 1014, "message":"판매내역 조회 성공" },
    POSTREVIEW_SUCCESS : { "isSuccess": true, "code": 1015, "message":"리뷰 생성 성공" },
    GETPURCHASELIST_SUCCESS : { "isSuccess": true, "code": 1016, "message":"구매내역 조회 성공" },
    PATCHRESERVED_SUCCESS : { "isSuccess": true, "code": 1017, "message":"상품 예약 수정 성공" },
    PATCHCOMPLETED_SUCCESS : { "isSuccess": true, "code": 1018, "message":"상품 거래완료 수정 성공" },
    // Common
    TOKEN_EMPTY : { "isSuccess": false, "code": 2000, "message":"JWT 토큰을 입력해주세요." },
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 3000, "message":"JWT 토큰 검증 실패" },
    TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 1001, "message":"JWT 토큰 검증 성공" }, // ?

    //Request error
    SIGNUP_PHONE_EMPTY : { "isSuccess": false, "code": 2001, "message":"전화번호를 입력해주세요." },
    SIGNUP_PHONE_LENGTH : { "isSuccess": false, "code": 2002, "message":"전화번호는 11자리로 입력해주세요." },
    
    USER_USERID_EMPTY : { "isSuccess": false, "code": 2012, "message": "userId를 입력해주세요." },

    USER_ID_NOT_MATCH : { "isSuccess": false, "code": 2016, "message": "유저 아이디 값을 확인해주세요" }, // jwt관련

    //SIGNUP_PHONE_ERROR_TYPE : { "isSuccess": false, "code": 2003, "message":"전화번호를 형식을 정확하게 입력해주세요." },
    SIGNUP_NICKNAME_EMPTY : { "isSuccess": false, "code": 2004, "message":"닉네임을 입력해주세요." },
    PRODUCT_TITLE_EMPTY : { "isSuccess": false, "code": 2005, "message":"상품 제목을 입력해주세요." },
    PRODUCT_CATEGORY_EMPTY : { "isSuccess": false, "code": 2006, "message":"카테고리를 입력해주세요." },
    PRODUCT_CONTENTS_EMPTY : { "isSuccess": false, "code": 2007, "message":"내용을 입력해주세요." },
    

    // Response error
    //
    SIGNUP_REDUNDANT_PHONE : { "isSuccess": false, "code": 3001, "message":"중복된 전화번호입니다." },
    POSTTOWN_REDUNDANT_TOWN : { "isSuccess": false, "code": 3002, "message":"이미 설정된 동네예요." },
    //
    SIGNIN_PHONE_WRONG : { "isSuccess": false, "code": 3003, "message": "폰번호가 잘못 되었습니다." },
    SIGNIN_INACTIVE_ACCOUNT : { "isSuccess": false, "code": 3005, "message": "비활성화 된 계정입니다. 고객센터에 문의해주세요." },
    SIGNIN_WITHDRAWAL_ACCOUNT : { "isSuccess": false, "code": 3006, "message": "탈퇴 된 계정입니다. 고객센터에 문의해주세요." },

    //Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},
 
 
}
