import mongoose,{Schema} from "mongoose";


const tutorSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    googleId:{
        type:String
    },
    password:{
        type:String,
        required:true
    },
    accesstoken:{
        type:String
    },
    refershToken:{
        type:String,
    },
    verificationToken:{
        type:String,
    },
    verificationTokenExpiresAt:{
        type:Date
    },
    resetToken:{
        type:String,
    },
    resetToeknExpiresAt:{
        type:Date
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    subject:{
        type:[String],
        required:true
    },
    role:{
        type:String,
        default:'tutor'
    },
    availablity:[
        {
            day:{
                type:String,
                required:true
            },
            timeSlot:{
                type:String,
                required:true
            }
        }
    ],
    location:{
        type:{
            type:String,
            enum:["point"],
            default:'point'
        },
        coordinates:{
            type:[Number],
            required:true
        }
    }
})



tutorSchema.index({location:'2dsphere'})
const Tutor = mongoose.model("tutor",tutorSchema)


export default Tutor;