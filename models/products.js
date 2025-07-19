import mongoose from "mongoose";
const produtSchema = new mongoose.Schema({
    productImage:{
        type:String,
        required:true
    },
     productName:{
        type:String,
        required:true
    },
     productCategory:{
        type:String,
        required:true
    },
     productPrice:{
        type:String,
        required:true
    },

})

const productModel = mongoose.model('product',produtSchema)
export default productModel