import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
// import nodemailer from 'nodemailer';
import transporter from '../config/nodeMailer.js';



export const register = async (req,res)=>{
    const  {name,email,password} = req.body;

    if(!name || !email || !password){
        return res.json({success:false, message:"invalid credential"})
    }

    try{

        const existingUser = await userModel.findOne({email});

        if(existingUser){
            return res.json({success:false, message:"user already exist"});

        }
        const hashedPassword = await bcrypt.hash(password,10);

        const user = new userModel({name, email, password:hashedPassword});
        await user.save();

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});

        res.cookie('token', token,  {
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none':'strict',
            maxAge: 7*24*60*60*1000
        })

        return res.json({success:true});

    }catch(error){
        res.json({success:false, message:error.message})
    }

}

export const login = async (req,res)=>{
    const {email, password}= req.body;

    if(!email || !password){
        return res.json({success:false,message:"email and password are required"});
    }

    try{
        const user = await userModel.findOne({email});
        
        if(!user){
            return res.json({success:false,message:"Invalid email"})
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            // console.log(`SMTP_USER : ${process.env.SMTP_USER} and SMTP_PASSWORD : ${process.env.SMTP_PASSWORD}`)
            return res.json({success:false, message:"invalid Password"})
        }
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});
        

        res.cookie('token', token,  {
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none':'strict',
            maxAge: 7*24*60*60*1000
        });
        //sending welcome email

        const mailOption={
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to Mohammed Fashan's WebPage",
            text: `Welcome to Mohammed fashan website. your account has been created with email id : ${email}`
        }
        await transporter.sendMail(mailOption);

        return res.json({success:true});

    }catch(error){
        return res.json({success:false, message:error.message})
    }
    
}

export const logout = async(req,res)=>{
    try{
        res.clearCookie('token',{
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production',
            sameSite : process.env.NODE_ENV === 'production' ? 'none':'strict',
        })
        return res.json({success:true, message:"Logged out"})

    }catch(error){
        return res.json({success:false, message: error.message});
    }
}

//send verification OTP
// export const sendVerifyOtp = async (req, res)=>{
//     try{
//         const {userId} = req.body;

//         const user = await userModel.findById(userId);

//         if(user.isAccountVerified){
//             return res.json({success:false, message:"Account already verified"})
//         }

//       const otp = String (Math.floor(100000 + Math.random() * 900000 ));

//       user.verifyOtp = otp;
//       user.verifyOtpeExpireAt = Date.now()+ 24*60*60*1000;

//       await user.save();

//       const mailOption = {
//             from: process.env.SENDER_EMAIL,
//             to: user.email,
//             subject: 'Account verification OTP',
//             text: `Your OTP is ${otp}. Verify your account using this OTP.`

//       }
//       await transporter.sendMail(mailOption);

//       res.json({success:true, message:"Verification OTP Sent on Email"});

//     }catch(error){
//         res.json({success:false, message:error.message})
//     }

// }

export const sendVerifyOtp = async (req, res) => {
    try {
        const { userId } = req.body;
    

        // Find the user by ID
        const user = await userModel.findById(userId);
      

        // Check if the user is found
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        // Check if the account is already verified
        if (user.isAccountVerified) {
            return res.json({ success: false, message: "Account already verified" });
        }

        // Generate OTP
        const otp = String(Math.floor(100000 + Math.random() * 900000));

        // Set OTP and expiry time
        user.verifyOtp = otp;
        user.verifyOtpeExpireAt = Date.now() + 24 * 60 * 60 * 1000;

        // Save the user with updated OTP
        await user.save();

        // Email configuration
        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account verification OTP',
            text: `Your OTP is ${otp}. Verify your account using this OTP.`,
        };

        // Send the email
        await transporter.sendMail(mailOption);

        res.json({ success: true, message: "Verification OTP Sent on Email" });

    } catch (error) {
        // Return error message
        res.json({ success: false, message: error.message });
    }
};


export const verifyEmail = async (req, res)=>{
    const {userId, otp} = req.body;

    if(!userId || !otp){
        return res.json({success:false, message:"Missing Details"});
    }
    try{
        const user = await userModel.findById(userId);
        if(!user){
            return res.json({success:false, message:"User not found"});
        }
        if(user.verifyOtp === '' || user.verifyOtp !== otp){
            return res.json({success:false, message:"invalid OTP"})
        }
        if(user.verifyOtpeExpireAt < Date.now()){
            return res.json({success:false, message:"OTP Expired"})
        }
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = null;

        await user.save();
        return res.json({success:true, message:"Email verified Successfully"})


    }catch(error){
        return res.json({success: false, message:error.message});
    }
}

//check if user is authendicate
export const isAuthendicated = async (req,res)=>{
    try{
        return res.json({success:true})
    }catch(error){
        res.json({success:false, message:error.message});
    }
   
}

//Api end point for send password reset otp

export const sendResetOtp = async (req,res)=>{
    const {email} = req.body;
    if(!email){
        return res.json({success:false, message:"email is required"})

    }
    try{
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success:false, message:"user Not found"});
        }
        const otp = String (Math.floor(100000 + Math.random() * 900000 ));

        user.resetOtp = otp;
        user.resetOtpeExpireAt = Date.now()+ 15*60*1000;
  
        await user.save();
  
        const mailOption = {
              from: process.env.SENDER_EMAIL,
              to: user.email,
              subject: 'Password reset OTP',
              text: `Your OTP for resetting your password is ${otp}. Use this OTP to proceed with resetting your password.`
  
        };

        await transporter.sendMail(mailOption);

        return res.json({success:true, message:"OTP send your Email"});

    }catch(error){
        res.json({success:false, message:error.message});
    }
}

//reset user password 

export const resetPassword = async (req, res)=>{
    const {email, otp, newPassword} = req.body;

    if(!email || !otp || !newPassword){
        return res.json({success:false, message:"Email OTP and NEW password are required"});
    }

    try{
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success:false, message:"user not found"})
        }
        if(user.resetOtp === "" || user.resetOtp !== otp){
            return res.json({success:false, message:"Invalid OTP"})
        }
        if(user.resetOtpeExpireAt < Date.now()){
            return res.josn({success:false, message:"OTP Expired"});

        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = "";
        user.resetOtpeExpireAt=0;
        await user.save();

        return res.json({success:true, message: 'Password has been reset successfully'});

    }catch(error){

    }
}