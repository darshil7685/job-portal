const mongoose=require("mongoose")
const utility_func=require("../utilities/utility-functions")


const coverLetterDocSchema = new mongoose.Schema({
  originalname: { type: String, required: true },
  filename: { type: String, required: true },
  contentType: { type: String, required: true },
  path: { type: String, required: true }, 
});
const applicationSchema = new mongoose.Schema({
    application_id: { type: mongoose.Schema.Types.ObjectId, alias: '_id'},
    job_id:{type: mongoose.Schema.Types.ObjectId, ref:'Job'},
    job_seeker_id:{type: mongoose.Schema.Types.ObjectId, ref:'User'},
    recruiter_id:{type: mongoose.Schema.Types.ObjectId, ref:'User'},
    status: { type: String },
    status_history: [
      {
        status: { type: String, required: true },
        updated_at: { type: Date, default: Date.now },
      }],
    cover_letter:{type:String},
    cover_letter_doc:coverLetterDocSchema
  },
  {
    autoCreate: true,
    timestamps: true,
    toJSON: { 
      virtuals: true, 
      transform: (doc, ret) => { 
        ret.application_id=ret._id.toString(); 
        delete ret._id; 
        return ret; } }   // Ensure aliases work in JSON responses
  });


const   Application = mongoose.model('Application', applicationSchema);

module.exports = {Application};
