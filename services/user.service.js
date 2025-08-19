
const utility_func = require('../utilities/utility-functions')
const logger = require('../utilities/services/logger.services');
const { User } = require('../models/user.model')
const { Job } = require("../models/job.model")
const { Application } = require("../models/application.model")
const { SavedJob } = require("../models/savedJobs.model")
const { Notification } = require("../models/notification.model")
const bcrypt = require("bcrypt")
const fs = require("fs")
const path = require("path")
const mongoose = require("mongoose");
const { sendNotification } = require("./firebase.notification")
module.exports = {
    userRegistration: userRegistration,
    userLogin: userLogin,
    getUserDetails: getUserDetails,
    getUserResume: getUserResume,
    uploadUserResume: uploadUserResume,
    createJobPost: createJobPost,
    getAllJobPosts: getAllJobPosts,
    applyJob: applyJob,
    getSavedJobs: getSavedJobs,
    getAppliedJobs: getAppliedJobs,
    unsaveJob: unsaveJob,
    recruiterDetails: recruiterDetails,
    updateAppliedJobStatus: updateAppliedJobStatus,
    notificationList: notificationList,
    updateNotificationRead: updateNotificationRead,
    uploadImage: uploadImage,
    logout: logout,
    updateJobDetails: updateJobDetails,
    uploadCoverLetter: uploadCoverLetter,
    getCoverLetter: getCoverLetter
}

async function encryptPassword(password) {
    const hashPassword = await bcrypt.hash(password, 10);
    return hashPassword
}
async function validatePassword(password, encrypted_password) {
    return await bcrypt.compare(password, encrypted_password)
}
async function userFindByEmail(user_email) {
    return await User.findOne({ user_email: user_email })
}

async function userRegistration(req) {
    let func_name = "userRegistration"
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name)

    try {
        let { user_email, user_password, user_name, user_type, experience, bio, designation, company_name } = req.body;

        if (!user_email || !user_password || !user_name || !user_type || !(utility_func.responseCons.USER_TYPES).includes(user_type)) {
            return utility_func.responseGenerator(
                'user_email, user_password, user_name and user_type are required',
                utility_func.statusGenerator(
                    utility_func.httpStatus.ReasonPhrases.UNPROCESSABLE_ENTITY, utility_func.httpStatus.StatusCodes.UNPROCESSABLE_ENTITY
                ), true
            )
        }
        const userExists = await userFindByEmail(user_email)
        if (userExists) {
            return utility_func.responseGenerator(
                utility_func.responseCons.RESP_EMAIL_EXISTS,
                utility_func.statusGenerator(
                    utility_func.httpStatus.ReasonPhrases.UNPROCESSABLE_ENTITY, utility_func.httpStatus.StatusCodes.UNPROCESSABLE_ENTITY
                ), true
            )
        }
        user_password = await encryptPassword(user_password)

        let user = { user_email, user_password, user_name, user_type, experience, bio, designation, company_name }

        if (req.file) {
            user[utility_func.jsonCons.FIELD_RESUME] = {
                filename: req.file.filename,
                contentType: req.file.mimetype,
                originalname: req.file.originalname,
                path: req.file.path
            }
        }
        const userDetails = await User.create(user);

        logger.info(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name);

        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_SUCCESS_MSG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.OK,
                utility_func.httpStatus.StatusCodes.OK),
            false,
            { user_id: userDetails["_id"] }
        )

    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_SERVICE + ' ' + JSON.stringify(error) + " => " + func_name);
        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_SOMETHING_WENT_WRONG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.INTERNAL_SERVER_ERROR,
                utility_func.httpStatus.StatusCodes.INTERNAL_SERVER_ERROR),
            true
        )
    }
}

async function userLogin(req) {
    let func_name = "userLogin"
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name)

    try {

        let { user_email, user_password, fcm_token } = req.body;

        const userExists = await userFindByEmail(user_email)
        if (!userExists || !(await validatePassword(user_password, userExists.user_password))) {
            return utility_func.responseGenerator(
                utility_func.responseCons.RESP_INVALID_CREDENTIALS,
                utility_func.statusGenerator(
                    utility_func.httpStatus.ReasonPhrases.UNPROCESSABLE_ENTITY, utility_func.httpStatus.StatusCodes.UNPROCESSABLE_ENTITY
                ), true
            )
        }
        let user = userExists.toJSON()
        await User.findOneAndUpdate({ user_email: user_email }, { $set: { fcm_token: fcm_token } })
        // let userDetails={user_email:user[utility_func.jsonCons.FIELD_USER_EMAIL],user_id: user[utility_func.jsonCons.FIELD_USER_ID]}
        // let token = await generateToken(userDetails)

        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_LOGIN_SUCCESS_MSG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.OK,
                utility_func.httpStatus.StatusCodes.OK),
            false,
            { user_type: user["user_type"], user_id: user["user_id"] }
        )

    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_SERVICE + ' ' + JSON.stringify(error) + " => " + func_name);
        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_SOMETHING_WENT_WRONG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.INTERNAL_SERVER_ERROR,
                utility_func.httpStatus.StatusCodes.INTERNAL_SERVER_ERROR),
            true
        )
    }
}

async function getUserDetails(req) {
    let func_name = "getUserDetails"
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name)

    try {

        let user_id = req.body.user_id
        let userDetails = await User.findOne({ _id: user_id },
            { user_password: 0, __v: 0, createdAt: 0, updatedAt: 0 }
        )
        const total_job_applied = await Application.countDocuments({ job_seeker_id: user_id })
        userDetails = userDetails.toJSON();
        userDetails["total_job_applied"] = total_job_applied;

        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_SUCCESS_MSG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.OK,
                utility_func.httpStatus.StatusCodes.OK),
            false,
            userDetails
        )

    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_SERVICE + ' ' + JSON.stringify(error) + " => " + func_name);
        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_SOMETHING_WENT_WRONG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.INTERNAL_SERVER_ERROR,
                utility_func.httpStatus.StatusCodes.INTERNAL_SERVER_ERROR),
            true
        )
    }
}

async function getUserResume(req) {
    let func_name = "getUserResume"
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name)

    try {
        let user_id = req.query.user_id

        let userDetails = await User.findOne({ _id: user_id },
            { resume: 1 }
        )

        userDetails = userDetails.toJSON();
        let filePath
        let filename = userDetails.resume.originalname
        if (userDetails.resume) {
            // filePath = path.join(__dirname, "../resumes", userDetails.resume.originalname);
            filePath = userDetails.resume.path
        }
        console.log("filePath", filePath);

        return { filename, filePath }
    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_SERVICE + ' ' + JSON.stringify(error) + " => " + func_name);
        throw error
    }
}

async function uploadUserResume(req) {
    let func_name = "uploadUserResume"
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name)

    try {
        let user_id = req.body.user_id

        let userDetails = await User.findOne({ _id: user_id },
            { resume: 1 }
        )
        userDetails = userDetails.toJSON();
        if (userDetails.resume) {
            const filePath = path.join(__dirname, "../resumes", userDetails.resume.originalname);
            if (fs.existsSync(filePath)) {
                await fs.promises.unlink(filePath)
            }
        }
        if (req.file) {
            let resume = {
                filename: req.file.filename,
                contentType: req.file.mimetype,
                originalname: req.file.originalname,
                path: path.join(__dirname, "../resumes", req.file.originalname)
            }
            await User.findByIdAndUpdate({ _id: user_id }, { $set: { resume: resume } })
        }
        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_SUCCESS_MSG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.OK,
                utility_func.httpStatus.StatusCodes.OK),
            false
        )
    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_SERVICE + ' ' + JSON.stringify(error) + " => " + func_name);
        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_SOMETHING_WENT_WRONG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.INTERNAL_SERVER_ERROR,
                utility_func.httpStatus.StatusCodes.INTERNAL_SERVER_ERROR),
            true
        )
    }
}


async function createJobPost(req) {
    let func_name = "createJobPost"
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name)

    try {
        let { recruiter_id, position, location, salary, job_type, summary, requirenment, number_of_opening } = req.body;


        const jobDetails = await Job.create({ recruiter_id, position, location, salary, job_type, summary, requirenment, number_of_opening });

        if (jobDetails) {
            const users = await User.find({ user_type: "job_seeker" }, { user_id: 1, company_name: 1, fcm_token: 1 })
            if (users && users.length !== 0) {
                const companyDetails = await User.findOne({ _id: jobDetails.recruiter_id }, { company_name: 1 })
                let notifications = []
                users.forEach((user) => {
                    notifications.push({
                        job_id: jobDetails._id,
                        job_seeker_id: user._id,
                        recruiter_id: jobDetails.recruiter_id,
                        title: "Job Posted",
                        message: `${companyDetails.company_name} Posted the new job thay you might like click here to Apply now!`,
                        type: 'job_posted'
                    })
                })
                await Notification.insertMany(notifications)
                let notification = {
                    title: "Job Posted",
                    body: `${companyDetails.company_name} Posted the new job thay you might like click here to Apply now!`,
                    data: { job_id: jobDetails._id }
                }
                let notificationPayload = users.map((user) => ({
                    token: user.fcm_token,
                    notification: notification
                }))
                let tokens = users.map((user) => {
                    return user.fcm_token
                }).filter((token) => token != undefined || token != null)

                if (Array.isArray(tokens) && tokens.length !== 0) {
                    await sendNotification(tokens, notification)
                }

            }
        }

        logger.info(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name);

        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_SUCCESS_MSG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.OK,
                utility_func.httpStatus.StatusCodes.OK),
            false,
            { job_id: jobDetails._id }
        )

    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_SERVICE + ' ' + JSON.stringify(error) + " => " + func_name);
        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_SOMETHING_WENT_WRONG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.INTERNAL_SERVER_ERROR,
                utility_func.httpStatus.StatusCodes.INTERNAL_SERVER_ERROR),
            true
        )
    }
}

async function getAllJobPosts(req) {
    let func_name = "getAllJobPosts"
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name)

    try {
        const user_id = req.body.user_id
        const job_id = req.body.job_id

        const filters = {
            $and: []
        };
        const user = await User.findById(user_id);
        if (user && user.user_type === 'recruiter') {
            filters.$and.push({ recruiter_id: user._id });
        }
        console.log("filters", filters, user);

        if (req.body.filter_by_location && req.body.filter_by_location.length > 0) {
            filters.$and.push({ location: { $in: req.body.filter_by_location } });
        }
        if (req.body.filter_by_salary && req.body.filter_by_salary !== '') {
            const [minSalary, maxSalary] = req.body.filter_by_salary.split("-").map(Number);
            filters.$and.push({ salary: { $gte: minSalary, $lte: maxSalary } });
        }
        if (req.body.filter_by_job_type && req.body.filter_by_job_type.length > 0) {
            filters.$and.push({ job_type: { $in: req.body.filter_by_job_type } });
        }
        if (req.body.search && req.body.serach !== '') {
            filters.$and.push({ position: { $regex: req.body.search, $options: "i" } });
        }
        if (filters.$and.length === 0) {
            delete filters.$and;
        }

        let jobDetails = await Job.aggregate([
            { $match: filters },
            {
                $lookup: {
                    from: "users",
                    localField: "recruiter_id",
                    foreignField: "_id",
                    as: "recruiterDetails"
                }
            },
            { $unwind: "$recruiterDetails" },
            {
                $project: {
                    company_name: "$recruiterDetails.company_name",
                    job_id: "$_id",
                    recruiter_id: "$recruiter_id",
                    position: "$position",
                    location: "$location",
                    salary: "$salary",
                    job_type: "$job_type",
                    summary: "$summary",
                    requirenment: "$requirenment",
                    image: "$image",
                    is_job_closed: "$is_job_closed",
                    createdAt: "$createdAt",
                    number_of_opening: "$number_of_opening",
                }
            }
        ])

        if (jobDetails && Array.isArray(jobDetails) && jobDetails.length > 0) {
            if (job_id) {
                jobDetails = jobDetails.filter((job) => job._id == job_id)
            }
            const applicationDetails = await Application.find({ job_seeker_id: user_id }, { job_id: 1 })
            const savedJobDetails = await SavedJob.find({ job_seeker_id: user_id })

            jobDetails = jobDetails.map((job) => {
                const isApplied = applicationDetails.findIndex((app) => app.job_id.toString() == job.job_id)
                const isSavedJobs = savedJobDetails.findIndex((savedJob) => savedJob.job_id.toString() == job.job_id)
                job["is_job_applied"] = isApplied >= 0 ? true : false
                job["is_job_saved"] = isSavedJobs >= 0 ? true : false
                job["saved_job_id"] = isSavedJobs >= 0 ? savedJobDetails[isSavedJobs]["_id"] : null
                return job
            })
        }

        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_SUCCESS_MSG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.OK,
                utility_func.httpStatus.StatusCodes.OK),
            false,
            jobDetails
        )

    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_SERVICE + ' ' + JSON.stringify(error) + " => " + func_name);
        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_SOMETHING_WENT_WRONG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.INTERNAL_SERVER_ERROR,
                utility_func.httpStatus.StatusCodes.INTERNAL_SERVER_ERROR),
            true
        )
    }
}


async function applyJob(req) {
    let func_name = "applyJob"
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name)

    try {
        let { apply_type, job_id, job_seeker_id, recruiter_id, cover_letter, status } = req.body;

        const applicationExists = await Application.findOne({ job_id: job_id, job_seeker_id: job_seeker_id })
        const savedJobExists = await SavedJob.findOne({ job_id: job_id, job_seeker_id: job_seeker_id })
        let applicationId
        if (apply_type == "save_job") {
            if (savedJobExists) {
                return utility_func.responseGenerator(
                    utility_func.responseCons.RESP_APPLICATION_SAVED,
                    utility_func.statusGenerator(
                        utility_func.httpStatus.ReasonPhrases.UNPROCESSABLE_ENTITY, utility_func.httpStatus.StatusCodes.UNPROCESSABLE_ENTITY
                    ), true
                )
            }
            await SavedJob.create({ job_id, job_seeker_id });
        }
        if (apply_type == "apply_job") {
            if (applicationExists) {
                return utility_func.responseGenerator(
                    utility_func.responseCons.RESP_APPLICATION_APPLIED,
                    utility_func.statusGenerator(
                        utility_func.httpStatus.ReasonPhrases.UNPROCESSABLE_ENTITY, utility_func.httpStatus.StatusCodes.UNPROCESSABLE_ENTITY
                    ), true
                )
            }
            let status_history = [{ status: status, updated_At: Date.now }]
            const applicationDetails = await Application.create({ job_id, job_seeker_id, recruiter_id, cover_letter, status, status_history });
            const jobSeekerDetails = await User.findOne({ _id: job_seeker_id }, { user_name: 1 })
            const recruiterDetails = await User.findOne({ _id: recruiter_id }, { fcm_token: 1 })
            applicationId = applicationDetails._id
            if (applicationDetails) {
                let notification = {
                    job_id: applicationDetails.job_id,
                    job_seeker_id: applicationDetails.job_seeker_id,
                    recruiter_id: applicationDetails.recruiter_id,
                    applied_job_id: applicationDetails._id,
                    title: "Application submit",
                    message: `Your application is submitted successfully. Click here to check the status`,
                    type: 'status_update'
                }
                await Notification.create(notification);

                let jobNotification = {
                    job_id: applicationDetails.job_id,
                    job_seeker_id: applicationDetails.job_seeker_id,
                    recruiter_id: applicationDetails.recruiter_id,
                    applied_job_id: applicationDetails._id,
                    title: "Job Application",
                    message: `${jobSeekerDetails.user_name} has applied for job. Click here to check`,
                    type: 'job_application'
                }
                await Notification.create(jobNotification);

            }
            let notification = {
                title: "Job Application",
                body: `${jobSeekerDetails.user_name} has applied for job. Click here to check`,
                data: { applied_job_id: applicationDetails._id }
            }
            if (recruiterDetails.fcm_token) {
                await sendNotification(recruiterDetails.fcm_token, notification)
            }
        }

        logger.info(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name);

        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_SUCCESS_MSG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.OK,
                utility_func.httpStatus.StatusCodes.OK),
            false,
            { application_id: applicationId }
        )

    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_SERVICE + ' ' + JSON.stringify(error) + " => " + func_name);
        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_SOMETHING_WENT_WRONG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.INTERNAL_SERVER_ERROR,
                utility_func.httpStatus.StatusCodes.INTERNAL_SERVER_ERROR),
            true
        )
    }
}

async function getSavedJobs(req) {
    let func_name = "getSavedJobs"
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name)

    try {
        let user_id = req.body.user_id

        let jobDetails = await SavedJob.aggregate([
            {
                $match: { job_seeker_id: new mongoose.Types.ObjectId(user_id) }
            },
            {
                $lookup: {
                    from: "jobs",
                    localField: "job_id",
                    foreignField: "_id",
                    as: "jobDetails"
                }
            },
            { $unwind: "$jobDetails" },
            {
                $lookup: {
                    from: "users",
                    localField: "jobDetails.recruiter_id",
                    foreignField: "_id",
                    as: "recruiterDetails"
                }
            },
            { $unwind: "$recruiterDetails" },
            {
                $project: {
                    saved_job_id: "$_id",
                    recruiter_id: "$jobDetails.recruiter_id",
                    position: "$jobDetails.position",
                    location: "$jobDetails.location",
                    salary: "$jobDetails.salary",
                    job_type: "$jobDetails.job_type",
                    summary: "$jobDetails.summary",
                    requirenment: "$jobDetails.requirenment",
                    job_id: "$jobDetails._id",
                    image: "$jobDetails.image",
                    company_name: "$recruiterDetails.company_name",
                    is_job_saved: "$jobDetails.is_job_saved"
                }
            }
        ]);

        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_SUCCESS_MSG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.OK,
                utility_func.httpStatus.StatusCodes.OK),
            false,
            jobDetails
        )

    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_SERVICE + ' ' + JSON.stringify(error) + " => " + func_name);
        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_SOMETHING_WENT_WRONG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.INTERNAL_SERVER_ERROR,
                utility_func.httpStatus.StatusCodes.INTERNAL_SERVER_ERROR),
            true
        )
    }
}


async function getAppliedJobs(req) {
    let func_name = "getAppliedJobs"
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name)

    try {
        let user_id = req.body.user_id
        let applied_job_id = req.body.applied_job_id

        let matchCondition = {};

        if (user_id && applied_job_id) {
            matchCondition.$and = [
                { job_seeker_id: new mongoose.Types.ObjectId(user_id) },
                { _id: new mongoose.Types.ObjectId(applied_job_id) }
            ];
        } else if (user_id) {
            matchCondition.job_seeker_id = new mongoose.Types.ObjectId(user_id);
        } else if (applied_job_id) {
            matchCondition._id = new mongoose.Types.ObjectId(applied_job_id);
        }
        let jobDetails = await Application.aggregate([
            {
                $match: matchCondition
            },
            {
                $lookup: {
                    from: "jobs",
                    localField: "job_id",
                    foreignField: "_id",
                    as: "jobDetails"
                }
            },
            { $unwind: "$jobDetails" },
            {
                $lookup: {
                    from: "users",
                    localField: "jobDetails.recruiter_id",
                    foreignField: "_id",
                    as: "recruiterDetails"
                }
            },
            { $unwind: "$recruiterDetails" },
            {
                $project: {
                    applied_job_id: "$_id",
                    job_id: "$jobDetails._id",
                    status: "$status",
                    status_history: "$status_history",
                    recruiter_id: "$jobDetails.recruiter_id",
                    job_seeker_id: "$job_seeker_id",
                    position: "$jobDetails.position",
                    location: "$jobDetails.location",
                    salary: "$jobDetails.salary",
                    job_type: "$jobDetails.job_type",
                    summary: "$jobDetails.summary",
                    requirenment: "$jobDetails.requirenment",
                    image: "$jobDetails.image",
                    company_name: "$recruiterDetails.company_name",
                    cover_letter: "$cover_letter",
                    cover_letter_doc: "$cover_letter_doc"
                }
            }
        ]);

        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_SUCCESS_MSG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.OK,
                utility_func.httpStatus.StatusCodes.OK),
            false,
            jobDetails
        )

    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_SERVICE + ' ' + JSON.stringify(error) + " => " + func_name);
        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_SOMETHING_WENT_WRONG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.INTERNAL_SERVER_ERROR,
                utility_func.httpStatus.StatusCodes.INTERNAL_SERVER_ERROR),
            true
        )
    }
}

async function unsaveJob(req) {
    let func_name = "unsaveJob"
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name)

    try {
        let { saved_job_id } = req.body;

        await SavedJob.findByIdAndDelete(saved_job_id);

        logger.info(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name);

        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_SUCCESS_MSG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.OK,
                utility_func.httpStatus.StatusCodes.OK),
            false
        )

    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_SERVICE + ' ' + JSON.stringify(error) + " => " + func_name);
        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_SOMETHING_WENT_WRONG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.INTERNAL_SERVER_ERROR,
                utility_func.httpStatus.StatusCodes.INTERNAL_SERVER_ERROR),
            true
        )
    }
}

async function recruiterDetails(req) {
    let func_name = "recruiterDetails"
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name)

    try {
        let user_id = req.body.user_id

        let jobDetails = await User.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(user_id) }
            },
            {
                $lookup: {
                    from: "jobs",
                    localField: "_id",
                    foreignField: "recruiter_id",
                    as: "jobDetails"
                }
            },
            {
                $lookup: {
                    from: "applications",
                    localField: "_id",
                    foreignField: "recruiter_id",
                    as: "applicationDetails"
                }
            },
            {
                $lookup: {
                    from: "jobs",
                    localField: "applicationDetails.job_id",
                    foreignField: "_id",
                    as: "applicationJobDetails"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "applicationDetails.job_seeker_id",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $project: {
                    user_name: "$user_name",
                    user_email: "$user_email",
                    company_name: "$company_name",
                    jobDetails: {
                        $map: {
                            input: "$jobDetails",
                            as: "job",
                            in: {
                                job_id: "$$job._id",
                                recruiter_id: "$$job.recruiter_id",
                                position: "$$job.position",
                                location: "$$job.location",
                                salary: "$$job.salary",
                                job_type: "$$job.job_type",
                                summary: "$$job.summary",
                                requirenment: "$$job.requirenment",
                                number_of_opening: "$$job.number_of_opening",
                                image: "$$job.image",
                                is_job_closed: "$$job.is_job_closed"
                            }
                        }
                    },
                    appliedJobDetails: {
                        $map: {
                            input: "$applicationDetails",
                            as: "application",
                            in: {
                                applied_job_id: "$$application._id",
                                job_id: "$$application.job_id",
                                job_seeker_id: "$$application.job_seeker_id",
                                recruiter_id: "$$application.recruiter_id",
                                status: "$$application.status",
                                cover_letter: "$$application.cover_letter",
                                cover_letter_doc: "$$application.cover_letter_doc",
                                job: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: "$applicationJobDetails",
                                                as: "job",
                                                cond: { $eq: ["$$job._id", "$$application.job_id"] }
                                            }
                                        },
                                        0
                                    ]
                                },
                                job_seeker: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: "$userDetails",
                                                as: "user",
                                                cond: { $eq: ["$$user._id", "$$application.job_seeker_id"] }
                                            }
                                        },
                                        0
                                    ]
                                }
                            }
                        }
                    },

                }

            }

        ]);
        if (jobDetails && jobDetails[0] && jobDetails[0]["appliedJobDetails"] && jobDetails[0]["appliedJobDetails"].length != 0) {
            jobDetails[0]["appliedJobDetails"] = jobDetails[0]["appliedJobDetails"].map((appliedJob) => {
                let { job, job_seeker, ...rest } = appliedJob
                delete job_seeker["user_password"]
                delete job_seeker["fcm_token"]
                delete job_seeker["user_password"]

                return { ...rest, ...job, ...job_seeker }
            })
        }
        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_SUCCESS_MSG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.OK,
                utility_func.httpStatus.StatusCodes.OK),
            false,
            jobDetails
        )

    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_SERVICE + ' ' + JSON.stringify(error) + " => " + func_name);
        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_SOMETHING_WENT_WRONG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.INTERNAL_SERVER_ERROR,
                utility_func.httpStatus.StatusCodes.INTERNAL_SERVER_ERROR),
            true
        )
    }
}


async function updateAppliedJobStatus(req) {
    let func_name = "updateAppliedJobStatus"
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name)

    try {

        let { applied_job_id, status } = req.body
        let status_history = { status: status, update_At: Date.now }
        let applicationDetails = await Application.findOneAndUpdate({ _id: applied_job_id },
            { $set: { status: status }, $push: { status_history: status_history } }, { new: true }
        )
        let userDetails = await User.findOne({ _id: applicationDetails.job_seeker_id }, { fcm_token: 1 })

        // let notification = {
        //     job_id : applicationDetails.job_id, 
        //     job_seeker_id : applicationDetails.job_seeker_id,
        //     recruiter_id : applicationDetails.recruiter_id,
        //     applied_job_id: applicationDetails._id,
        //     title:"Application status update",
        //     message:`Your application's status is updated. Click here to check the status`,
        //     type:'status_update' 
        // }
        // await Notification.create(notification);
        await Notification.findOneAndUpdate({ applied_job_id: applied_job_id },
            {
                $set: {
                    is_read: false,
                    title: "Application status update",
                    message: `Your application's status is updated. Click here to check the status`,
                }
            }
        )
        let notification = {
            title: "Application status update",
            body: `Your application's status is updated. Click here to check the status`,
            data: { applied_job_id }
        }
        let notificationPayload = [{
            token: userDetails.fcm_token,
            notification: notification
        }]
        if (userDetails.fcm_token) {
            await sendNotification(userDetails.fcm_token, notification)
        }
        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_SUCCESS_MSG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.OK,
                utility_func.httpStatus.StatusCodes.OK),
            false
        )

    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_SERVICE + ' ' + JSON.stringify(error) + " => " + func_name);
        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_SOMETHING_WENT_WRONG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.INTERNAL_SERVER_ERROR,
                utility_func.httpStatus.StatusCodes.INTERNAL_SERVER_ERROR),
            true
        )
    }
}

async function notificationList(req) {
    let func_name = "notificationList"
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name)

    try {
        const user_id = req.body.user_id
        let notificationList
        if (req.body.user_id) {
            notificationList = await Notification.find({ job_seeker_id: req.body.user_id }, {})
        }
        if (req.body.recruiter_id) {
            notificationList = await Notification.find({ recruiter_id: req.body.recruiter_id, type: "job_application" }, {})
        }

        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_SUCCESS_MSG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.OK,
                utility_func.httpStatus.StatusCodes.OK),
            false,
            notificationList
        )

    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_SERVICE + ' ' + JSON.stringify(error) + " => " + func_name);
        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_SOMETHING_WENT_WRONG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.INTERNAL_SERVER_ERROR,
                utility_func.httpStatus.StatusCodes.INTERNAL_SERVER_ERROR),
            true
        )
    }
}

async function updateNotificationRead(req) {
    let func_name = "updateNotificationRead"
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name)

    try {
        const notification_id = req.body.notification_id
        await Notification.findByIdAndUpdate({ _id: notification_id }, { $set: { is_read: true } })

        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_SUCCESS_MSG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.OK,
                utility_func.httpStatus.StatusCodes.OK),
            false
        )
    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_SERVICE + ' ' + JSON.stringify(error) + " => " + func_name);
        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_SOMETHING_WENT_WRONG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.INTERNAL_SERVER_ERROR,
                utility_func.httpStatus.StatusCodes.INTERNAL_SERVER_ERROR),
            true
        )
    }
}

async function uploadImage(req) {
    let func_name = "uploadImage"
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name)

    try {
        let job_id = req.body.job_id

        let jobDetails = await Job.findOne({ _id: job_id },
            { image: 1 }
        )
        jobDetails = jobDetails.toJSON();
        if (jobDetails.image) {
            const filePath = path.join(__dirname, "../resumes", jobDetails.image.originalname);
            if (fs.existsSync(filePath)) {
                await fs.promises.unlink(filePath)
            }
        }
        if (req.file) {
            let image = {
                filename: req.file.filename,
                contentType: req.file.mimetype,
                originalname: req.file.originalname,
                path: path.join(__dirname, "../resumes", req.file.originalname)
            }
            await Job.findByIdAndUpdate({ _id: job_id }, { $set: { image: image } })
        }
        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_SUCCESS_MSG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.OK,
                utility_func.httpStatus.StatusCodes.OK),
            false
        )
    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_SERVICE + ' ' + JSON.stringify(error) + " => " + func_name);
        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_SOMETHING_WENT_WRONG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.INTERNAL_SERVER_ERROR,
                utility_func.httpStatus.StatusCodes.INTERNAL_SERVER_ERROR),
            true
        )
    }
}

async function logout(req) {
    let func_name = "logout"
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name)

    try {
        let user_id = req.body.user_id;

        await User.findByIdAndUpdate(user_id, { fcm_token: null });

        logger.info(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name);

        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_SUCCESS_MSG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.OK,
                utility_func.httpStatus.StatusCodes.OK),
            false
        )

    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_SERVICE + ' ' + JSON.stringify(error) + " => " + func_name);
        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_SOMETHING_WENT_WRONG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.INTERNAL_SERVER_ERROR,
                utility_func.httpStatus.StatusCodes.INTERNAL_SERVER_ERROR),
            true
        )
    }
}

async function updateJobDetails(req) {
    let func_name = "updateJobDetails"
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name)

    try {
        let { job_id, is_job_closed } = req.body;

        await Job.findByIdAndUpdate(job_id, { is_job_closed: is_job_closed });

        logger.info(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name);

        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_SUCCESS_MSG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.OK,
                utility_func.httpStatus.StatusCodes.OK),
            false
        )

    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_SERVICE + ' ' + JSON.stringify(error) + " => " + func_name);
        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_SOMETHING_WENT_WRONG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.INTERNAL_SERVER_ERROR,
                utility_func.httpStatus.StatusCodes.INTERNAL_SERVER_ERROR),
            true
        )
    }
}

async function uploadCoverLetter(req) {
    let func_name = "uploadCoverLetter"
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name)

    try {
        let application_id = req.body.application_id

        let applicationDetails = await Application.findOne({ _id: application_id },
            { cover_letter_doc: 1 }
        )
        applicationDetails = applicationDetails.toJSON();

        if (applicationDetails.cover_letter_doc) {
            const filePath = path.join(__dirname, "../coverLetters", applicationDetails.cover_letter_doc.originalname);
            if (fs.existsSync(filePath)) {
                await fs.promises.unlink(filePath)
            }
        }
        console.log("req.filereq.file", req.file);
        console.log("application_id", application_id);

        if (req.file) {
            let cover_letter_doc = {
                filename: req.file.filename,
                contentType: req.file.mimetype,
                originalname: req.file.originalname,
                path: path.join(__dirname, "../coverLetters", req.file.originalname)
            }

            await Application.findByIdAndUpdate({ _id: application_id }, { $set: { cover_letter_doc: cover_letter_doc } })
        }
        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_SUCCESS_MSG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.OK,
                utility_func.httpStatus.StatusCodes.OK),
            false
        )
    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_SERVICE + ' ' + JSON.stringify(error) + " => " + func_name);
        return utility_func.responseGenerator(
            utility_func.responseCons.RESP_SOMETHING_WENT_WRONG,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.INTERNAL_SERVER_ERROR,
                utility_func.httpStatus.StatusCodes.INTERNAL_SERVER_ERROR),
            true
        )
    }
}


async function getCoverLetter(req) {
    let func_name = "getCoverLetter"
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name)

    try {
        let application_id = req.query.application_id

        let applicationDetails = await Application.findOne({ _id: application_id },
            { cover_letter_doc: 1 }
        )

        applicationDetails = applicationDetails.toJSON();
        let filePath
        let filename = applicationDetails.cover_letter_doc.originalname
        if (applicationDetails.cover_letter_doc) {
            // filePath = path.join(__dirname, "../resumes", userDetails.resume.originalname);
            filePath = applicationDetails.cover_letter_doc.path
        }
        console.log("filePath", filePath);

        return { filename, filePath }
    } catch (error) {
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_SERVICE + ' ' + JSON.stringify(error) + " => " + func_name);
        throw error
    }
}

