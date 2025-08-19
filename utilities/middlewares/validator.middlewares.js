const { validationResult } = require('express-validator');
const utility_func = require('../utility-functions');
const logger = require('../services/logger.services')
const fs = require('fs');
const jwtMiddleware = require('../../utilities/middlewares/jwt-service.middlewares')
const jwt = require('jsonwebtoken')
module.exports = {
    validation: validation
}

function validation(req, res, next) {
    
    let func_name = 'validation'
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_VALIDATE_MIDDLEWARE + ' => ' + func_name)
    const result = validationResult(req);
    if (!result.isEmpty()) {
        let validateResp = result.array().map((err)=>err.msg).join(', ')
        logger.info(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_VALIDATE_MIDDLEWARE + ' resp => ' + JSON.stringify(validateResp))
        res.status(utility_func.httpStatus.StatusCodes.BAD_REQUEST)
            .send(utility_func.responseGenerator(validateResp, utility_func.statusGenerator(utility_func.httpStatus.ReasonPhrases.BAD_REQUEST, utility_func.httpStatus.StatusCodes.BAD_REQUEST), true,null));
    } else {
        logger.info(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_VALIDATE_MIDDLEWARE + ' => ' + func_name)
        next();
    }
}
