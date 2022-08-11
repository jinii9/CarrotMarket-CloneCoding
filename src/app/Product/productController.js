const jwtMiddleware = require("../../../config/jwtMiddleware");
const productProvider = require("../../app/Product/productProvider");
const productService = require("../../app/Product/productService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response"); 

/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */
exports.getTest = async function (req, res) {
    return res.send(response(baseResponse.SUCCESS));
}

/**
 * API No. 1
 * API Name : 상품 생성 API
 * [POST] /app/products/:userId
 */
 exports.postProducts = async function (req, res) {
    /**
     * Path Variable : userId
     * Body: user_no, address_no, title, category_no, price, priceOffer, contents, productimage
     */
    const user_no = req.params.userId; 
    // 클라이언트에서 넘겨주는 값들
    const {address_no, title, category_no, price, priceOffer, contents, productimage} = req.body;

    // <Validation>
    // 빈 값 체크
        // user_no, address_no도 해줘야하나?
    if (!title)
        return res.send(response(baseResponse.PRODUCT_TITLE_EMPTY));
    if (!category_no)
        return res.send(response(baseResponse.PRODUCT_CATEGORY_EMPTY));
    if (!contents)
        return res.send(response(baseResponse.PRODUCT_CONTENTS_EMPTY));


    // console.log('bbbbbbbbbb');
    // console.log(req.body.productimage);
    // console.log(req.body.productimage[0]);
    // //console.log(req.body.productimage[productimageUrl][0].productimageUrl);
    // console.log(req.body.productimage[0].productimageUrl);
    // console.log(req.body.productimage[0]);
    const postProductResponse = await productService.createProduct(
        user_no, 
        address_no, 
        title, 
        category_no,
        price, 
        priceOffer, 
        contents, 
        productimage
    );

    
    // 값 다시 돌려받으면,
    return res.send(postProductResponse); // 응답해줌    
};

/**
 * API No. 2
 * API Name : 전체 상품 조회 API
 * [GET] /app/products?addressId=
 */
exports.getProducts = async function (req, res) {
    /**
     * Query String: addressId
     */
    //const userId = req.params.userId;
    const addressId = req.query.addressId;
    const title = req.query.title;

    if(!title){
        // 제품 전체 조회
        console.log('제품 전체 조회');
        // userId에 해당하는 address, latitude, longitude, range, main 가져오기
        const productByUserAddress = await productProvider.retrieveUserAddress(addressId);
        const userAddress = productByUserAddress.address;
        const userLatitude = productByUserAddress.latitude;
        const userLongitude = productByUserAddress.longitude;
        const userScale = productByUserAddress.scale;
        //console.log('테스트');
        console.log(userAddress);
        console.log(userLatitude);
        console.log(userLongitude);
        console.log(userScale);
        //console.log('테스트2');
        // point 형식이 sql로 잘 들어가나 test
        //const testResult = await productProvider.test(userId, userAddress, userLatitude, userLongitude);

        // 유저의 latitude, longitude 이용해서 거리 계산
        const productBydistance = await productProvider.retrieveDistance(userLatitude, userLongitude, userScale);


        // 가져온 user의 address정보의 범위에 맞게 products 가져오기
        
        return res.send(response(baseResponse.GETPRODUCTS_SUCCESS, productBydistance));

    } else {
        // 상품 제목 검색 조회
        console.log('상품 제목 검색 조회');
        // userId에 해당하는 address, latitude, longitude, range, main 가져오기
        const productByUserAddress = await productProvider.retrieveUserAddress(addressId);
        const userAddress = productByUserAddress.address;
        const userLatitude = productByUserAddress.latitude;
        const userLongitude = productByUserAddress.longitude;
        const userScale = productByUserAddress.scale;
        console.log(userAddress);
        console.log(userLatitude);
        console.log(userLongitude);
        console.log(userScale);
        
        console.log(title);

        // 유저의 latitude, longitude 이용해서 거리 계산
        const productTitleBydistance = await productProvider.retrieveTitleDistance(userLatitude, userLongitude, userScale, title);

        
        return res.send(response(baseResponse.GETTITLEPRODUCTS_SUCCESS, productTitleBydistance));
    }
    
    
};

/**
 * API No. 6
 * API Name : 특정 유저 상품 정보 수정 API (게시한 상품 수정) 
 * [PATCH] /app/products/:productId
 * path variable : productId
 * body : title, categoryId, price, priceOffer, contents
 */
 exports.patchProduct = async function (req, res) {

    const productId = req.params.productId; // Path Variable

    const title = req.body.title; 
    const categoryId = req.body.categoryId;
    const price = req.body.price;
    const priceOffer = req.body.priceOffer;
    const contents = req.body.contents;

    const editProduct = await productService.editProduct(productId, title, categoryId, price, priceOffer, contents);
    return res.send(editProduct);   
};

/**
 * API No. 6-2
 * API Name : 특정 유저 상품 삭제처리 API 
 * [PATCH] /app/products/:productId/status
 * path variable : productId
 * body : status
 */
 exports.patchProductStatus = async function (req, res) {

    // jwt - userId, path variable의 productId에 해당하는 userId랑 일치하는지 비교
    const userIdFromJWT = req.verifiedToken.userId // jwt(req.header['x-access-token])로부터 id 가져옴

    const productId = req.params.productId; // Path Variable
    const status = req.body.status; 

    // productId에 해당하는 userId 가져오기
    const userId = await productProvider.userIdCheck(productId);
    //console.log(userId.user_no);
    // 비교
    if(userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        // 평소 하던 것처럼 형식적 validation 넣기
        const editProductStatus = await productService.editProductStatus(productId, status);
        return res.send(editProductStatus); 
    }  
};

//
/**
 * API No. 9
 * API Name : 특정 유저 판매내역 판매중 조회 API
 * [GET] /app/products/:userId/saleslists
 */
 exports.getUserBySaleslist = async function (req, res){
    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    const userBySaleslist = await productProvider.retrieveSaleslist(userId);
    return res.send(response(baseResponse.GETSALESLIST_SUCCESS, userBySaleslist));
};
/**
 * API No. 10
 * API Name : 특정 유저 판매내역 거래완료 조회 API
 * [GET] /app/products/:userId/saleslists/completed
 */
exports.getUserByCompletedSaleslist = async function (req, res){
    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    const userByCompletedSaleslist = await productProvider.retrieveCompletedSaleslist(userId);
    return res.send(response(baseResponse.GETSALESLIST_SUCCESS, userByCompletedSaleslist));
};

/**
 * API No. 11
 * API Name : 특정 유저 구매내역 조회 API
 * [GET] /app/products/:userId/purchaselists
 */
exports.getUserByPurchaselist = async function (req, res) {
    /**
     * Path Variable: userId
     */
     const userId = req.params.userId;

     if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

     const userByPurchaselist = await productProvider.retrievePurchaselist(userId);
     return res.send(response(baseResponse.GETPURCHASELIST_SUCCESS, userByPurchaselist));

};

/**
 * API No. 12
 * API Name : 특정 유저의 제품 예약중 수정 API
 * [PATCH] /app/products/:productId/reserved
 * path variable : userId, productId
 * body : reserved
 */
exports.patchUserProductReserve = async function (req, res) {
    const productId = req.params.productId;
    const reserved = req.body.reserved;

    //if (!nickname) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));

    const editReserved = await productService.editReserved(productId, reserved);
    return res.send(editReserved);

};

/**
 * API No. 12-2
 * API Name : 특정 유저의 제품 거래완료 수정 API
 * [PATCH] /app/products/:productId/completed
 * path variable : userId, productId
 * body : reserved
 */
exports.patchUserProductCompleted = async function (req, res) {
    const productId = req.params.productId;
    const completed = req.body.completed;
    console.log(completed);
    //if (!nickname) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));

    const editCompleted = await productService.editCompleted(productId, completed);
    return res.send(editCompleted);

};
        