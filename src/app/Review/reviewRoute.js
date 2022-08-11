module.exports = function(app) {
    const review = require('./reviewController');

    // 1. 리뷰 생성 API
    app.post('/app/reviews', review.postReviews);
};