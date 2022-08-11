const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const wishlistDao = require("./wishlistDao");

exports.retrieveUserWishlist = async function (userId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userWishlistResult = await wishlistDao.selectUserWishlist(connection, userId);
    
    connection.release();
  
    return userWishlistResult; 
  }