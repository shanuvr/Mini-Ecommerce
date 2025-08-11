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
         await orderModel.create({
                userId,
                items,
                total,
                deliveryStatus:"pending",
            })
        await cartModel.deleteOne({userId})
        return res.json({message:"order placed"})
    

     
}

export const editOrder = async (req, res) => {
        const id = req.params.id;
    const { deliveryStatus } = req.body;

    try {
        const data = await orderModel.findByIdAndUpdate(
            id,
            { deliveryStatus },
          
        );

        if (!data) {
            return res.status(404).json({ message: "Order not found" });
        }

        return res.status(200).json({
            message: "Delivery status updated successfully",
            data
        });

    } catch (err) {
        console.error("Error updating order:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

