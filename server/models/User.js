import mongoose from "mongoose";//it helps to define schema 
// and interact with mongodb
const userSchema=new mongoose.Schema(//here, creating a schema
    {
        name:{
            type:String,
            required:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        password:{
            type:String,
            required:true,
        },
        otp: {
            type: String,
        },

        otpExpiry: {
            type: Date,
        },
        isOtpVerified: {
            type: Boolean,
            default: false,
        },
        passwordUpdated: {
            type: Boolean,
            default: false,
        },
    },
    {//mongodb automatically creates createAt, updateAt when 
        // we pass timestamps as second argument
        timestamps:true,
    }
);

//this tells mongodb to create collection called users using 
// this schema. mongoose automatically converts User to users
//inside mongodb
const User=mongoose.model("User",userSchema);
export default User;//by exporting, other files can use it