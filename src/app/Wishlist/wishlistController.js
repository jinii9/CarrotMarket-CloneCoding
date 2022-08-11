const jwtMiddleware = require("../../../config/jwtMiddleware");
const wishlistProvider = require("../../app/Wishlist/wishlistProvider");
const wishlistService = require("../../app/Wishlist/wishlistService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/**
 * API No. 1
 * API Name : 위시리스트 생성 API
 * [POST] /app/wishlists/:userId
 */
exports.postWishlist = async function (req, res) {
    /**
     * Body: user_no, product_no
     */
    const userId = req.params.userId;
    const {product_no} = req.body;

    // 형식적 validation

    const postWishlistResponse = await wishlistService.createWishlist(
        userId,
        product_no
    );

    return res.send(postWishlistResponse);
};

/**
 * API No. 7
 * API Name : 특정 유저 관심목록 조회 API
 * [GET] /app/wishlists/:userId
 */
 exports.getUserByWishlist = async function (req, res){
    /**
     * Path Variable: userId(user_no)
     */
    const userId = req.params.userId;
    
    const userByUserWishlist = await wishlistProvider.retrieveUserWishlist(userId);
    return res.send(response(baseResponse.GETUSERBYWISHLIST_SUCCESS, userByUserWishlist));
};

/**
 * API No. 8
 * API Name : 특정 유저 관심목록 수정,삭제처리 API
 * [PATCH] /app/wishlists/:userId/status
 */
exports.patchWishlists = async function (req, res){
    const userId = req.params.userId; // Path Variable
    const productId = req.params.productId;
    
    const status = req.body.status;

    const editWishlist = await wishlistService.editWishlist(userId, productId, status);
    return res.send(editWishlist);
};