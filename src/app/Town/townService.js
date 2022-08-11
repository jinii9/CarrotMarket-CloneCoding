const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const townProvider = require("./townProvider");
const townDao = require("./townDao");
const userDao = require("../../app/User/userDao")
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createTown = async function (userId, address, latitude, longitude,scale) {
    try {
        // 동네 중복 확인
        const townRows = await townProvider.townCheck(userId, address);
        if (townRows.length > 0)
            return errResponse(baseResponse.POSTTOWN_REDUNDANT_TOWN);


        const insertAddressesParams = [userId, address, latitude, longitude, scale];
        const connection = await pool.getConnection(async (conn) => conn);
        const addressIdResult = await townDao.insertAddresses(connection, insertAddressesParams);

        console.log(addressIdResult);    
        console.log(`추가된 동네 : ${addressIdResult[0].insertId}`)
        //coordi
        // coordinate에 경도,위도 값 넣기
        const plusCoordiResult3 = await userDao.insertUser3(connection, userId, address, latitude, longitude);
        
        // 이때 새로 추가된 동네는 자동 메인동네가 되므로, 유저가 전에 설정한 다른 동네가 있다면 그 동네를 서브동네로 바꿔줘야 함!
        const editUserTownSubResult = await townDao.updateUserTownSub(connection, userId, address);

        
        connection.release();
        return response(baseResponse.POSTTOWN_SUCCESS);

    } catch (err) {
        logger.error(`App - createTown Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.editUserTownScale = async function (userId, address, scale) {
    try{
        //console.log(userId, address, scale);
        const connection = await pool.getConnection(async (conn) => conn);
        const editUserTownScaleResult = await townDao.updateUserTownScale(connection, userId, address, scale);
        connection.release();

        return response(baseResponse.PATCHUSERTOWNSCALE_SUCCESS);

    } catch (err) {
        logger.error(`App - editUserTownScale Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.editUserTownStatus = async function (userId, address, status) {
    try{
        console.log(userId, address, status);
        const connection = await pool.getConnection(async (conn) => conn);
        const editUserTownStatusResult = await townDao.updateUserTownStatus(connection, userId, address, status);
        connection.release();

        return response(baseResponse.PATCHUSERTOWNSTATUS_SUCCESS);

    } catch (err) {
        logger.error(`App - editUserTownStatus Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }

};

exports.editUserTownMain = async function (userId, address, main){
    try{
        console.log(userId, address, main);
        const connection = await pool.getConnection(async (conn) => conn);
        const editUserTownMainResult = await townDao.updateUserTownMain(connection, userId, address, main);
        
        // 이때 새로 추가된 동네는 자동 메인동네가 되므로, 유저가 전에 설정한 다른 동네가 있다면 그 동네를 서브동네로 바꿔줘야 함!
        const editUserTownSubResult = await townDao.updateUserTownSub(connection, userId, address);
        
        connection.release();
        return response(baseResponse.PATCHUSERTOWNMAIN_SUCCESS);

    } catch (err) {
        logger.error(`App - editUserTownMain Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};