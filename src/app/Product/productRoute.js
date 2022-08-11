module.exports = function(app){ 
    const product = require('./productController'); 
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    // 0. 테스트 API
    app.get('/app/products/test', product.getTest);

    // 1. 상품 생성 (회원가입) API
    app.post('/app/products/:userId', product.postProducts);

    // 2. 전체 상품 조회 API + 특정 상품 조회(제목 검색)
    app.get('/app/products', product.getProducts);

    // 6. 특정 유저 상품 정보 수정 API
     app.patch('/app/products/:productId', product.patchProduct);
     
    // 6-2. 특정 유저 상품 삭제처리 API
    //app.patch('/app/products/:productId/status', product.patchProductStatus);
    app.patch('/app/products/:productId/status',jwtMiddleware, product.patchProductStatus);


    // 9. 특정 유저 판매내역 판매중 조회 API
    app.get('/app/products/:userId/saleslists', product.getUserBySaleslist);

    // 10. 특정 유저 판매내역 거래완료 조회 API
    app.get('/app/products/:userId/saleslists/completed', product.getUserByCompletedSaleslist);
    
    // 11. 특정 유저 구매내역 조회 API
    app.get('/app/products/:userId/purchaselists', product.getUserByPurchaselist);

    // 12. 특정 유저의 제품 예약중 수정 API
    app.patch('/app/products/:productId/reserved', product.patchUserProductReserve);
    
    // 12-2. 특정 유저의 제품 거래완료 수정 API
    app.patch('/app/products/:productId/completed', product.patchUserProductCompleted);
 };