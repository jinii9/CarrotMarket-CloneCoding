const jwtMiddleware = require("../../../config/jwtMiddleware");
const townProvider = require("../../app/Town/townProvider");
const townService = require("../../app/Town/townService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/**
 * API No. 1
 * API Name : 동네 생성 API
 * [POST] /app/towns/:userId
 */
exports.postTowns = async function(req, res) {
    /**
     * Path Variable : userId
     * Body: address, latitude, longitude, range
     * (range는 일단 3,6,9로 지정)
     */
     const userId = req.params.userId; // Path Variable
     const {address, latitude, longitude, scale} = req.body;

     // 빈 값 체크
        // (화면에서 버튼만 누르면 돼서 유저가 딱히 입력하는건 없을듯?)
 
     // + main 추가할 것
     const postTownResponse = await townService.createTown(
        userId, 
        address, 
        latitude, 
        longitude, 
        scale
     );
 
     return res.send(postTownResponse);
};

/**
 * API No. 1-2
 * API Name : 현재위치 근처 동네들 조회 API
 * [GET] /app/towns/:addressId
 */
exports.getCurrentTowns = async function(req, res) {
   const addressId = req.params.addressId; // Path Variable

   const userByCurrentTowns = await townProvider.retrieveCurrentTown(addressId);
   return res.send(response(baseResponse.GETUSERBYCURRENTTOWN_SUCCESS, userByCurrentTowns));
};

/**
 * API No. 2
 * API Name : 특정 유저 동네 정보 조회 API
 * [GET] /app/towns/{userId}
 */
 exports.getUserByTown = async function (req, res) {
   /**
    * Path Variable: userId(user_no)
    */
   const userId = req.params.userId; // 포스트맨에서 칠 때 'localhost:3000/app/users/1'의 '1'을 가져옴 -> 즉, req.params.userId = /:userid 부분

   //if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

   const userByUserTown = await townProvider.retrieveUserTown(userId);
   return res.send(response(baseResponse.GETUSERBYTOWN_SUCCESS, userByUserTown));
};

/**
 * API No. 3
 * API Name : 특정 유저 동네 수정 API (범위수정) 
 * [PATCH] /app/towns/:userId/range
 * path variable : userId
 * body : address, scale
 */
 exports.patchUserTownScale = async function (req, res) {
   // jwt 일단 제외
   const userId = req.params.userId; // Path Variable
   const address = req.body.address; 
   const scale = req.body.scale;

   // if (!nickname) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));

   const editUserTownScale = await townService.editUserTownScale(userId, address, scale)
   return res.send(editUserTownScale);
};

/**
 * API No. 4
 * API Name : 특정 유저 동네 삭제처리 API (status수정) 
 * [PATCH] /app/towns/{userId}/status
 * path variable : userId
 * body : address, status
 */
 exports.patchUserTownStatus = async function (req, res) {
   // jwt 일단 제외
   const userId = req.params.userId; // Path Variable
   const address = req.body.address; 
   const status = req.body.status;

   // if (!nickname) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));

   const editUserTownStatus = await townService.editUserTownStatus(userId, address, status);
   return res.send(editUserTownStatus);
};

/**
* API No. 5
* API Name : 특정 유저 '메인' 동네 수정 API (main수정) 
* [PATCH] /app/towns/{userId}/main
* path variable : userId
* body : address, main
*/
exports.patchUserTownMain = async function (req, res) {
   const userId = req.params.userId; // Path Variable
   const address = req.body.address; 
   const main = req.body.main;

   const editUserTownMain = await townService.editUserTownMain(userId, address, main);
   return res.send(editUserTownMain);   
};


