const response = ({isSuccess, code, message}, result) => {
   return {
        isSuccess: isSuccess,
        code: code,
        message: message,
        result: result
   }
  };

  const errResponse = ({isSuccess, code, message}) => {
    return {
        isSuccess: isSuccess,
        code: code,
        message: message
      }
  };
  
  module.exports = { response, errResponse }; // 외부에서 쓸 수 있도록 exports해주고 있기 때문에 controller에서 사용 가능