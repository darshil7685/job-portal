
const utility_func = require('../utilities/utility-functions')
const logger = require('../utilities/services/logger.services');
const userService = require('../services/user.service')

module.exports={
    userRegistration:userRegistration,
    userLogin:userLogin,
    getUserDetails:getUserDetails,
    getUserResume:getUserResume,
    uploadUserResume:uploadUserResume,
    createJobPost:createJobPost,
    getAllJobPosts:getAllJobPosts,
    applyJob:applyJob,
    getSavedJobs:getSavedJobs,
    getAppliedJobs:getAppliedJobs,
    unsaveJob:unsaveJob,
    recruiterDetails:recruiterDetails,
    updateAppliedJobStatus:updateAppliedJobStatus,
    notificationList:notificationList,
    updateNotificationRead:updateNotificationRead,
    uploadImage:uploadImage,
    logout:logout,
    updateJobDetails:updateJobDetails,
    uploadCoverLetter:uploadCoverLetter,
    getCoverLetter:getCoverLetter
}

async function userRegistration(req,res) {
    const func_name = 'userRegistration';
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);

    try {
        const response = await userService.userRegistration(req);
        logger.info(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);
        res.status(parseInt(response[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(response);
    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name + ' error => ' + JSON.stringify(error))
        res.status(parseInt(error[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(error);
    } 
}

async function userLogin(req,res) {
    const func_name = 'userLogin';
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);

    try {
        const response = await userService.userLogin(req);
        logger.info(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);
        res.status(parseInt(response[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(response);
    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name + ' error => ' + JSON.stringify(error))
        res.status(parseInt(error[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(error);
    } 
}

async function getUserDetails(req,res) {
    const func_name = 'getUserDetails';
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);

    try {
        const response = await userService.getUserDetails(req);
        logger.info(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);
        res.status(parseInt(response[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(response);
    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name + ' error => ' + JSON.stringify(error))
        res.status(parseInt(error[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(error);
    } 
}

async function getUserResume(req,res) {
    const func_name = 'getUserResume';
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);

    try {
        const {filename,filePath} = await userService.getUserResume(req);
       
        logger.info(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);
        // res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
        res.download(filePath,filename ,(err) => {
            if (err) {
                let errResponse= utility_func.responseGenerator(
                    utility_func.responseCons.RESP_SOMETHING_WENT_WRONG,
                    utility_func.statusGenerator(
                        utility_func.httpStatus.ReasonPhrases.INTERNAL_SERVER_ERROR,
                        utility_func.httpStatus.StatusCodes.INTERNAL_SERVER_ERROR),
                    true
                )
                logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name + ' error => ' + JSON.stringify(err))
                res.status(parseInt(errResponse[utility_func.responseCons.RESP_CODE].slice(-3)));
                res.send(errResponse);
            }
          });
    } catch (error) {
        let errResponse= utility_func.responseGenerator(
                    utility_func.responseCons.RESP_SOMETHING_WENT_WRONG,
                    utility_func.statusGenerator(
                        utility_func.httpStatus.ReasonPhrases.INTERNAL_SERVER_ERROR,
                        utility_func.httpStatus.StatusCodes.INTERNAL_SERVER_ERROR),
                    true
                )
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name + ' error => ' + JSON.stringify(error))
        res.status(parseInt(errResponse[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(errResponse);
    } 
}

async function uploadUserResume(req,res) {
    const func_name = 'uploadUserResume';
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);

    try {
        const response = await userService.uploadUserResume(req);
        logger.info(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);
        res.status(parseInt(response[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(response);
    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name + ' error => ' + JSON.stringify(error))
        res.status(parseInt(error[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(error);
    } 
}


async function createJobPost(req,res) {
    const func_name = 'createJobPost';
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);

    try {
        const response = await userService.createJobPost(req);
        logger.info(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);
        res.status(parseInt(response[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(response);
    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name + ' error => ' + JSON.stringify(error))
        res.status(parseInt(error[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(error);
    } 
}

async function getAllJobPosts(req,res) {
    const func_name = 'getAllJobPosts';
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);

    try {
        const response = await userService.getAllJobPosts(req);
        logger.info(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);
        res.status(parseInt(response[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(response);
    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name + ' error => ' + JSON.stringify(error))
        res.status(parseInt(error[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(error);
    } 
}

async function applyJob(req,res) {
    const func_name = 'applyJob';
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);

    try {
        const response = await userService.applyJob(req);
        logger.info(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);
        res.status(parseInt(response[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(response);
    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name + ' error => ' + JSON.stringify(error))
        res.status(parseInt(error[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(error);
    } 
}

async function getSavedJobs(req,res) {
    const func_name = 'getSavedJobs';
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);

    try {
        const response = await userService.getSavedJobs(req);
        logger.info(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);
        res.status(parseInt(response[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(response);
    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name + ' error => ' + JSON.stringify(error))
        res.status(parseInt(error[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(error);
    } 
}

async function getAppliedJobs(req,res) {
    const func_name = 'getAppliedJobs';
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);

    try {
        const response = await userService.getAppliedJobs(req);
        logger.info(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);
        res.status(parseInt(response[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(response);
    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name + ' error => ' + JSON.stringify(error))
        res.status(parseInt(error[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(error);
    } 
}

async function unsaveJob(req,res) {
    const func_name = 'unsaveJob';
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);

    try {
        const response = await userService.unsaveJob(req);
        logger.info(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);
        res.status(parseInt(response[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(response);
    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name + ' error => ' + JSON.stringify(error))
        res.status(parseInt(error[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(error);
    } 
}

async function recruiterDetails(req,res) {
    const func_name = 'recruiterDetails';
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);

    try {
        const response = await userService.recruiterDetails(req);
        logger.info(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);
        res.status(parseInt(response[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(response);
    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name + ' error => ' + JSON.stringify(error))
        res.status(parseInt(error[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(error);
    } 
}

async function updateAppliedJobStatus(req,res) {
    const func_name = 'updateAppliedJobStatus';
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);

    try {
        const response = await userService.updateAppliedJobStatus(req);
        logger.info(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);
        res.status(parseInt(response[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(response);
    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name + ' error => ' + JSON.stringify(error))
        res.status(parseInt(error[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(error);
    } 
}

async function notificationList(req,res) {
    const func_name = 'notificationList';
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);

    try {
        const response = await userService.notificationList(req);
        logger.info(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);
        res.status(parseInt(response[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(response);
    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name + ' error => ' + JSON.stringify(error))
        res.status(parseInt(error[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(error);
    } 
}

async function updateNotificationRead(req,res) {
    const func_name = 'updateNotificationRead';
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);

    try {
        const response = await userService.updateNotificationRead(req);
        logger.info(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);
        res.status(parseInt(response[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(response);
    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name + ' error => ' + JSON.stringify(error))
        res.status(parseInt(error[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(error);
    } 
}

async function uploadImage(req,res) {
    const func_name = 'uploadImage';
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);

    try {
        const response = await userService.uploadImage(req);
        logger.info(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);
        res.status(parseInt(response[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(response);
    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name + ' error => ' + JSON.stringify(error))
        res.status(parseInt(error[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(error);
    } 
}

async function logout(req,res) {
    const func_name = 'logout';
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);

    try {
        const response = await userService.logout(req);
        logger.info(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);
        res.status(parseInt(response[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(response);
    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name + ' error => ' + JSON.stringify(error))
        res.status(parseInt(error[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(error);
    } 
}

async function updateJobDetails(req,res) {
    const func_name = 'updateJobDetails';
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);

    try {
        const response = await userService.updateJobDetails(req);
        logger.info(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);
        res.status(parseInt(response[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(response);
    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name + ' error => ' + JSON.stringify(error))
        res.status(parseInt(error[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(error);
    } 
}

async function uploadCoverLetter(req,res) {
    const func_name = 'uploadCoverLetter';
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);

    try {
        const response = await userService.uploadCoverLetter(req);
        logger.info(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);
        res.status(parseInt(response[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(response);
    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name + ' error => ' + JSON.stringify(error))
        res.status(parseInt(error[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(error);
    } 
}

async function getCoverLetter(req,res) {
    const func_name = 'getCoverLetter';
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);

    try {
        const {filename,filePath} = await userService.getCoverLetter(req);
       
        logger.info(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name);
        // res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
        res.download(filePath,filename ,(err) => {
            if (err) {
                let errResponse= utility_func.responseGenerator(
                    utility_func.responseCons.RESP_SOMETHING_WENT_WRONG,
                    utility_func.statusGenerator(
                        utility_func.httpStatus.ReasonPhrases.INTERNAL_SERVER_ERROR,
                        utility_func.httpStatus.StatusCodes.INTERNAL_SERVER_ERROR),
                    true
                )
                logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name + ' error => ' + JSON.stringify(err))
                res.status(parseInt(errResponse[utility_func.responseCons.RESP_CODE].slice(-3)));
                res.send(errResponse);
            }
          });
    } catch (error) {
        let errResponse= utility_func.responseGenerator(
                    utility_func.responseCons.RESP_SOMETHING_WENT_WRONG,
                    utility_func.statusGenerator(
                        utility_func.httpStatus.ReasonPhrases.INTERNAL_SERVER_ERROR,
                        utility_func.httpStatus.StatusCodes.INTERNAL_SERVER_ERROR),
                    true
                )
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_CONTROLLER + ' => ' + func_name + ' error => ' + JSON.stringify(error))
        res.status(parseInt(errResponse[utility_func.responseCons.RESP_CODE].slice(-3)));
        res.send(errResponse);
    } 
}
