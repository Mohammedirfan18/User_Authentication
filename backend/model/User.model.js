import mongoose from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String,
    role : {
        type : String,
        enum : ["user","admin"],
        default : "user",
    },
    isVerified : {
        type : Boolean,
        default : false,
    },
    verificationToken : {
        type : String,
    },
    resetPasswordToken : {
        type : String,

    },
    resetPasswordExpires : {
        type : Date,
    }
},{
    timestamps : true,
});

userSchema.pre("save",async function(next){
    if(this.isModified("password"))
    {
        const salt = await bcrypt.genSalt(10); // Generate salt
        this.password = await bcrypt.hash(this.password, salt); // Hash password
    }
    next();
})
const User = mongoose.model("User",userSchema);

export default User;