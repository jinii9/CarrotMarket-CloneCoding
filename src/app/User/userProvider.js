const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");

// Provider: Read 비즈니스 로직 처리

///////////////////////////////////////////////////////////////////////////////////////////////
exports.accountCheck = async function (phone) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userAccountResult = await userDao.selectUserAccount(connection, phone);
  connection.release();

  return userAccountResult;
};
///////////////////////////////////////////////////////////////////////////////////////////////

exports.phoneCheck = async function (phone) {
  const connection = await pool.getConnection(async (conn) => conn); // DB 연결
  const phoneCheckResult = await userDao.selectUserPhone(connection, phone); // 존재한다면, phoneCheckResult에 값 들어감
  connection.release(); // pool 다 사용했다면, release 통해서 해제해줘야함!

  return phoneCheckResult;
};

exports.user_noGet = async function (nickname) {
  const connection = await pool.getConnection(async (conn) => conn);
  const user_noGetResult = await userDao.selectUserNo(connection, nickname);
  //console.log(product_noGetResult);
  connection.release();
  return user_noGetResult;
};
//

// exports.retrieveUserTown = async function (userId) {
//   const connection = await pool.getConnection(async (conn) => conn);
//   const userTownResult = await userDao.selectUserTown(connection, userId);
  
//   connection.release();

//   return userTownResult; // 얘는 배열로 뿌려줌 -> list(array) 형식으로 응답됨(객체 최대 2개를 배열로 한번에 뿌려줌)
// };

// exports.retrieveUserWishlist = async function (userId) {
//   const connection = await pool.getConnection(async (conn) => conn);
//   const userWishlistResult = await userDao.selectUserWishlist(connection, userId);
  
//   connection.release();

//   return userWishlistResult; 
// }

// exports.retrieveSaleslist = async function (userId) {
//   const connection = await pool.getConnection(async (conn) => conn);
//   const userSaleslistResult = await userDao.selectUserSaleslist(connection, userId);

//   connection.release();

//   return userSaleslistResult; 

// }

// exports.retrieveCompletedSaleslist = async function (userId) {
//   const connection = await pool.getConnection(async (conn) => conn);
//   const userCompleted_SaleslistResult = await userDao.selectUserCompleted_Saleslist(connection, userId);

//   connection.release();

//   return userCompleted_SaleslistResult; 

// }

// exports.retrievePurchaselist = async function (userId) {
//   const connection = await pool.getConnection(async (conn) => conn);
//   const purchaselistResult = await userDao.selectPurchaselist(connection, userId);

//   connection.release();

//   return purchaselistResult;
// }
