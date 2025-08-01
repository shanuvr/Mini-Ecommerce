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
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
     productPrice:{
        type:Number,
        required:true
    },
     productStock:{
        type:Number,
        required:true
    },
    productDescription:{
        type:String,
        required:true
    },

})

const productModel = mongoose.model('product',produtSchema)
export default productModel