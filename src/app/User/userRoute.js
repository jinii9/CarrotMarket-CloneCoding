module.exports = function(app){ // app 사용할 수 있도록
    const user = require('./userController'); // user가 Controller
    const jwtMiddleware = require('../../../config/jwtMiddleware');
 
     // 0. 테스트 API
     app.get('/app/test', user.getTest) // controller의 함수로 이동해라!
 
     // 1. 유저 생성 (회원가입) API
     app.post('/app/users', user.postUsers);
 
   //   // 2. 특정 유저 동네 정보 조회 API 
   //      // (유저의 address,range 조회)
   //   app.get('/app/users/:userId/town', user.getUserByTown);
 
   //   // 3. 특정 유저 동네 수정 API (범위 수정)    
   //      // JWT 일단 제외
   //   app.patch('/app/users/:userId/town/scale', user.patchUserTownScale);

   //   // 4. 특정 유저 동네 삭제처리 API (status 수정)    
   //   app.patch('/app/users/:userId/town/status', user.patchUserTownStatus);

   //   // 5. 특정 유저 '메인' 동네 수정 API (main 수정)    
   //   app.patch('/app/users/:userId/town/main', user.patchUserTownMain);

     // => 3번, 4번, 5번 patch 하나API로 할 수 있을듯..? (patch는 변경된 값만 변경하므로)

   //   // 6. 특정 유저 상품 정보 수정 API
   //   app.patch('/app/users/:userId/product/:productId', user.patchUserProduct);
     
   //   // 6-2. 특정 유저 상품 삭제처리 API
   //   app.patch('/app/users/:userId/product/:productId/status', user.patchUserProductStatus);

   //   // 7. 특정 유저 관심목록 조회 API
   //   app.get('/app/users/:userId/wishlist', user.getUserByWishlist);

   //   // 8. 특정 유저 관심목록 수정,삭제처리 API
   //   app.patch('/app/users/:userId/wishlist/:productId/status', user.patchWishlists);

   //   // 9. 특정 유저 판매내역 판매중 조회 API
   //   app.get('/app/users/:userId/saleslist', user.getUserBySaleslist);

   //   // 10. 특정 유저 판매내역 거래완료 조회 API
   //   app.get('/app/users/:userId/saleslist/completed', user.getUserByCompletedSaleslist);

   //   // 11. 특정 유저 구매내역 조회 API
   //   app.get('/app/users/:userId/purchaselist', user.getUserByPurchaselist);

   //   // 12. 특정 유저의 제품 예약중 수정 API
   //   app.patch('/app/users/:userId/product/:productId/reserved', user.patchUserProductReserve);
     
   //   // 12-2. 특정 유저의 제품 거래완료 수정 API
   //   app.patch('/app/users/:userId/product/:productId/completed', user.patchUserProductCompleted);


     ////////////////////////////////////////
     // TODO: After 로그인 인증 방법 (JWT)
     // 로그인 하기 API (JWT 생성)
     app.post('/app/login', user.login);

};