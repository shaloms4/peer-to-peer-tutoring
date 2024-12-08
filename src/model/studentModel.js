import mongoose,{Schema} from "mongoose";


const studentSchema = mongoose.Schema({
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
    role:{
        type:String,
        default:'student'
    },
    accessToken:{
        type:String,
    },
    refershToken:{
        type:String,
    },
    password:{
        type:String,
        required:true
    },
    subject:{
        type:[string],
        required:true
    },
    prefferedMode:{
        type:[string],
        enum:['virtual','inperson'],
        default: 'virtual'
    },
    location:{
        type:{
            type:String,
            enum:['point'],
            default:'point'
        },
        coordinates:{
            type:[Number],
            required:function(){
                return this.prefferedMode === 'inperson'
            }
        }

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
    address:{
        type:String,
        required: function(){
            return this.prefferedMode === 'inperson'
        }
    }
},{timeStamp:true})


studentSchema.index({location:"2dsphere"});


const Student = mongoose.model("student",studentSchema);

export default Student;