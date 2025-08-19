const express = require("express");
const router = express.Router();
const middleware = require('../utilities/middlewares/validator.middlewares')
const fileUploadMiddleware = require('../utilities/middlewares/fileUpload.middlewares')
const imageUploadMiddleware = require('../utilities/middlewares/image.middlewares')
const coverLetterMiddleware = require('../utilities/middlewares/coverLetter.middlewares')


const jwtMiddleware = require('../utilities/middlewares/jwt-service.middlewares')
const userMiddleware = require('../middlewares/user.middleware')
const userController = require('../controllers/user.controller')

router.post('/registration/v1',userController.userRegistration)
router.post('/login/v1',userController.userLogin)
router.post('/userDetails/v1',userController.getUserDetails)

router.get('/get/resume/v1',userController.getUserResume)
router.post('/upload/resume/v1',fileUploadMiddleware.uploadFile,fileUploadMiddleware.handleFileUploadError,userController.uploadUserResume)
router.post('/upload/image/v1',imageUploadMiddleware.uploadFile,imageUploadMiddleware.handleFileUploadError,userController.uploadImage)
router.post('/upload/coverLetter/v1',coverLetterMiddleware.uploadFile,imageUploadMiddleware.handleFileUploadError,userController.uploadCoverLetter)
router.get('/get/coverLetter/v1',userController.getCoverLetter)

router.post('/createJobPost/v1',userController.createJobPost)
router.post('/get/AllJobPosts/v1',userController.getAllJobPosts)
router.post('/get/savedJobs/v1',userController.getSavedJobs)
router.post('/get/appliedJobs/v1',userController.getAppliedJobs)

router.post('/apply/job/v1',userController.applyJob)
router.post('/unsave/job/v1',userController.unsaveJob)

router.post('/recruiterDetails/v1',userController.recruiterDetails)
router.post('/updateAppliedJobStatus/v1',userController.updateAppliedJobStatus)

router.post('/notificationList/v1',userController.notificationList)
router.post('/update/notification/read/v1',userController.updateNotificationRead)

router.post('/logout/v1',userController.logout)
router.post('/update/jobDetails/v1',userController.updateJobDetails)


module.exports=router