import express from 'express'
import { adminLogin } from '../controllers/admin.js'
import { addProduct } from '../controllers/productController.js'
const adminRoute = express.Router()



adminRoute.get('/login',adminLogin)
adminRoute.post('/products',addProduct)
export default adminRoute