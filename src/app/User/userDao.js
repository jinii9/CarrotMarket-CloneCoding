///////////////////////////////////////////////////////////////////////////////////////////////
// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection, phone) {
  const selectUserAccountQuery = `
        SELECT status, no
        FROM Users 
        WHERE phone = ?;`;
  const selectUserAccountRow = await connection.query(
      selectUserAccountQuery,
      phone
  );
  return selectUserAccountRow[0];
}

///////////////////////////////////////////////////////////////////////////////////////////////

// 전화번호로 회원 조회
async function selectUserPhone(connection, phone) {
  const selectUserPhoneQuery = `
                SELECT phone, nickname
                FROM Users 
                WHERE phone = ?;
                `; // 그 전화번호 가진 어떤 유저가 있다면
  const [phoneRows] = await connection.query(selectUserPhoneQuery, phone); // 여기에 넘겨줘서, (phone은 ?에 들어감) 존재한다면, phoneRows배열에 들어감
  return phoneRows;
}

// 유저 생성
async function insertUsers(connection, insertUserParams) {

  const insertUsersQuery = `
        INSERT INTO Users(phone, nickname, profileimageUrl)
        VALUES (?, ?, ?)
    `;
  // const insertUsersQuery2 = `
  //       INSERT INTO Addresses(address, latitude, longitude)
  //       VALUES (?, ?, ?)
  //   `;

  const insertUsersRow = await connection.query(
    insertUsersQuery,
    insertUserParams
  );
  // const insertUsersRow2 = await connection.query(
  //   insertUsersQuery2,
  //   insertUserParams2
  // );
  
  return insertUsersRow;
}

// nickname으로 user_no 조회
async function selectUserNo(connection, nickname) {
  const selectProductNoQuery = `
                SELECT no 
                FROM Users 
                WHERE nickname = ?;
                `;
  const user_noRow = await connection.query(selectProductNoQuery, nickname);
  return user_noRow;
}

// 유저 생성
async function insertUsers2(connection, insertUserParams2) {

  const insertUsersQuery2 = `
        INSERT INTO Addresses(user_no, address, latitude, longitude)
        VALUES (?, ?, ?, ?)
    `;

  const insertUsersRow2 = await connection.query(
    insertUsersQuery2,
    insertUserParams2
  );
  
  return insertUsersRow2;
}

// 유저 생성 + coordi
async function insertUser3(connection, userId, address, latitude, longitude) {
  const testQuery = `
    UPDATE Addresses
    SET coordinate = POINT(?,?)
    WHERE user_no = ? AND address = ?;
  `;
  const [coordiResult] = await connection.query(testQuery, [longitude, latitude, userId, address]);
  console.log(longitude, latitude);
  console.log('완료');
  return coordiResult;
}

// //
// // 특정 유저의 동네 조회
// async function selectUserTown(connection, userId){
//   const selectUserTownQuery = `
//       SELECT user_no, address, scale
//       FROM Addresses
//       WHERE user_no = ?
//       `;
//   const [userTown] = await connection.query(selectUserTownQuery, userId); // 객체를 최대 2개 get하기때문에
//   return userTown;
// }

// async function updateUserTownScale(connection, userId, address, scale) {
//   const updateUserTownScaleQuery = `
//   UPDATE Addresses 
//   SET scale = ?
//   WHERE user_no = ? AND address = ?;`;
//   // console.log(userId);
//   // console.log(address);
//   // console.log(scale);
//   const updateUserTownScaleRow = await connection.query(updateUserTownScaleQuery, [scale, userId, address]);
//   return updateUserTownScaleRow[0];
// }

// async function updateUserTownStatus(connection, userId, address, status) {
//   const updateUserTownStatusQuery = `
//   UPDATE Addresses 
//   SET status = ?
//   WHERE user_no = ? AND address = ?;`;
//   const updateUserTownStatusRow = await connection.query(updateUserTownStatusQuery, [status, userId, address]);
//   return updateUserTownStatusRow[0];
// }

// async function updateUserTownMain(connection, userId, address, main) {
//   const updateUserTownMainQuery = `
//   UPDATE Addresses 
//   SET main = ?
//   WHERE user_no = ? AND address = ?;`;
//   const updateUserTownStatusRow = await connection.query(updateUserTownMainQuery, [main, userId, address]);
//   return updateUserTownStatusRow[0];
// }

// async function updateUserProduct(connection, userId, productId, title, categoryId, price, priceOffer, contents) {
//   console.log('테스트 : ' + userId, productId, title, categoryId, price, priceOffer, contents);

//   let updateTitleRow = [];
//   let updateCategoryRow = [];
//   let updatePriceRow = [];
//   let updatePriceOfferRow = [];
//   let updateContentsRow = [];
  
//   if(title != null){ // 이때 undefined와 null은 동등비교에서 같다 -> 따라서 null이 아닐 때 = undefined가 아닐 때
//       console.log('title 확인');
//       const updateTitleQuery = `
//       UPDATE Products 
//       SET title = ?
//       WHERE user_no = ? AND no = ?;
//       `;
//       updateTitleRow = await connection.query(updateTitleQuery, [title, userId, productId]);
//   }
//   if(categoryId != null){
//     console.log('category 확인');
//     const updateCategoryQuery = `
//     UPDATE Products 
//     SET category_no = ?
//     WHERE user_no = ? AND no = ?;
//     `;
//     updateCategoryRow = await connection.query(updateCategoryQuery, [categoryId, userId, productId]);
//   }
//   if(price != null){
//     console.log('price 확인');
//     const updatePriceQuery = `
//     UPDATE Products 
//     SET price = ?
//     WHERE user_no = ? AND no = ?;
//     `;
//     updatePriceRow = await connection.query(updatePriceQuery, [price, userId, productId]);
//   }  
//   if(priceOffer != null){
//     console.log('priceOffer 확인');
//     const updatePriceOfferQuery = `
//     UPDATE Products 
//     SET priceOffer = ?
//     WHERE user_no = ? AND no = ?;
//     `;
//     updatePriceOfferRow = await connection.query(updatePriceOfferQuery, [priceOffer, userId, productId]);
//   } 
//   if(contents != null){
//     console.log('contents 확인');
//     const updateContentsQuery = `
//     UPDATE Products 
//     SET contents = ?
//     WHERE user_no = ? AND no = ?;
//     `;
//     updateContentsRow = await connection.query(updateContentsQuery, [contents, userId, productId]);
//   } 


//   return [updateTitleRow, updateCategoryRow, updatePriceRow, updatePriceOfferRow, updateContentsRow];
// }


// async function updateUserProductStatus(connection, userId, productId, status) {

//     const updateSatusQuery = `
//     UPDATE Products 
//     SET status = ?
//     WHERE user_no = ? AND no = ?;
//     `;
//     updateStatusRow = await connection.query(updateSatusQuery, [status, userId, productId]);
  
//   return updateStatusRow[0];
// }

// // 특정 유저의 동네 조회
// async function selectUserWishlist(connection, userId){
//   const selectUserWishlistQuery = `
//     SELECT Wishlists.user_no, Wishlists.product_no, title, address, price, productimageUrl, chatCount, likeCount
//     FROM Wishlists
//             INNER JOIN Products ON Wishlists.product_no = Products.no
//             INNER JOIN ProductImages ON Wishlists.product_no = ProductImages.product_no
//             INNER JOIN Addresses ON Products.address_no = Addresses.no
//     WHERE Wishlists.user_no = ? AND ProductImages.mainimage = 'Y';
//       `;
//   const [userWishlist] = await connection.query(selectUserWishlistQuery, userId);
//   return userWishlist;
// }

// // 특정 유저의 위시리스트 수정
// async function updateWishlist(connection, userId, productId, status) {
//   const updateWishlistQuery = `
//     UPDATE Wishlists
//     SET status = ?
//     WHERE user_no = ? AND product_no = ?;`;
//     const updateWishlistRow = await connection.query(updateWishlistQuery, [status, userId, productId]);
//     return updateWishlistRow[0];
// }

// // 특정 유저의 판매내역 판매중 조회
// async function selectUserSaleslist(connection, userId) {
//   const selectUserSaleslistQuery = `
//       SELECT title, address, price, productimageUrl, chatCount, likeCount, reserved, completed
//       FROM Products
//               INNER JOIN ProductStates ON Products.no = ProductStates.product_no AND Products.user_no = ProductStates.seller
//               INNER JOIN ProductImages ON Products.no = ProductImages.product_no
//               INNER JOIN Addresses ON Products.address_no = Addresses.no
//       WHERE Products.user_no = 3
//         AND ProductImages.mainimage = 'Y' AND completed = 'N';
//       `;
//   const [userSaleslistRow] = await connection.query(selectUserSaleslistQuery, userId);
//   return userSaleslistRow;
// }

// // 특정 유저의 판매내역 거래완료 조회
// async function selectUserCompleted_Saleslist(connection, userId) {
//   const selectUserCompleted_SaleslistQuery = `
//       SELECT title, address, price, productimageUrl, chatCount, likeCount, completed
//       FROM Products
//               INNER JOIN ProductStates ON Products.no = ProductStates.product_no AND Products.user_no = ProductStates.seller
//               INNER JOIN ProductImages ON Products.no = ProductImages.product_no
//               INNER JOIN Addresses ON Products.address_no = Addresses.no
//       WHERE Products.user_no = 3
//         AND ProductImages.mainimage = 'Y' AND completed = 'Y';
//       `;
//   const [userCompletedSaleslistRow] = await connection.query(selectUserCompleted_SaleslistQuery, userId);
//   return userCompletedSaleslistRow;
// }

// // 구매내역 조회
// async function selectPurchaselist(connection, userId) {
//   const selectPurchaselistQuery = `
//   SELECT title, address, price, productimageUrl, chatCount, likeCount
//   FROM Reviews
//            INNER JOIN Products on Reviews.product_no = Products.no
//            INNER JOIN ProductImages ON Products.no = ProductImages.product_no
//            INNER JOIN Addresses ON Products.address_no = Addresses.no
//   WHERE target = 2
//     AND role = 'SELLER'
//     AND ProductImages.mainimage = 'Y';
//   `;
//   const [purchaselistRow] = await connection.query(selectPurchaselistQuery, userId);
//   return purchaselistRow;
// }

// // 상품 예약중 수정
// async function updateReserved(connection, userId, productId, reserved) {
//   const updateReservedQuery = `
//     UPDATE ProductStates
//     SET reserved = ?
//     WHERE seller = ? AND product_no = ?;
//   `;
//   const updateReservedRow = await connection.query(updateReservedQuery, [reserved, userId, productId])
//   return updateReservedRow[0];
// }

// // 상품 거래완료 수정
// async function updateCompleted(connection, userId, productId, completed) {
//   //console.log(completed);
//   const updateCompletedQuery = `
//     UPDATE ProductStates
//     SET completed = ?
//     WHERE seller = ? AND product_no = ?;
//   `;
//   const updateCompletedRow = await connection.query(updateCompletedQuery, [completed, userId, productId])
//   return updateCompletedRow[0];
// }

module.exports = {
  selectUserAccount,
  selectUserPhone,
  insertUsers,
  selectUserNo,
  insertUsers2,
  insertUser3,
  //selectUserTown,
  //updateUserTownScale,
  //updateUserTownStatus,
  //updateUserTownMain,
  //updateUserProduct,
  //updateUserProductStatus,
  //selectUserWishlist,
  //updateWishlist,
  //selectUserSaleslist,
  //selectUserCompleted_Saleslist,
  //selectPurchaselist,
  //updateReserved,
  //updateCompleted,
};
