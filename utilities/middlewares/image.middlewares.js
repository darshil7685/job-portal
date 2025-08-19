const multer = require("multer");
const utility_func = require("../utility-functions")
const path = require("path")
const allowedExtensions = [".png",".jpg",".jpeg"];
const logger = require('../services/logger.services');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "resumes/"); // Upload directory
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Rename file
  },
});


const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return cb("Only .jpg, .png, .jpeg  files are allowed!",false)
    }
    cb(null, true);
  };

  const upload = multer(
    {  storage,
       limits: { fileSize: 16 * 1024 * 1024 },
       fileFilter
    },
);

let uploadFile = (req, res, next) => {
  let func_name = "uploadFile"
  
  logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name)
  upload.single("file")(req, res, function (err) {
    if (err) {
      logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_SERVICE +' '+JSON.stringify(err)+ ' => ' + func_name)
      return next(err);
    }
    logger.info(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_SERVICE +' => ' + func_name)
    next();
  });
};

const handleFileUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      if (err.code == "LIMIT_FILE_SIZE") {
        return res.status(utility_func.httpStatus.StatusCodes.UNPROCESSABLE_ENTITY).send(utility_func.responseGenerator(
            utility_func.responseCons.RESP_FILE_SIZE_EXCEEDS,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.UNPROCESSABLE_ENTITY, utility_func.httpStatus.StatusCodes.UNPROCESSABLE_ENTITY
            ), true
        ))
      }
      
      return res.status(utility_func.httpStatus.StatusCodes.UNPROCESSABLE_ENTITY).send(utility_func.responseGenerator(
            err.message,
            utility_func.statusGenerator(
                utility_func.httpStatus.ReasonPhrases.UNPROCESSABLE_ENTITY, utility_func.httpStatus.StatusCodes.UNPROCESSABLE_ENTITY
            ), true
        ))
    }
    
    return res.status(utility_func.httpStatus.StatusCodes.UNPROCESSABLE_ENTITY).send(utility_func.responseGenerator(
        err,
        utility_func.statusGenerator(
            utility_func.httpStatus.ReasonPhrases.UNPROCESSABLE_ENTITY, utility_func.httpStatus.StatusCodes.UNPROCESSABLE_ENTITY
        ), true
    ))
}

module.exports = {uploadFile,handleFileUploadError};
