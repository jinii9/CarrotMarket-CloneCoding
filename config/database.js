const mysql = require('mysql2/promise');
const {logger} = require('./winston');

// TODO: 본인의 DB 계정 입력
const pool = mysql.createPool({
    host: 'risingcamp-db.ctegscjoeae7.ap-northeast-2.rds.amazonaws.com',
    user: 'admin',
    port: '3306',
    password: 'yseraphic8!',
    database: 'carrotMarketDB'
});

module.exports = {
    pool: pool
};