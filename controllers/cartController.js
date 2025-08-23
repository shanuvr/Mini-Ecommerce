import { json } from "stream/consumers";
import cartModel from "../models/cart.js";
import productModel from "../models/products.js";
import mongoose from "mongoose";

export const addTocart = async (req, res) => {
  console.log("reached add to cart");
  

    console.log("Params productId:", req.params.id);
  console.log("Body quantity:", req.body.quantity);
  console.log("Session user:", req.session.user);

  const productId = req.params.id
  let {quantity } = req.body;
  let temp = quantity;
  quantity = Number(temp)
  const { id } = req.session.user;
  const userId = id;
  const productIdFromReqBody = productId;
  try {
    let cartExist = await cartModel.findOne({ userId });
    

    if (cartExist) {
      const indexOfExitsProduct =  cartExist.items.findIndex((item) => {
        return item.productId.toString() == productIdFromReqBody;
      });
      console.log(indexOfExitsProduct);
      if (indexOfExitsProduct !== -1) {
        cartExist.items[indexOfExitsProduct].quantity += quantity;
      } else {
        const dataToPush = {
            productId: new mongoose.Types.ObjectId(productId),
          quantity,
        };
        cartExist.items.push(dataToPush);
      }
      await cartExist.save();
      return res.json({ messaage: "product added" });
    } else {
      const dataToInsert = {
        userId,
        items: [{ productId: new mongoose.Types.ObjectId(productId), quantity }],
      };
      const newData = await cartModel.create(dataToInsert);
      return res.json({ newData });
    }
  } catch (err) {
    res.json({ err });
  }
   
};

export const showTotalAmount = async (req, res) => {
  try{
    const { id } = req.session.user;
   
    
  const userId = new mongoose.Types.ObjectId(id);
  console.log(userId);
 
const cart = await cartModel.aggregate([
   {
        $match:{
            userId:userId
        }
    },
    {
        $unwind:"$items"
    },
    {
        $lookup:{
            from:"products",
            localField:"items.productId",
            foreignField:"_id",
            as:"Details"
        }
    },
   {
        $unwind:"$Details"
    },

     {
        $addFields:{
            subtotal:{
                $multiply:["$items.quantity","$Details.productPrice"]
            }
        }
     },
     {
       $group: {
      _id: "$userId",
      cartitems: {
        $push: {
          productId: "$items.productId",
          quantity: "$items.quantity",
          name: "$Details.productName",
          image: "$Details.productImage", 
          price: "$Details.productPrice",
          subtotal: "$subtotal"
        }
      },
      total: { $sum: "$subtotal" }
    }
     }
])
console.log(cart[0]);

  return res.json({ cart });

  }catch(err){
    return res.json({err})
  }
};


export const editCart = async(req,res)=>{
    const {id} = req.session.user
    const userId = id;
    const {quantity} = req.body
    const quantityFromBody = quantity
    const productId = req.params.id
    try{
            const existCart = await cartModel.findOne({userId})
            if(existCart){
                const findIndex = existCart.items.findIndex((it)=>{
                    return it.productId==productId
                })
                if(findIndex!==-1){
                   console.log(quantityFromBody);
                        existCart.items[findIndex].quantity = quantityFromBody;
                        await existCart.save()
                        return res.json({message:"product quandity updated"})
                }   
            }else{
                res.json({message:"id with that product soes not exist so how can you edit it "})
            }       
    }catch(err){
        return res.json({err})
    }

}

export const deleteCartItem = async(req,res) =>{
    
    try{
        const {id} = req.session.user
        const userId = id
        const productId = req.params.id
      
        const isCart = await cartModel.findOne({userId})
        
        const findIndex = isCart.items.findIndex((item) =>
      item.productId == productId
    );

    if (findIndex === -1) {
      return res.json({ message: "Product not found in cart" });
    }
        if(isCart){
            const findIndex = isCart.items.findIndex((it)=>{
                return it.productId==productId
            })

            const del = isCart.items.splice(findIndex,1)
            await isCart.save()
            return res.json({messaage:"deleted",deleted:del})
            

        }else{
            return res.json({message:"no cart found for this person"})
        }
    }catch(err){
        return res.json({err})
    }
}



