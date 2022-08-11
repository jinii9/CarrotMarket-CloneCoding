const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const productDao = require("./productDao");

// const userDao = require("./userDao");

// // Provider: Read 비즈니스 로직 처리

// exports.phoneCheck = async function (phone) {
//   const connection = await pool.getConnection(async (conn) => conn); // DB 연결
//   const phoneCheckResult = await userDao.selectUserPhone(connection, phone); // 존재한다면, phoneCheckResult에 값 들어감
//   connection.release(); // pool 다 사용했다면, release 통해서 해제해줘야함!

//   return phoneCheckResult;
// };

// jwt userId와 비교 위한 userId 가져오기
exports.userIdCheck = async function(productId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userIdResult = await productDao.selectUserNo(connection, productId);
    const userId = userIdResult.user_no;
    connection.release();
    return userId;
};

exports.product_noGet = async function (user_no, title) {
    const connection = await pool.getConnection(async (conn) => conn);
    const selectProductNoParams = [user_no, title];
    const product_noGetResult = await productDao.selectProductNo(connection, selectProductNoParams);
    //console.log(product_noGetResult);
    connection.release();
    return product_noGetResult;
  };

  exports.retrieveUserAddress = async function (addressId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userAddressResult = await productDao.selectUserAddress(connection, addressId);
    
    connection.release();
  
    return userAddressResult[0]; // 얘는 '특정'이기 때문에 [0]으로 뿌려줌 -> object 형식으로 응답됨

  };

  // exports.test = async function(userId, userAddress, lat, long) {
    
  //   // const points = [
  //   //     [{ lat: 1, long: 4}]
  //   // ];

  //   const connection = await pool.getConnection(async (conn) => conn);
  //   const testResult = await productDao.test(connection, userId, userAddress, lat, long);
    
  //   connection.release();
  
  //   return testResult[0]; // 얘는 '특정'이기 때문에 [0]으로 뿌려줌 -> object 형식으로 응답됨

  // }

  exports.retrieveDistance = async function(userLatitude, userLongitude, userScale){
    const connection = await pool.getConnection(async (conn) => conn);
    //console.log('확인0');
    if(userScale == 3){
      //console.log('확인');
      userScale = 7000; // 3km
    }
    else if(userScale == 6){
      userScale = 8000;
    }
    else{
      userScale = 9000;
    }
    const DistanceResult = await productDao.selectDistance(connection, userLatitude, userLongitude, userScale);
    
    connection.release();
  
    return DistanceResult;
  };

  exports.retrieveTitleDistance = async function(userLatitude, userLongitude, userScale , title) {
    const connection = await pool.getConnection(async (conn) => conn);
    console.log('title : ' + title);
    if(userScale == 3){
      userScale = 7000; // 3km
    }
    else if(userScale == 6){
      userScale = 8000;
    }
    else{
      userScale = 9000;
    }
    console.log('scale : ' + userScale);
    const DistanceTitleResult = await productDao.selectTitleDistance(connection, userLatitude, userLongitude, userScale, title);
    
    connection.release();
  
    return DistanceTitleResult;
  };

  //
  exports.retrieveSaleslist = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userSaleslistResult = await productDao.selectUserSaleslist(connection, userId);
  
    connection.release();
  
    return userSaleslistResult; 
  
  }
  
  exports.retrieveCompletedSaleslist = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userCompleted_SaleslistResult = await productDao.selectUserCompleted_Saleslist(connection, userId);
  
    connection.release();
  
    return userCompleted_SaleslistResult; 
  
  }
  
  exports.retrievePurchaselist = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const purchaselistResult = await productDao.selectPurchaselist(connection, userId);
  
    connection.release();
  
    return purchaselistResult;
  }
  