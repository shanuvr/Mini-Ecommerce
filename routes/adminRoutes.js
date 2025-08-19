import express from 'express'
import multer from 'multer'
import path from 'path'
import { adminLogin } from '../controllers/admin.js'
import { adminLogout } from '../controllers/admin.js'
import { showUsers } from '../controllers/admin.js'
import { adminShowProducts } from '../controllers/productController.js'
import { addProduct } from '../controllers/productController.js'
import { adminEditProduct } from '../controllers/productController.js'
import { adminShowCategories } from '../controllers/productController.js'
import { addCategory } from '../controllers/categoryController.js'
import { updateCategory } from '../controllers/categoryController.js'
import { deleteCategory } from '../controllers/categoryController.js'
import { showCategories } from '../controllers/categoryController.js'
import { adminDeleteProduct } from '../controllers/productController.js'
import { editCart } from '../controllers/cartController.js'
import {  editOrder,showOrders } from '../controllers/orderController.js'
import { productspercategory } from '../controllers/categoryController.js'

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




adminRoute.post('/login',adminLogin)

adminRoute.use((req,res,next)=>{
    if(req.session.admin){
        next()
    }else{
        res.status(401).json({message:"admin not logged in"})
    }
})

adminRoute.post('/products',productUpload.single("productImage"),addProduct)
adminRoute.put('/product/:id',productUpload.single("productImage"),adminEditProduct)
adminRoute.delete('/products/:id',adminDeleteProduct)
adminRoute.get('/users',showUsers)
adminRoute.get('/products',adminShowProducts)
adminRoute.get('/categories',adminShowCategories)
adminRoute.post('/categories',addCategory)
adminRoute.put('/categories/:id',updateCategory)
adminRoute.delete('/categories/:id',deleteCategory)
adminRoute.get('/categories',showCategories)
adminRoute.post('/logout',adminLogout)
adminRoute.put('/order/:id',editOrder)
adminRoute.get('/orders',showOrders)
adminRoute.get('/productspercategory',productspercategory)
// adminRoute.delete('/order/:id',deleteOrder)

export default adminRoute