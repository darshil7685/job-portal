const { check, header, body } = require('express-validator')

const USER_TYPES = ['job_seeker', 'recruiter']

const validateUserRegistration = [
    // body('user_email').isEmail().withMessage('Invalid email format')
    // body('user_id', 'user_id required and should be string')
    //     .optional()
    //     .exists()
    //     .bail()
    //     .custom((value) => value === null || typeof value === 'string'),
    // body('user_name','user_name required and should be string')
    //     .exists()
    //     .bail()
    //     .isString(),
    // body('user_email','user_email required and should be string')
    //     .exists()
    //     .bail()
    //     .isString(),
    // body('user_password','user_password required and should be string')
    //     .exists()
    //     .bail()
    //     .isString(),
    // body('user_type',`user_type required and should be one of : ${USER_TYPES.join(', ')}`)
    //     .exists()
    //     .bail()
    //     .isString()
    //     .isIn(USER_TYPES)
];
const validateUserLogin=[
    body('user_email','user_email required and should be string')
        .exists()
        .bail()
        .isString(),
    body('user_password','user_password required and should be string')
        .exists()
        .bail()
        .isString()
]
const validateToken=[
    header('token','token required and should be string')
        .exists()
        .bail()
        .isString()
]


module.exports={
    validateUserRegistration:validateUserRegistration,
    validateUserLogin:validateUserLogin,
    validateToken:validateToken
}
