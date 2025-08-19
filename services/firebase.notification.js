const admin = require("firebase-admin");
// const serviceAccount = JSON.parse(process.env.FIREBASE);
const serviceAccount = require("./firebase-admin.json"); 
const utility_func = require('../utilities/utility-functions')
const logger = require('../utilities/services/logger.services');
const axios= require('axios')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports={
    sendNotification:sendNotification
}

// async function sendNotification(notifications){
//     let func_name='sendNotification'
//     logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name)
    
//     try{
        
//         const response = await admin.messaging().sendEach(notifications);
//         logger.info('Firebase Notification Response => ' + JSON.stringify(response["responses"]))
        
//         logger.info(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name)
        
//         return response
//     }catch(error){
//         logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_SERVICE + ' => ' +JSON.stringify(error) +' '+ func_name)
//         throw error
//     }
// }
async function sendNotification(tokens,notification){
    let func_name='sendNotification'
    logger.info(utility_func.logsCons.LOG_ENTER + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name)
    
    try{
        
        const response = await axios.post(
            'https://exp.host/--/api/v2/push/send',
            {
                to: tokens,
                title: notification.title,
                body: notification.body,
                data : notification.data
            },
            {
                headers: { "Content-Type": "application/json" }
            }
        );

        logger.info('Notification Response => ' + JSON.stringify(response["data"]))
        
        logger.info(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_SERVICE + ' => ' + func_name)
        
        return response
    }catch(error){
        logger.error(utility_func.logsCons.LOG_EXIT + utility_func.logsCons.LOG_SERVICE + ' => ' +JSON.stringify(error) +' '+ func_name)
        throw error
    }
}
