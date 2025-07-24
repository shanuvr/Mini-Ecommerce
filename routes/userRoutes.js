import multer from 'multer'
import path from 'path'
import { register } from '../controllers/usersController.js'
import { editUser } from '../controllers/usersController.js'
import { loginUser } from '../controllers/usersController.js'
import { logoutUser } from '../controllers/usersController.js'
import { userShowProducts } from '../controllers/productController.js'
import { userShowDetailedProduct } from '../controllers/productController.js'
import { userShowCategory } from '../controllers/categoryController.js'
import { addTocart } from '../controllers/cartController.js'
import { showTotalAmount } from '../controllers/cartController.js'
import { editCart } from '../controllers/cartController.js'
import { deleteCartItem } from '../controllers/cartController.js'

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
userRoute.get('/login',loginUser)
userRoute.post('/register',upload.single("profilePicture"),register)
userRoute.get('/products',userShowProducts)
userRoute.get('/products/:id',userShowDetailedProduct)
userRoute.get('/categories',userShowCategory)
userRoute.use((req,res,next)=>{
    if(req.session.user){
        next()
    }else{
        res.status(401).json({message:"user not logged in"})
    }
})
userRoute.put('/edit/:id',upload.single("profilePicture"),editUser)
userRoute.get('/logout',logoutUser)
userRoute.post('/cart',addTocart)
userRoute.get('/cart',showTotalAmount)
userRoute.put('/cart/:id',editCart)
userRoute.delete('/cart/:id',deleteCartItem)



export default userRoute
