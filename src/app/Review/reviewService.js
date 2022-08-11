const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const reviewProvider = require("./reviewProvider");
const reviewDao = require("./reviewDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createReview = async function (user_no, role, target, product_no, preferenceCheck, preferencelists, contents) {
    try {
        // 의미적 validation

        //const insertReviewParams = [user_no, product_no, seller, buyer, preferenceCheck, preferencelists, contents];

        const connection = await pool.getConnection(async (conn) => conn);

        const ReviewIdResult = await reviewDao.insertReview(connection, user_no, role, target, product_no, preferenceCheck, preferencelists, contents);
        console.log(`추가된 리뷰 : ${ReviewIdResult[0].insertId}`)
        connection.release();
        return response(baseResponse.POSTREVIEW_SUCCESS);


    } catch (err) {
        logger.error(`App - createReview Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};