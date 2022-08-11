const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const townDao = require("./townDao");

// Provider: Read 비즈니스 로직 처리

exports.townCheck = async function (userId, address) {
    const connection = await pool.getConnection(async (conn) => conn);
    const townCheckResult = await townDao.selectUserAddress(connection, userId, address);
    connection.release();
  
    return townCheckResult;
};

exports.retrieveCurrentTown = async function (addressId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userAddressResult = await townDao.selectUserAddress(connection, addressId);
  const userLongitude = userAddressResult.longitude;
  const userLatitude = userAddressResult.latitude;
  console.log(userLongitude, userLatitude);

  const userCurrentTownResult = await townDao.selectUserCurrentTown(connection, userLongitude, userLatitude);
  
  connection.release();

  return userCurrentTownResult;  
};

exports.retrieveUserTown = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userTownResult = await townDao.selectUserTown(connection, userId);
  
  connection.release();

  return userTownResult; // 얘는 배열로 뿌려줌 -> list(array) 형식으로 응답됨(객체 최대 2개를 배열로 한번에 뿌려줌)
};

