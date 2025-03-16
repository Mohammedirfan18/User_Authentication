import User from "../model/User.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const registerUser = async (req, res) => {
  //get data
  //validate data
  //check if user already exist
  //create a verification token
  //save token in db
  //send token as email to user
  //send success status to user

  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }
   
    const user = await User.create({
      name,
      email,
      password,
    });
    
    
    if (!user) {
      return res.status(400).json({
        message: "User not registered",
      });
    }
    
    const token = crypto.randomBytes(32).toString("hex");
    
    
    
    user.verificationToken = token;

    await user.save();

    //send mail

    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    const mailOption = {
      from: process.env.MAILTRAP_SENDEREMAIL, // sender address
      to: user.email, // list of receivers
      subject: "Verify your email", // Subject line
      text: `Please click on the following link:
    ${process.env.BASE_URL}/users/verify/${token}`, // plain text body
      // html: "<b>Hello world?</b>", // html body
    };

    // send mail with defined transport object
    await transporter.sendMail(mailOption);
    res.status(201).json({
      message: "User registered successfully",
      success: true,
    });
  } catch (err) {
    console.log(err)
    res.status(400).json({
      message: "User is not registered ",
      err,
      success: false,
    });
  }
};

const verifyUser = async (req,res) => {
    //get token from url
    //validate
    //find user based on token
    //if not return invalid token
    //else set isverified field to true
    //remove verification token
    //save 
    //return response
    const {token} = req.params;
    console.log(token)
    if(!token)
    {
        return res.status(400).json({
            message:"Invalid token",
        });
    }

    const user = await User.findOne({verificationToken: token})
    
    if(!user)
    {
        return res.status(400).json({
            message:"Invalid token",
        });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    console.log(user)
    await user.save();
    return res.status(200).json({
      message:"verified successfully",
  });
}

const login = async (req,res) => {
    //get data
    //validate
    //check in db 
    //check password 
    //generate jwt 
    //send jwt to user
    //for every req get jwt from user
    const { email,password} = req.body;

    if (!email || !password) {
        return res.status(400).json({
          message: "All fields are required",
        });
      }

      try {
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({
            message: "Invalid email or password",
          });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
              message: "Invalid email or password",
            });
          }

          const token = jwt.sign(
            { id: user._id, role: user.role },
      
            process.env.KEY,
            {
              expiresIn: "24h",
            }
          ); 
          const cookieOptions = {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
          };
          res.cookie("token", token, cookieOptions);
          res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
              id: user._id,
              name: user.name,
              role: user.role,
            },
          });
        }catch (err)
        {
            res.status(400).json({
                success: false,
                message:"Username or Pasword is incorrect",
                err,
            })
        }
}
export {registerUser,verifyUser,login}
