const jwt = require('jsonwebtoken');
const utility_func = require('../../utilities/utility-functions');
const fs = require('fs');
const logger = require('../../utilities/services/logger.services');

const jwtOptions = {expiresIn: process.env.TOKEN_LIFESPAN}
const jwtKey = process.env.JWT_SECRET_KEY    
module.exports={
    generateToken:generateToken,
    verifyToken:verifyToken
}
async function generateToken(payload) {
    const func_name='generateToken'
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_JWT_MIDDLEWARE + ' => ' + func_name)

    try {
        const token = await jwt.sign(payload, jwtKey, jwtOptions);
        
        logger.info(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_JWT_MIDDLEWARE + ' => ' + func_name)
        return token;
    } catch (jwtError) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_JWT_MIDDLEWARE +' '+JSON.stringify(jwtError)+ ' => ' + func_name)
        
        throw jwtError
    }
}

async function verifyToken(req,res,next) {
    const func_name='verifyToken'
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_JWT_MIDDLEWARE + ' => ' + func_name)

    try {
        const token = req.headers[utility_func.jsonCons.FIELD_TOKEN];

        const jwtResp = await jwt.verify(token, jwtKey,jwtOptions);
        req[utility_func.jsonCons.FIELD_USER_DETAILS] =jwtResp
        logger.info(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_JWT_MIDDLEWARE + ' => ' + func_name)
        next()
    } catch (tokenErr) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_JWT_MIDDLEWARE +' '+JSON.stringify(tokenErr)+ ' => ' + func_name)
        
        return res.status(utility_func.httpStatus.StatusCodes.UNAUTHORIZED).send(
            utility_func.responseGenerator(
                utility_func.responseCons.RESP_UNAUTHORIZED_USER,
                utility_func.statusGenerator(
                    utility_func.httpStatus.ReasonPhrases.UNAUTHORIZED,
                    utility_func.httpStatus.StatusCodes.UNAUTHORIZED
                ),
                true
            )
        );    
    }
}