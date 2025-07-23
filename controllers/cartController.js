import cartModel from "../models/cart.js";
import productModel from "../models/products.js";

export const addTocart = async(req,res)=>{
    const {productId,quantity} = req.body;
    const {id} = req.session.user;
    const userId = id;
    let cartArray = [];
     const isExistingCart = await cartModel.findOne({userId})
     console.log("exisiting cart");
     console.log(isExistingCart);
     if(isExistingCart){
        
     }else{
        try{
    const foundProduct = await productModel.findById(productId)
    const price = foundProduct.productPrice
    console.log(price);
 
    const dataToSet = {
        userId,
        productId,
        quantity,
       
    }
  cartArray.push(dataToSet)
  const addedCart = await cartModel.create(cartArray)
    res.json({message:addedCart})
   }catch(err){
    return res.json({err})
   }

}
     


       
      

}