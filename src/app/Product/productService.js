const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const productProvider = require("./productProvider");
const productDao = require("./productDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createProduct = async function (user_no, address_no, title, category_no, price, priceOffer, contents, productimage) {
    try {
        // <의미적 Validation> 
        // X
        

        // DB에 클라이언트의 값 넣기(Insert(Create))
        // < Products테이블에 넣는 과정 >
        const insertProductParams = [user_no, address_no, title, category_no, price, priceOffer, contents];
            //const insertProductParams2 = [user_no, productimage];

        const connection = await pool.getConnection(async (conn) => conn); // DB 연결
        
        const productIdResult = await productDao.insertProducts(connection, insertProductParams); // DB에 잘 들어가도록
        console.log(`추가된 상품 : ${productIdResult[0].insertId}`)
        
        // < ProductimageUrl테이블에 넣는 과정 >
        // product_no값 가져오기
        const product_noRow = await productProvider.product_noGet(user_no, title);
        //console.log('추가된 상품번호 : ')
        //console.log(product_noRow)

        const product_no = product_noRow[0][0].no
        console.log('추가된 상품 번호 : ' + product_no);
        // DB에 넣기
        const insertProductParams2 = [user_no, product_no, productimage];
        const productIdResult2 = await productDao.insertProducts2(connection, insertProductParams2); // DB에 잘 들어가도록

        // ProductStates테이블에 넣기
        const productIdResult3 = await productDao.insertProducts3(connection, product_no);

        connection.release(); // 할당 해제
        return response(baseResponse.POSTPRODUCT_SUCCESS); // 성공 메시지 -> 이걸 다시 Controller가 받아감!

    } catch (err) {
        logger.error(`App - createProduct Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.editProduct = async function (productId, title, categoryId, price, priceOffer, contents){
    try{
        console.log(productId, title, categoryId, price, priceOffer);
        const connection = await pool.getConnection(async (conn) => conn);
        // if(title !== "undefined"){
        //     console.log('확인');
        //     const editUserProductResult = await userDao.updateUserProduct(connection, userId, productId, title, categoryId, price, priceOffer);
        // }
        
        const editProductResult = await productDao.updateProduct(connection, productId, title, categoryId, price, priceOffer, contents);
        
        connection.release();
        return response(baseResponse.PATCHUSERRODUCTS_SUCCESS);

    } catch (err) {
        logger.error(`App - editProduct Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.editProductStatus = async function (productId, status){
    try{
        console.log(productId, status);
        const connection = await pool.getConnection(async (conn) => conn);
        
        const editProductStatusResult = await productDao.updateProductStatus(connection, productId, status);
        
        connection.release();
        return response(baseResponse.PATCHUSERRODUCTSSTATUS_SUCCESS);

    } catch (err) {
        logger.error(`App - editProductStatus Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

//
exports.editReserved = async function (productId, reserved) {
    try{
        const connection = await pool.getConnection(async (conn) => conn);
        const editReservedResult = await productDao.updateReserved(connection, productId, reserved);
        connection.release();

        return response(baseResponse.PATCHRESERVED_SUCCESS);
    } catch (err) {
        logger.error(`App - editReserved Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}

exports.editCompleted = async function (productId, completed) {
    try{
        const connection = await pool.getConnection(async (conn) => conn);
        const editCompletedResult = await productDao.updateCompleted(connection, productId, completed);
        connection.release();

        return response(baseResponse. PATCHCOMPLETED_SUCCESS);
    } catch (err) {
        logger.error(`App - editCompleted Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}