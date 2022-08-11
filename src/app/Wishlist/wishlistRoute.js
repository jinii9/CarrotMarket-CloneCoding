module.exports = function(app){
    const wishlist = require('./wishlistController');
    
    // 1. 위시리스트 생성 API
    app.post('/app/wishlists/:userId', wishlist.postWishlist);

     // 7. 특정 유저 관심목록 조회 API
     app.get('/app/wishlists/:userId', wishlist.getUserByWishlist);

     // 8. 특정 유저 관심목록 수정,삭제처리 API
     app.patch('/app/wishlists/:userId/status', wishlist.patchWishlists);
};