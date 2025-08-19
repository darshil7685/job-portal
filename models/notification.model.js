const mongoose=require("mongoose")
const utility_func=require("../utilities/utility-functions")

const notificationSchema = new mongoose.Schema({
    notification_id: { type: mongoose.Schema.Types.ObjectId, alias: '_id'},
    job_id:{type: mongoose.Schema.Types.ObjectId, ref:'Job'},
    job_seeker_id:{type: mongoose.Schema.Types.ObjectId, ref:'User'},
    recruiter_id:{type: mongoose.Schema.Types.ObjectId, ref:'User'},
    applied_job_id:{type: mongoose.Schema.Types.ObjectId, ref:'Application'},
    type: {type: String, enum:['job_posted','status_update','job_application'] },
    title: {type: String},
    message: {type: String},
    is_read: {type: Boolean, default:false}
  },
  {
    autoCreate: true,
    timestamps: true,
    toJSON: { 
      virtuals: true, 
      transform: (doc, ret) => { 
        ret.notification_id=ret._id.toString(); 
        delete ret._id; 
        return ret; } }   
  });


const Notification = mongoose.model('Notification', notificationSchema);

module.exports = {Notification};
