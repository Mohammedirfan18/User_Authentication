import express from "express"
import {
    login,
    registerUser,
    verifyUser,
} from "../controller/user.controller.js"

const userRouter = express.Router();


userRouter.post("/register",registerUser);
userRouter.get("/verify/:token",verifyUser);
userRouter.post("/login", login);

export default userRouter