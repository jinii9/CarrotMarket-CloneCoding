const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const wishlistProvider = require("./wishlistProvider");
const wishlistDao = require("./wishlistDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createWishlist = async function (userId, product_no) {
    try {
        
        
        // 의미적 validation
        
        const connection = await pool.getConnection(async (conn) => conn);

        // 트랜잭션
        await connection.beginTransaction(); // 트랜잭션 적용 시작 


        const insertWishlistParams = [userId, product_no];
        const wishlistIdResult = await wishlistDao.insertWishlist(connection, insertWishlistParams);
        console.log(`추가된 위시리스트 : ${wishlistIdResult[0].insertId}`)
        
        // 해당 product의 하트 수 +1 증가해주기
        const likeCountResult = await wishlistDao.updateLikeCount(connection, product_no);
        
        await connection.commit(); // 트랜잭션 커밋 (DB에 한꺼번에 반영)
        connection.release();
        return response(baseResponse.POSTWISHLIST_SUCCESS);
    
    } catch (err) {
        await connection.rollback(); // 롤백
        logger.error(`App - createWishlist Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
    
};

exports.editWishlist = async function (userId, productId, status) {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        const editWishlistResult = await wishlistDao.updateWishlist(connection, userId, productId, status);
        
        // // 하트 수 증가
        // if(status = 'Y'){
        //     const likeCountResult = await wishlistDao.updateLikeCount(connection, user_no, product_no);
        // }

        connection.release();
        return response(baseResponse.PATCHWISHLIST_SUCCESS);

    } catch (err) {
        logger.error(`App - editWishlist Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}