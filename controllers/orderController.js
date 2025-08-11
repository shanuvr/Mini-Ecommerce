import mongoose from "mongoose";
import cartModel from "../models/cart.js";
import productModel from "../models/products.js";
import orderModel from "../models/orders.js";


export const createOrder = async(req,res)=>{
   console.log(req.session.user);
    const userId = req.session.user.id
    const findCart = await cartModel.findOne({userId})
    if(!findCart){ return res.json({message:"cart is empty"})}
    
        let  total=0;
        let  subtotal=0;
        let  items = [];
        for(let eachItems of findCart.items){
             console.log("Processing cart item:", eachItems);
            const product = await productModel.findById(eachItems.productId)
            if(!product){continue}
            subtotal = product.productPrice * eachItems.quantity
            total+=subtotal
            items.push({
                userId,
                productName:product.productName,
                productPrice:product.productPrice,
                quantity:eachItems.quantity,
                subtotal
            })
        }
        console.log("Final order items array:", items);
         await orderModel.create({
                userId,
                items,
                total,
                deliveryStatus:"pending",
            })
        await cartModel.deleteOne({userId})
        return res.json({message:"order placed"})
    

}

export const editOrder = async(req,res)=>{
   try{
     const id = req.params.id
    const {deliveryStatus} = req.body
    const findOrder = await orderModel.findById(id)
    findOrder.deliveryStatus = deliveryStatus
    await findOrder.save()
    return res.json({message:"delevery status Updated"})
   }catch(err){
    return res.json({err})
   }
}

export const deleteOrder = async(req,res)=>{
    try{
         const id = req.params.id
         const del = await orderModel.findByIdAndDelete(id)
         res.json({message:"order Deleted Successfully"})
         
    }catch(err){
        res.json({err})
    }

}