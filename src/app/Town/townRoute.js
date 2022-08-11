module.exports = function(app){ 
    const town = require('./townController'); 
    const jwtMiddleware = require('../../../config/jwtMiddleware');
    // 0. 테스트 API
    // app.get('/app/towns/test', town.getTest);

     // 1. 동네 생성 API
     app.post('/app/towns/:userId', town.postTowns);

     // 1-2. 현재위치 근처 동네들 조회 API
     app.get('/app/towns/:addressId', town.getCurrentTowns);

     // 2. 특정 유저 동네 정보 조회 API 
     // (유저의 address,range 조회)
     app.get('/app/towns/:userId', town.getUserByTown);
    
     // 3. 특정 유저 동네 수정 API (범위 수정)    
     // JWT 일단 제외
     app.patch('/app/towns/:userId/range', town.patchUserTownScale);

     // 4. 특정 유저 동네 삭제처리 API (status 수정)    
     app.patch('/app/towns/:userId/status', town.patchUserTownStatus);

     // 5. 특정 유저 '메인' 동네 수정 API (main 수정)    
     app.patch('/app/towns/:userId/main', town.patchUserTownMain);
 };