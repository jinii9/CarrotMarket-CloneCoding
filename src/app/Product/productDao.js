// // 전화번호로 회원 조회
// async function selectUserPhone(connection, phone) {
//     const selectUserPhoneQuery = `
//                   SELECT phone, nickname
//                   FROM Users 
//                   WHERE phone = ?;
//                   `; // 그 전화번호 가진 어떤 유저가 있다면
//     const [phoneRows] = await connection.query(selectUserPhoneQuery, phone); // 여기에 넘겨줘서, (phone은 ?에 들어감) 존재한다면, phoneRows배열에 들어감
//     return phoneRows;
//   }

  // jwt위한 userId 가져오기
  async function selectUserNo(connection, productId) {
    const selectUserIdQuery = `
      SELECT user_no
      FROM Products
      WHERE no = ?;
    `;
    const [userIdRow] = await connection.query(selectUserIdQuery, productId);
    return userIdRow[0];
  }

  // 상품 생성1
  async function insertProducts(connection, insertProductParams) {
    console.log('입장')
    const insertProductsQuery = `
          INSERT INTO Products(user_no, address_no, title, category_no, price, priceOffer, contents)
          VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
    const insertProductsRow = await connection.query(
      insertProductsQuery,
      insertProductParams
    );
    
    return insertProductsRow;
  }

  // 상품 생성2 : 상품 이미지(리스트)
  async function insertProducts2(connection, insertProductParams2) {
    console.log('입장2')
    // ((insertProductParams2 = [user_no, product_no, productimage]))
    console.log(insertProductParams2)
    console.log(insertProductParams2[2][0].productimageUrl);
    console.log(insertProductParams2[2][0].mainimage);
    const insertProductsQuery2 = `
        INSERT INTO ProductImages(user_no, product_no, productimageUrl, mainimage)
        VALUES (?, ?, ?, ?) 
    `;
    
    //const values = [insertProductParams2[1][0].productimageUrl,insertProductParams2[1][0].productimageUrl,insertProductParams2[1][0].productimageUrl];
    
    const values = [];
    const insertProductsRow2 = [];
    for(i=0; i<insertProductParams2[2].length;i++){
        values[i] = [insertProductParams2[0],insertProductParams2[1], insertProductParams2[2][i].productimageUrl, insertProductParams2[2][i].mainimage];
        console.log('values : ' + values[i]);
        //console.log('mainValues : ' + mainValues[i]);
        //
        insertProductsRow2[i] = await connection.query(
          insertProductsQuery2,
          values[i]
      );
    }
    return insertProductsRow2;
  }

  //상품 생성3 
  async function insertProducts3(connection, product_no) {

    // ProductStates에도 상품 넣어주기
    const insertProductStatesQuery = `
          INSERT INTO ProductStates(product_no)
          VALUES (?)
      `;
    const insertProductStatesRow = await connection.query(
      insertProductStatesQuery,
      product_no
    );
    return insertProductStatesRow;
  }


// user_no,title로 product_no 조회
async function selectProductNo(connection, selectProductNoParams) {
  const selectProductNoQuery = `
                SELECT no 
                FROM Products 
                WHERE user_no = ? AND title = ?;
                `;
  const product_noRow = await connection.query(selectProductNoQuery, selectProductNoParams);
  //console.log(product_noRow);
  return product_noRow;
}
  
// 유저 Address 조회
async function selectUserAddress(connection, addressId) {
  // const selectUserAddressQuery = `
  //   SELECT address, latitude, longitude, scale
  //   FROM Addresses
  //   WHERE user_no = ? AND main = "Y"
  // `;
  const selectUserAddressQuery = `
    SELECT address, latitude, longitude, scale
    FROM Addresses
    WHERE no = ?
  `;
  const [userAddress] = await connection.query(selectUserAddressQuery, addressId);
  return userAddress;
}  
  
// //
// async function test(connection, userId, userAddress, lat, long) {
//   const testQuery = `
//     UPDATE Addresses
//     SET test = POINT(?,?)
//     WHERE user_no = ? AND address = ?;
//   `;
//   const [testResult] = await connection.query(testQuery, [lat, long, userId, userAddress]);
//   console.log(lat, long);
//   console.log('완료');
//   return testResult;
// }

async function selectDistance(connection, userLatitude, userLongitude, userScale) {
  // distance에 맞는 모든 Product들 가져오기
  console.log('test : ' + userLongitude, userLatitude);
  console.log('userScale :' + userScale);
  const selectDistanceQuery = `
    SELECT title,
          address,
          ST_Distance_Sphere(POINT(?,?),
          POINT(longitude, latitude)) AS distance,
          case
              when Products.createdAt <> Products.updatedAt then '끌올'
              else ''
              end                                                   as updatedAtTime,
          case
              when TIMESTAMPDIFF(MINUTE, Products.createdAt, current_timestamp()) <= 0
                  then '방금 전'
              when TIMESTAMPDIFF(MINUTE, Products.createdAt, current_timestamp()) <= 60
                  then CONCAT(TIMESTAMPDIFF(HOUR, Products.createdAt, current_timestamp()), '분 전')
              when TIMESTAMPDIFF(HOUR, Products.createdAt, current_timestamp()) < 24
                  then CONCAT(TIMESTAMPDIFF(HOUR, Products.createdAt, current_timestamp()), '시간 전')
              when TIMESTAMPDIFF(DAY, Products.createdAt, current_timestamp()) < 30
                  then CONCAT(TIMESTAMPDIFF(DAY, Products.createdAt, current_timestamp()), '일 전')
              else CONCAT(TIMESTAMPDIFF(MONTH, Products.createdAt, current_timestamp()), '달 전')
              end                                                   as createdATime,
          price,
          productimageUrl,
          likeCount,
          chatCount
    FROM Addresses
            INNER JOIN Products ON Addresses.no = Products.address_no
            INNER JOIN ProductImages ON Products.no = ProductImages.product_no
    WHERE ST_Distance_Sphere(POINT(?,?), POINT(longitude, latitude)) <= ? AND ProductImages.mainimage = 'Y'
    ORDER BY distance;
  `;
  const [Distance] = await connection.query(selectDistanceQuery, [userLongitude, userLatitude, userLongitude, userLatitude, userScale]);
  return Distance;  
}

async function selectTitleDistance(connection, userLatitude, userLongitude, userScale, title){
  // distance에 맞는 모든 Product들 가져오기
  const selectDistanceQuery = `
    SELECT title,
      address,
      ST_Distance_Sphere(POINT(?,?),
      POINT(longitude, latitude)) AS distance,
      case
          when Products.createdAt <> Products.updatedAt then '끌올'
          else ''
          end                                                   as updatedAtTime,
      case
          when TIMESTAMPDIFF(MINUTE, Products.createdAt, current_timestamp()) <= 0
              then '방금 전'
          when TIMESTAMPDIFF(MINUTE, Products.createdAt, current_timestamp()) <= 60
              then CONCAT(TIMESTAMPDIFF(HOUR, Products.createdAt, current_timestamp()), '분 전')
          when TIMESTAMPDIFF(HOUR, Products.createdAt, current_timestamp()) < 24
              then CONCAT(TIMESTAMPDIFF(HOUR, Products.createdAt, current_timestamp()), '시간 전')
          when TIMESTAMPDIFF(DAY, Products.createdAt, current_timestamp()) < 30
              then CONCAT(TIMESTAMPDIFF(DAY, Products.createdAt, current_timestamp()), '일 전')
          else CONCAT(TIMESTAMPDIFF(MONTH, Products.createdAt, current_timestamp()), '달 전')
          end                                                   as createdATime,
      price,
      productimageUrl,
      likeCount,
      chatCount
    FROM Addresses
        INNER JOIN Products ON Addresses.no = Products.address_no
        INNER JOIN ProductImages ON Products.no = ProductImages.product_no
    WHERE ST_Distance_Sphere(POINT(?,?), POINT(longitude, latitude)) <= ? AND ProductImages.mainimage = 'Y' AND title Like concat('%',?,'%')
    ORDER BY distance;
  `;
  const [Distance] = await connection.query(selectDistanceQuery, [userLongitude, userLatitude, userLongitude, userLatitude, userScale, title]);
  return Distance;    
}

async function updateProduct(connection, productId, title, categoryId, price, priceOffer, contents) {
  console.log('테스트 : ' + productId, title, categoryId, price, priceOffer, contents);

  let updateTitleRow = [];
  let updateCategoryRow = [];
  let updatePriceRow = [];
  let updatePriceOfferRow = [];
  let updateContentsRow = [];
  
  if(title != null){ // 이때 undefined와 null은 동등비교에서 같다 -> 따라서 null이 아닐 때 = undefined가 아닐 때
      console.log('title 확인');
      const updateTitleQuery = `
      UPDATE Products 
      SET title = ?
      WHERE no = ?;
      `;
      updateTitleRow = await connection.query(updateTitleQuery, [title, productId]);
  }
  if(categoryId != null){
    console.log('category 확인');
    const updateCategoryQuery = `
    UPDATE Products 
    SET category_no = ?
    WHERE no = ?;
    `;
    updateCategoryRow = await connection.query(updateCategoryQuery, [categoryId, productId]);
  }
  if(price != null){
    console.log('price 확인');
    const updatePriceQuery = `
    UPDATE Products 
    SET price = ?
    WHERE no = ?;
    `;
    updatePriceRow = await connection.query(updatePriceQuery, [price, productId]);
  }  
  if(priceOffer != null){
    console.log('priceOffer 확인');
    const updatePriceOfferQuery = `
    UPDATE Products 
    SET priceOffer = ?
    WHERE no = ?;
    `;
    updatePriceOfferRow = await connection.query(updatePriceOfferQuery, [priceOffer, productId]);
  } 
  if(contents != null){
    console.log('contents 확인');
    const updateContentsQuery = `
    UPDATE Products 
    SET contents = ?
    WHERE no = ?;
    `;
    updateContentsRow = await connection.query(updateContentsQuery, [contents, productId]);
  } 

  return [updateTitleRow, updateCategoryRow, updatePriceRow, updatePriceOfferRow, updateContentsRow];
}

async function updateProductStatus(connection, productId, status) {

  const updateSatusQuery = `
  UPDATE Products 
  SET status = ?
  WHERE no = ?;
  `;
  updateStatusRow = await connection.query(updateSatusQuery, [status, productId]);

return updateStatusRow[0];
}

//
// 특정 유저의 판매내역 판매중 조회
async function selectUserSaleslist(connection, userId) {
  const selectUserSaleslistQuery = `
      SELECT title, address, price, productimageUrl, chatCount, likeCount, reserved, completed
      FROM Products
              INNER JOIN ProductStates ON Products.no = ProductStates.product_no
              INNER JOIN ProductImages ON Products.no = ProductImages.product_no
              INNER JOIN Addresses ON Products.address_no = Addresses.no
      WHERE Products.user_no = 3
        AND ProductImages.mainimage = 'Y' AND completed = 'N';
      `;
  const [userSaleslistRow] = await connection.query(selectUserSaleslistQuery, userId);
  return userSaleslistRow;
}

// 특정 유저의 판매내역 거래완료 조회
async function selectUserCompleted_Saleslist(connection, userId) {
  const selectUserCompleted_SaleslistQuery = `
      SELECT title, address, price, productimageUrl, chatCount, likeCount, completed
      FROM Products
              INNER JOIN ProductStates ON Products.no = ProductStates.product_no
              INNER JOIN ProductImages ON Products.no = ProductImages.product_no
              INNER JOIN Addresses ON Products.address_no = Addresses.no
      WHERE Products.user_no = 3
        AND ProductImages.mainimage = 'Y' AND completed = 'Y';
      `;
  const [userCompletedSaleslistRow] = await connection.query(selectUserCompleted_SaleslistQuery, userId);
  return userCompletedSaleslistRow;
}

// 구매내역 조회
async function selectPurchaselist(connection, userId) {
  const selectPurchaselistQuery = `
  SELECT title, address, price, productimageUrl, chatCount, likeCount
  FROM Reviews
           INNER JOIN Products on Reviews.product_no = Products.no
           INNER JOIN ProductImages ON Products.no = ProductImages.product_no
           INNER JOIN Addresses ON Products.address_no = Addresses.no
  WHERE target = 2
    AND role = 'SELLER'
    AND ProductImages.mainimage = 'Y';
  `;
  const [purchaselistRow] = await connection.query(selectPurchaselistQuery, userId);
  return purchaselistRow;
}

//
// 상품 예약중 수정
async function updateReserved(connection, productId, reserved) {
  const updateReservedQuery = `
    UPDATE ProductStates
    SET reserved = ?
    WHERE product_no = ?;
  `;
  const updateReservedRow = await connection.query(updateReservedQuery, [reserved, productId])
  return updateReservedRow[0];
}

// 상품 거래완료 수정
async function updateCompleted(connection, productId, completed) {
  //console.log(completed);
  const updateCompletedQuery = `
    UPDATE ProductStates
    SET completed = ?
    WHERE product_no = ?;
  `;
  const updateCompletedRow = await connection.query(updateCompletedQuery, [completed, productId])
  return updateCompletedRow[0];
}

  module.exports = {
    insertProducts,
    selectProductNo,
    insertProducts2,
    insertProducts3,
    selectUserAddress,
    selectDistance,
    selectTitleDistance,
    updateProduct,
    updateProductStatus,
    selectUserSaleslist,
    selectUserCompleted_Saleslist,
    selectPurchaselist,
    updateReserved,
    updateCompleted,
    selectUserNo,
  };
  