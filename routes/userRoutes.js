import multer from 'multer'
import path from 'path'
import { register } from '../controllers/usersController.js'
import { editUser } from '../controllers/usersController.js'
import { loginUser } from '../controllers/usersController.js'
import express from 'express'
const userRoute = express.Router()

const storage = multer.diskStorage({
    destination:function(req,file,call){
        call(null,"uploads")
    },
    filename:function(req,file,call){
        const name = Date.now()+path.extname(file.originalname)
        call(null,name)
    }
})

const upload = multer({storage:storage})
userRoute.post('/register',upload.single("profilePicture"),register)
userRoute.post('/edit/:id',upload.single("profilePicture"),editUser)
userRoute.get('/login',loginUser)
export default userRoute