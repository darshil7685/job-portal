const mongoose=require("mongoose")
const utility_func=require("../utilities/utility-functions")

const savedJobSchema = new mongoose.Schema({
    saved_job_id: { type: mongoose.Schema.Types.ObjectId, alias: '_id'},
    job_seeker_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}, // Job seeker reference
    job_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  },
  {
    autoCreate: true,
    timestamps: true,
    toJSON: { 
      virtuals: true, 
      transform: (doc, ret) => { 
        ret.saved_job_id=ret._id.toString(); 
        delete ret._id; 
        return ret; } }   // Ensure aliases work in JSON responses
  });


const SavedJob = mongoose.model('savedJob', savedJobSchema);

module.exports = {SavedJob};
