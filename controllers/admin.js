import mongoose from "mongoose"
import bcrypt from "bcrypt"

export const adminLogin = async(req,res)=>{
    console.log(req.body);
    
    const {email,password} = req.body
    
    const dataBaseUrl = 'mongodb://127.0.0.1:27017/miniEcommerce'
    let data = await mongoose.connect(dataBaseUrl)
    let db = data.connection.db
    let adminFound = await db.collection("admin").findOne({email})
   if(!adminFound){return res.status(401).json({message:"incorrect Email Adress"})}
    
    const ismatched = bcrypt.compare(password,adminFound.password)
    if(!ismatched){return res.status(401).json({message:"incorrect password"})}

    if(ismatched){
        req.session.admin = {
            email:adminFound.email
        }
    }
    res.json({message:req.session.admin})
     
}

export const adminLogout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Failed to destroy session", })
        }
        return res.json({ message: "Session destroyed successfully" })
    })
}