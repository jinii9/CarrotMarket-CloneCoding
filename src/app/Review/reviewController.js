const jwtMiddleware = require("../../../config/jwtMiddleware");
const reviewProvider = require("../../app/Review/reviewProvider");
const reviewService = require("../../app/Review/reviewService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/**
 * API No. 1
 * API Name : 리뷰 생성 API
 * [POST] /app/reviews
 */
exports.postReviews = async function (req, res) {
    /**
     * Body: user_no, product_no, seller, buyer, preferenceChecks_no, contents
     */
     const {user_no, role, target, product_no, preferenceCheck, preferencelists, contents} = req.body;    
    // 의미적 validation 체크
    
    
    //console.log(user_no, product_no, seller, buyer, preferenceCheck, preferencelists, contents);
    const postReviewResponse = await reviewService.createReview(
        user_no,
        role,
        target,
        product_no,
        preferenceCheck,
        preferencelists,
        contents
    );
        
    
    return res.send(postReviewResponse);
};