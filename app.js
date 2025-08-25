import mongoose from "mongoose";
import cors from "cors"
import express, { json } from 'express'
import MongoStore from "connect-mongo";
import dotenv from 'dotenv'
import session from "express-session";
import userRoute  from "./routes/userRoutes.js";
import adminRoute from "./routes/adminRoutes.js";
dotenv.config()
const app = express()
app.use(express.urlencoded({extended:true}))
app.use(express.static("uploads"))
app.use(express.static("productImages"))
 app.use(express.json())
 app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
 }))
  app.use(session({
    secret:"1243",
    resave:false,
    saveUninitialized:false,
    store:MongoStore.create({
        mongoUrl:process.env.dbURL,
        collectionName:"session"
    })
 }))

 app.use("/admin",adminRoute)
 app.use("/",userRoute)
 


mongoose.connect(process.env.dbURL).then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log('data base connected');
        
    })
})
