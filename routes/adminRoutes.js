import express from 'express'
import multer from 'multer'
import path from 'path'
import { adminLogin } from '../controllers/admin.js'
import { adminLogout } from '../controllers/admin.js'
import { showUsers } from '../controllers/admin.js'
import { showProducts } from '../controllers/productController.js'
import { addProduct } from '../controllers/productController.js'
const adminRoute = express.Router()
 const storage = multer.diskStorage({
        destination:function(req,file,cb){
            cb(null,"productImages")
        },
        filename:function(req,file,cb){
            const name = Date.now()+path.extname(file.originalname)
            cb(null,name)
        }

    })

const productUpload = multer({storage:storage})


adminRoute.get('/login',adminLogin)
adminRoute.post('/products',productUpload.single("productImage"),addProduct)
adminRoute.get('/logout',adminLogout)
adminRoute.get('/users',showUsers)
adminRoute.get('/products',showProducts)
export default adminRoute