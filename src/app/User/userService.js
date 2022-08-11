const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("./userProvider");
const userDao = require("./userDao");
const townDao = require("../../app/Town/townDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

///////////////////////////////////////////////////////////////////////////////////////////////
// TODO: After 로그인 인증 방법 (JWT)
exports.postSignIn = async function (phone) {
    try {
        // 폰번호 여부 확인 (실제 DB에 있는 폰번호인지 조회)
        const phoneRows = await userProvider.phoneCheck(phone);
        if (phoneRows.length < 1) return errResponse(baseResponse.SIGNIN_PHONE_WRONG); // 존재하지 않는다면 에러

        const selectPhone = phoneRows[0].email // 이메일 가져오기

        // // 비밀번호 확인 (비밀번호는 암호화해서 DB에 집어넣었기 때문에, 유저로부터 받은 비밀번호 다시 암호화해서 이거랑, DB에 있는 암호화 비밀번호 비교)
        // const hashedPassword = await crypto
        //     .createHash("sha512")
        //     .update(password)
        //     .digest("hex");

        // const selectUserPasswordParams = [selectEmail, hashedPassword]; 
        // const passwordRows = await userProvider.passwordCheck(selectUserPasswordParams); // 이메일과 패스워드 모두 일치한 것 가져오기

        // if (passwordRows[0].password !== hashedPassword) {
        //     return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
        // }



        // 계정 상태 확인 (status로 계정 상태 관리되어 있음)
        const userInfoRows = await userProvider.accountCheck(phone);
        
        // if (userInfoRows[0].status === "INACTIVE") {
        //     return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        // } else if (userInfoRows[0].status === "DELETED") {
        //     return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
        // }
        if (userInfoRows[0].status === "N") {
            return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
        }
        

        console.log(userInfoRows[0].no) // DB의 userId (클라이언트가 보내온 email과 password에 해당하는 userId 값)

        //토큰 생성 Service
        let token = await jwt.sign( //(sign메소드 이용해서 jwt 생성)
            { 
                userId: userInfoRows[0].no,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            { // <options : >
                expiresIn: "365d",
                subject: "userInfo",
            } // 유효 기간 365일
        );

        return response(baseResponse.LOGIN_SUCCESS, {'userId': userInfoRows[0].no, 'jwt': token}); // 로그인에서는 jwt와 동시에 어떤 유저에 대한 값인지 뱉어내도록
            // 그래야지 로그인하고나서 그 결과값 잘 저장 후, 클라이언트는 jwt를 웹의 로컬 스토리지에 저장, id는 추후에 사용하게 될 API에서 자기 자신에 대한 userId 갖고 있기 떄문에 유용하게 사용
    } catch (err) {
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
///////////////////////////////////////////////////////////////////////////////////////////////


exports.createUser = async function (phone, nickname, profileimageUrl, address, latitude, longitude) {
    try {
        // <의미적 Validation> 
        // 폰번호 중복 확인 (-phone이 실제 DB에 있는 phone인지 확인)
        const phoneRows = await userProvider.phoneCheck(phone); // select(조회) 필요하다면, userProvider를 가져와서 체크
        if (phoneRows.length > 0) // 누군가가 그 번호로 가입되어 있음
            return errResponse(baseResponse.SIGNUP_REDUNDANT_PHONE);
        
        // 비밀번호 암호화

        
        // DB에 클라이언트의 값 넣기(Insert(Create))
        //const insertUserParams = [phone, nickname, profileimageUrl, address, latitude, longitude];
        const insertUserParams = [phone, nickname, profileimageUrl];
        
        const connection = await pool.getConnection(async (conn) => conn); // DB 연결
        
        const userIdResult = await userDao.insertUsers(connection, insertUserParams); // DB에 잘 들어가도록
        console.log(`추가된 회원 : ${userIdResult[0].insertId}`)
        

        // user_no값 찾기
        const user_noRow = await userProvider.user_noGet(nickname);
        const user_no = user_noRow[0][0].no
        console.log(user_no)
        
        const insertUserParams2 = [user_no, address, latitude, longitude];
        const userIdResult2 = await userDao.insertUsers2(connection, insertUserParams2); // DB에 잘 들어가도록

        // coordinate에 경도,위도 값 넣기
        const plusCoordiResult3 = await userDao.insertUser3(connection, user_no, address, latitude, longitude);

        connection.release(); // 할당 해제
        return response(baseResponse.SIGNUP_SUCCESS); // 성공 메시지 -> 이걸 다시 Controller가 받아감!

    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 


// exports.editUserTownStatus = async function (userId, address, status) {
//     try{
//         console.log(userId, address, status);
//         const connection = await pool.getConnection(async (conn) => conn);
//         const editUserTownStatusResult = await userDao.updateUserTownStatus(connection, userId, address, status);
//         connection.release();

//         return response(baseResponse.PATCHUSERTOWNSTATUS_SUCCESS);

//     } catch (err) {
//         logger.error(`App - editUserTownStatus Service error\n: ${err.message}`);
//         return errResponse(baseResponse.DB_ERROR);
//     }

// };

// exports.editUserTownMain = async function (userId, address, main){
//     try{
//         console.log(userId, address, main);
//         const connection = await pool.getConnection(async (conn) => conn);
//         const editUserTownMainResult = await userDao.updateUserTownMain(connection, userId, address, main);
        
//         // 이때 새로 추가된 동네는 자동 메인동네가 되므로, 유저가 전에 설정한 다른 동네가 있다면 그 동네를 서브동네로 바꿔줘야 함!
//         const editUserTownSubResult = await townDao.updateUserTownSub(connection, userId, address);
        
//         connection.release();
//         return response(baseResponse.PATCHUSERTOWNMAIN_SUCCESS);

//     } catch (err) {
//         logger.error(`App - editUserTownMain Service error\n: ${err.message}`);
//         return errResponse(baseResponse.DB_ERROR);
//     }
// };

// exports.editUserProduct = async function (userId, productId, title, categoryId, price, priceOffer, contents){
//     try{
//         console.log(userId, productId, title, categoryId, price, priceOffer);
//         const connection = await pool.getConnection(async (conn) => conn);
//         // if(title !== "undefined"){
//         //     console.log('확인');
//         //     const editUserProductResult = await userDao.updateUserProduct(connection, userId, productId, title, categoryId, price, priceOffer);
//         // }
        
//         const editUserProductResult = await userDao.updateUserProduct(connection, userId, productId, title, categoryId, price, priceOffer, contents);
        
//         connection.release();
//         return response(baseResponse.PATCHUSERRODUCTS_SUCCESS);

//     } catch (err) {
//         logger.error(`App - editUserProduct Service error\n: ${err.message}`);
//         return errResponse(baseResponse.DB_ERROR);
//     }
// };

// exports.editUserProductStatus = async function (userId, productId, status){
//     try{
//         console.log(userId, productId, status);
//         const connection = await pool.getConnection(async (conn) => conn);
        
//         const editUserProductStatusResult = await userDao.updateUserProductStatus(connection, userId, productId, status);
        
//         connection.release();
//         return response(baseResponse.PATCHUSERRODUCTSSTATUS_SUCCESS);

//     } catch (err) {
//         logger.error(`App - editUserProductStatus Service error\n: ${err.message}`);
//         return errResponse(baseResponse.DB_ERROR);
//     }
// };


// exports.editWishlist = async function (userId, productId, status) {
//     try {
//         const connection = await pool.getConnection(async (conn) => conn);
//         const editWishlistResult = await userDao.updateWishlist(connection, userId, productId, status);
//         connection.release();

//         return response(baseResponse.PATCHWISHLIST_SUCCESS);

//     } catch (err) {
//         logger.error(`App - editWishlist Service error\n: ${err.message}`);
//         return errResponse(baseResponse.DB_ERROR);
//     }
// }

// exports.editReserved = async function (userId, productId, reserved) {
//     try{
//         const connection = await pool.getConnection(async (conn) => conn);
//         const editReservedResult = await userDao.updateReserved(connection, userId, productId, reserved);
//         connection.release();

//         return response(baseResponse.PATCHRESERVED_SUCCESS);
//     } catch (err) {
//         logger.error(`App - editReserved Service error\n: ${err.message}`);
//         return errResponse(baseResponse.DB_ERROR);
//     }
// }

// exports.editCompleted = async function (userId, productId, completed) {
//     try{
//         const connection = await pool.getConnection(async (conn) => conn);
//         const editCompletedResult = await userDao.updateCompleted(connection, userId, productId, completed);
//         connection.release();

//         return response(baseResponse. PATCHCOMPLETED_SUCCESS);
//     } catch (err) {
//         logger.error(`App - editCompleted Service error\n: ${err.message}`);
//         return errResponse(baseResponse.DB_ERROR);
//     }
// }