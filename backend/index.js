import express from "express"
import dotenv from "dotenv" //to read variables from .env
import cors from "cors"
import connectDb from "./utils/db.js"
import userRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";

const app = express()

// console.log(app)
dotenv.config() //give path of .env if not in src folder
//Reads the .env file and loads environment variables into process.env.
connectDb();

app.use(cors({
    origin:"*",
    methods:['GET','POST','PUT','DELETE'],
    allowedHeaders:['content-type','Authorization'],
    credentials:true
}))

app.use(express.json())//to parse json data
app.use(express.urlencoded({
    extended:true
}))
app.use(cookieParser());
/*
when extended true: it supports nested objects
Incoming form data:  
name=Irfan&address[city]=Hyderabad&address[state]=Telangana
parse into : {
  "name": "Irfan",
  "address": {
    "city": "Hyderabad",
    "state": "Telangana"
  }
}
when extended false: it doesnot supports nested objects only supports simple key value pair
 name=Irfan&address[city]=Hyderabad
{
  "name": "Irfan",
  "address[city]": "Hyderabad"
}

*/

app.use("/users",userRouter);

app.listen(Number(process.env.PORT),()=>{
    console.log(`listening at port ${Number(process.env.PORT)}`)
})