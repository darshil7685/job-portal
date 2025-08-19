
module.exports = {
  logsCons: require('./constants/logs-constant.constants'),
  responseCons: require('./constants/response-constant.constants'),
  httpStatus: require('http-status-codes'),
  jsonCons: require('./constants/json-constant.constants'),

  responseGenerator: function (msg, code, isError, data) {
    let responseJson = {};
    let ERROR_CODE = this.statusGenerator(this.httpStatus.ReasonPhrases.INTERNAL_SERVER_ERROR, this.httpStatus.StatusCodes.INTERNAL_SERVER_ERROR);
    let SUCCESS_CODE = this.statusGenerator(this.httpStatus.ReasonPhrases.OK, this.httpStatus.StatusCodes.OK);
    responseJson[this.responseCons.RESP_ERROR_STATUS] = isError ? true : false;
    responseJson[this.responseCons.RESP_CODE] = code ? code : isError ? ERROR_CODE : SUCCESS_CODE;
    responseJson[this.responseCons.RESP_MSG] = msg ? msg : isError ? this.responseCons.RESP_SOMETHING_WENT_WRONG : this.responseCons.RESP_SUCCESS_MSG;
    if (data && data.length !== 0 && !isError)
      responseJson[this.responseCons.RESP_DATA] = data;
    return responseJson;
  },

  statusGenerator: function (code, statusCode) {
    let logJson = this.responseCons.RESP_HJFA_MS.padEnd(8, '_') + String(code).replace(/ /g, "_").toUpperCase() + String(statusCode).padStart(4, '_');
    return logJson
  }

}




