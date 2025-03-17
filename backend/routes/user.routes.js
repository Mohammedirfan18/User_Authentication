import express from "express"
import {
    login,
    registerUser,
    verifyUser,
    logout,
    forgotPassword,
    resetPassword,
    profile,
} from "../controller/user.controller.js"
import isLoggedIn from "../middleware/auth.middleware.js";

const userRouter = express.Router();


userRouter.post("/register",registerUser);
userRouter.get("/verify/:token",verifyUser);
userRouter.post("/login", login);
userRouter.get("/logout",logout);
userRouter.post("/forgot",forgotPassword)
userRouter.post("/reset/:token",resetPassword)
userRouter.get("/profile",isLoggedIn,profile)

export default userRouter