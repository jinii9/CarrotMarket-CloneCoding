const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus"); // 여기서 baseResponse
const {response, errResponse} = require("../../../config/response"); // 여기서 response require

// const regexEmail = require("regex-email");
// const {emit} = require("nodemon");

/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */
exports.getTest = async function (req, res) { // 외부에서 사용할 수 있도록 exports
    return res.send(response(baseResponse.SUCCESS)) // 응답에 대해서 response 보내주고 있음
}

////////////////////////////////////////////////////////////////////////////////////////////////
// TODO: After 로그인 인증 방법 (JWT)
/**
 * API No. _
 * API Name : 로그인 API
 * [POST] /app/login
 * body : phone (실제 DB에 있는 유저인지 확인하고, jwt 생성할 것!)
 */
exports.login = async function (req, res) {

    const {phone} = req.body;

    // TODO: email, password 형식적 Validation
    // 빈 값 체크
    if(!phone) 
        return res.send(response(baseResponse.SIGNUP_PHONE_EMPTY));

    const signInResponse = await userService.postSignIn(phone);

    return res.send(signInResponse);
};
///////////////////////////////////////////////////////////////////////////////////////////////

/**
 * API No. 1
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/users
 */
exports.postUsers = async function (req, res) {

    /**
     * Body: phone, nickname, profileimageUrl, address, latitude, longitude
     */
    
    // 클라이언트에서 넘겨주는 값들
    const {phone, nickname, profileimageUrl, address, latitude, longitude} = req.body;

    // <Validation>
    // 빈 값 체크
    if (!phone)
        return res.send(response(baseResponse.SIGNUP_PHONE_EMPTY));
    
    // 길이 체크
    if (phone.length != 11)
        return res.send(response(baseResponse.SIGNUP_PHONE_LENGTH));
    
    // 형식 체크 (by 정규표현식)

    if (!nickname)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_EMPTY));

   
    const signUpResponse = await userService.createUser( // userService의 createUser 함수로 이동
        phone,
        nickname,
        profileimageUrl,
        address, 
        latitude, 
        longitude
    );

    
    // 값 다시 돌려받으면,
    return res.send(signUpResponse); // 응답해줌    
};

// /**
//  * API No. 2
//  * API Name : 특정 유저 동네 정보 조회 API
//  * [GET] /app/users/{userId}/town
//  */
// exports.getUserByTown = async function (req, res) {
//     /**
//      * Path Variable: userId(user_no)
//      */
//     const userId = req.params.userId; // 포스트맨에서 칠 때 'localhost:3000/app/users/1'의 '1'을 가져옴 -> 즉, req.params.userId = /:userid 부분

//     //if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

//     const userByUserTown = await userProvider.retrieveUserTown(userId);
//     return res.send(response(baseResponse.GETUSERBYTOWN_SUCCESS, userByUserTown));
// };

// /**
//  * API No. 3
//  * API Name : 특정 유저 동네 수정 API (범위수정) 
//  * [PATCH] /app/users/{userId}/town/scale
//  * path variable : userId
//  * body : address, scale
//  */
// exports.patchUserTownScale = async function (req, res) {
//     // jwt 일단 제외
//     const userId = req.params.userId; // Path Variable
//     const address = req.body.address; 
//     const scale = req.body.scale;

//     // if (!nickname) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));

//     const editUserTownScale = await userService.editUserTownScale(userId, address, scale)
//     return res.send(editUserTownScale);
// };

// /**
//  * API No. 4
//  * API Name : 특정 유저 동네 삭제처리 API (status수정) 
//  * [PATCH] /app/users/{userId}/town/status
//  * path variable : userId
//  * body : address, status
//  */
// exports.patchUserTownStatus = async function (req, res) {
//     // jwt 일단 제외
//     const userId = req.params.userId; // Path Variable
//     const address = req.body.address; 
//     const status = req.body.status;

//     // if (!nickname) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));

//     const editUserTownStatus = await userService.editUserTownStatus(userId, address, status);
//     return res.send(editUserTownStatus);
// };

// /**
//  * API No. 5
//  * API Name : 특정 유저 '메인' 동네 수정 API (main수정) 
//  * [PATCH] /app/users/{userId}/town/main
//  * path variable : userId
//  * body : address, main
//  */
// exports.patchUserTownMain = async function (req, res) {
//     const userId = req.params.userId; // Path Variable
//     const address = req.body.address; 
//     const main = req.body.main;

//     const editUserTownMain = await userService.editUserTownMain(userId, address, main);
//     return res.send(editUserTownMain);   
// };


// /**
//  * API No. 6
//  * API Name : 특정 유저 상품 정보 수정 API (게시한 상품 수정) 
//  * [PATCH] /app/users/:userId/product/:productId
//  * path variable : userId, productId
//  * body : title, categoryId, price, priceOffer, contents
//  */
// exports.patchUserProduct = async function (req, res) {

//     const userId = req.params.userId; // Path Variable
//     const productId = req.params.productId;
//     const title = req.body.title; 
//     const categoryId = req.body.categoryId;
//     const price = req.body.price;
//     const priceOffer = req.body.priceOffer;
//     const contents = req.body.contents;

//     const editUserProduct = await userService.editUserProduct(userId, productId, title, categoryId, price, priceOffer, contents);
//     return res.send(editUserProduct);   
// };

// /**
//  * API No. 6-2
//  * API Name : 특정 유저 상품 삭제처리 API 
//  * [PATCH] /app/users/:userId/product/:productId/status
//  * path variable : userId, productId
//  * body : status
//  */
// exports.patchUserProductStatus = async function (req, res) {

// const userId = req.params.userId; // Path Variable
// const productId = req.params.productId;
// const status = req.body.status; 

// const editUserProductStatus = await userService.editUserProductStatus(userId, productId, status);
// return res.send(editUserProductStatus);   
// };
    

// /**
//  * API No. 7
//  * API Name : 특정 유저 관심목록 조회 API
//  * [GET] /app/users/{userId}/wishlist
//  */
// exports.getUserByWishlist = async function (req, res){
//     /**
//      * Path Variable: userId(user_no)
//      */
//     const userId = req.params.userId;
    
//     const userByUserWishlist = await userProvider.retrieveUserWishlist(userId);
//     return res.send(response(baseResponse.GETUSERBYWISHLIST_SUCCESS, userByUserWishlist));
// };

// /**
//  * API No. 8
//  * API Name : 특정 유저 관심목록 수정,삭제처리 API
//  * [PATCH] /app/users/{userId}/wishlist/{productId}/status
//  */
// exports.patchWishlists = async function (req, res){
//     const userId = req.params.userId; // Path Variable
//     const productId = req.params.productId;
    
//     const status = req.body.status;

//     const editWishlist = await userService.editWishlist(userId, productId, status);
//     return res.send(editWishlist);
// };

// /**
//  * API No. 9
//  * API Name : 특정 유저 판매내역 판매중 조회 API
//  * [GET] /app/users/{userId}/saleslists
//  */
// exports.getUserBySaleslist = async function (req, res){
//     const userId = req.params.userId;

//     if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
//     const userBySaleslist = await userProvider.retrieveSaleslist(userId);
//     return res.send(response(baseResponse.GETSALESLIST_SUCCESS, userBySaleslist));
// };
// /**
//  * API No. 10
//  * API Name : 특정 유저 판매내역 판매중 조회 API
//  * [GET] /app/users/{userId}/saleslists/completed
//  */
// exports.getUserByCompletedSaleslist = async function (req, res){
//     const userId = req.params.userId;

//     if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
//     const userByCompletedSaleslist = await userProvider.retrieveCompletedSaleslist(userId);
//     return res.send(response(baseResponse.GETSALESLIST_SUCCESS, userByCompletedSaleslist));
// };

// /**
//  * API No. 11
//  * API Name : 특정 유저 구매내역 조회 API
//  * [GET] /app/users/{userId}/purchaselist
//  */
// exports.getUserByPurchaselist = async function (req, res) {
//     /**
//      * Path Variable: userId
//      */
//      const userId = req.params.userId;

//      if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

//      const userByPurchaselist = await userProvider.retrievePurchaselist(userId);
//      return res.send(response(baseResponse.GETPURCHASELIST_SUCCESS, userByPurchaselist));

// };

// /**
//  * API No. 12
//  * API Name : 특정 유저의 제품 예약중 수정 API
//  * [PATCH] /app/users/:userId/product/:productId/reserved
//  * path variable : userId, productId
//  * body : reserved
//  */
// exports.patchUserProductReserve = async function (req, res) {
//     const userId = req.params.userId;
//     const productId = req.params.productId;
//     const reserved = req.body.reserved;

//     //if (!nickname) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));

//     const editReserved = await userService.editReserved(userId, productId, reserved);
//     return res.send(editReserved);

// };

// /**
//  * API No. 12-2
//  * API Name : 특정 유저의 제품 거래완료 수정 API
//  * [PATCH] /app/users/:userId/product/:productId/reserved
//  * path variable : userId, productId
//  * body : reserved
//  */
// exports.patchUserProductCompleted = async function (req, res) {
//     const userId = req.params.userId;
//     const productId = req.params.productId;
//     const completed = req.body.completed;
//     console.log(completed);
//     //if (!nickname) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));

//     const editCompleted = await userService.editCompleted(userId, productId, completed);
//     return res.send(editCompleted);

// };

