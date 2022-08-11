// 리뷰 생성
//user_no, product_no, seller, buyer, preferenceChecks_no, contents
async function insertReview(connection, user_no, role, target, product_no, preferenceCheck, preferencelists, contents) {
    console.log(user_no, role, target, product_no, preferenceCheck, preferencelists, contents);

    const insertReviewQuery = `
        INSERT INTO Reviews(user_no, role, target, product_no, preferenceCheck, contents)
        VALUES (?, ?, ?, ?, ?, ?);
    `;
    const insertReviewRow = await connection.query(insertReviewQuery, [user_no, role, target, product_no, preferenceCheck, contents]);
    
    // 리스트
    
    const insertReviewPreferencelistQuery = `
        INSERT INTO ReviewPreferencelists(preferenceCategory_no, user_no, role, product_no, target)
        VALUES (?, ?, ?, ?, ?);
    `;
    console.log('리스트 : ');
    console.log(preferencelists);
    console.log(preferencelists[0].preferenceCategory_no);
    console.log(preferencelists.length);

    const values = [];
    const insertReviewPreferenceRow = [];
    for(i=0; i<preferencelists.length; i++){
        values[i] = [preferencelists[i].preferenceCategory_no, user_no, role, product_no, target];
        console.log('values : ' + values[i]);

        insertReviewPreferenceRow[i] = await connection.query(
            insertReviewPreferencelistQuery,
            values[i]
        );
    }

    return [insertReviewRow,insertReviewPreferenceRow];
}

module.exports = {
    insertReview,
  };
  