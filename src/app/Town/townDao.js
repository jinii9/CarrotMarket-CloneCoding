// address로 회원 조회
async function selectUserAddress(connection, userId, address) {
    console.log('townDao 연결');
    const selectUserAddressQuery = `
                  SELECT address, latitude, longitude 
                  FROM Addresses 
                  WHERE address = ? AND user_no = ?;
                  `;
    const [addressRows] = await connection.query(selectUserAddressQuery, [address, userId]);
    console.log('[addressRows]: ' + [addressRows]);
    return addressRows;
  }

// address 생성
async function insertAddresses(connection, insertAddressesParams) {
    const insertAddressesQuery = `
          INSERT INTO Addresses(user_no, address, latitude, longitude, scale)
          VALUES (?, ?, ?, ?, ?);
      `;
    const insertAddressesRow = await connection.query(
      insertAddressesQuery,
      insertAddressesParams
    );
  
    return insertAddressesRow;
  }

  // 서브동네의 main을 'N'로 바꾸기
  async function updateUserTownSub(connection, userId, address) {
    const updateUserTownSubQuery = `
          UPDATE Addresses 
          SET main = "N"
          WHERE user_no = ? AND address != ? AND status = "Y";
      `;
    console.log("테스트");
    const updateUserTownSubRow = await connection.query(
      updateUserTownSubQuery,
      [userId, address]
    );
  
    return updateUserTownSubRow[0];
  }

//
// addressId로부터 위도 경도 값 받아오기
async function selectUserAddress(connection, addressId) {
  const selectUserAddressQuery = `
      SELECT longitude, latitude
      FROM Addresses
      WHERE no = ?;
  `;
  const [userAddressRow] = await connection.query(selectUserAddressQuery, addressId);
  return userAddressRow[0];
}

// 현재 위치의 근처 동네들 조회
async function selectUserCurrentTown(connection, userLongitude, userLatitude) {
  const selectUserCurrentTownQuery = `
      SELECT town
      FROM Towns
      WHERE ST_Distance_Sphere(POINT(?, ?), POINT(longitude, latitude)) <= 20000
      ORDER BY ST_Distance_Sphere(POINT(?, ?),POINT(longitude, latitude));
  `;
  const [currentTownRows] = await connection.query(selectUserCurrentTownQuery, [userLongitude, userLatitude, userLongitude, userLatitude]);
  return currentTownRows;
}

// 특정 유저의 동네 조회
async function selectUserTown(connection, userId){
  const selectUserTownQuery = `
      SELECT user_no, address, scale
      FROM Addresses
      WHERE user_no = ?
      `;
  const [userTown] = await connection.query(selectUserTownQuery, userId); // 객체를 최대 2개 get하기때문에
  return userTown;
}

async function updateUserTownScale(connection, userId, address, scale) {
  const updateUserTownScaleQuery = `
  UPDATE Addresses 
  SET scale = ?
  WHERE user_no = ? AND address = ?;`;
  // console.log(userId);
  // console.log(address);
  // console.log(scale);
  const updateUserTownScaleRow = await connection.query(updateUserTownScaleQuery, [scale, userId, address]);
  return updateUserTownScaleRow[0];
}

async function updateUserTownStatus(connection, userId, address, status) {
  const updateUserTownStatusQuery = `
  UPDATE Addresses 
  SET status = ?
  WHERE user_no = ? AND address = ?;`;
  const updateUserTownStatusRow = await connection.query(updateUserTownStatusQuery, [status, userId, address]);
  return updateUserTownStatusRow[0];
}

async function updateUserTownMain(connection, userId, address, main) {
  const updateUserTownMainQuery = `
  UPDATE Addresses 
  SET main = ?
  WHERE user_no = ? AND address = ?;`;
  const updateUserTownStatusRow = await connection.query(updateUserTownMainQuery, [main, userId, address]);
  return updateUserTownStatusRow[0];
}

  module.exports = {
    selectUserAddress,
    selectUserCurrentTown,
    insertAddresses,
    updateUserTownSub,
    selectUserTown,
    updateUserTownScale,
    updateUserTownStatus,
    updateUserTownMain,
  };