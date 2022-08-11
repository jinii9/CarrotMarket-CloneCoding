// 위시리스트 생성
async function insertWishlist(connection, insertWishlistParams){ // 이때 wishlist의 user_no는 하트 누른 유저를 의미함
    const insertWishlistQuery = `
        INSERT INTO Wishlists(user_no, product_no)
        VALUES (?, ?);
    `;
    const insertWishlistRow = await connection.query(
        insertWishlistQuery,insertWishlistParams
    );

     return insertWishlistRow;
}

// 하트 수 +1 증가
async function updateLikeCount(connection, product_no) {
  const updateLikeCountQuery = `
    UPDATE Products
    SET likeCount = likeCount + 1
    WHERE no = ?
  `;
  const updateLikeCountRow = await connection.query(updateLikeCountQuery, product_no);
  return updateLikeCountRow[0];
}


// 특정 유저의 동네 조회
async function selectUserWishlist(connection, userId){
    const selectUserWishlistQuery = `
      SELECT Wishlists.user_no, Wishlists.product_no, title, address, price, productimageUrl, chatCount, likeCount
      FROM Wishlists
              INNER JOIN Products ON Wishlists.product_no = Products.no
              INNER JOIN ProductImages ON Wishlists.product_no = ProductImages.product_no
              INNER JOIN Addresses ON Products.address_no = Addresses.no
      WHERE Wishlists.user_no = ? AND ProductImages.mainimage = 'Y';
        `;
    const [userWishlist] = await connection.query(selectUserWishlistQuery, userId);
    return userWishlist;
  }
  
  // 특정 유저의 위시리스트 수정
  async function updateWishlist(connection, userId, productId, status) {
    const updateWishlistQuery = `
      UPDATE Wishlists
      SET status = ?
      WHERE user_no = ? AND product_no = ?;`;
      const updateWishlistRow = await connection.query(updateWishlistQuery, [status, userId, productId]);
      return updateWishlistRow[0];
  }

module.exports = {
    insertWishlist,
    updateLikeCount,
    selectUserWishlist,
    updateWishlist,
  };