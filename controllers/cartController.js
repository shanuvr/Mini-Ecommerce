import { json } from "stream/consumers";
import cartModel from "../models/cart.js";
import productModel from "../models/products.js";
import mongoose from "mongoose";

export const addTocart = async (req, res) => {
  const { productId, quantity } = req.body;
  const { id } = req.session.user;
  const userId = id;
  const productIdFromReqBody = productId;
  try {
    let cartExist = await cartModel.findOne({ userId });

    if (cartExist) {
      const indexOfExitsProduct = await cartExist.items.findIndex((item) => {
        return item.productId == productIdFromReqBody;
      });
      console.log(indexOfExitsProduct);
      if (indexOfExitsProduct !== -1) {
        cartExist.items[indexOfExitsProduct].quantity += quantity;
      } else {
        const dataToPush = {
          productId,
          quantity,
        };
        cartExist.items.push(dataToPush);
      }
      await cartExist.save();
      return res.json({ messaage: "product added" });
    } else {
      const dataToInsert = {
        userId,
        items: [{ productId, quantity }],
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
 
const facet = await cartModel.aggregate([{
    $facet:{
        total:[
             {
      $match: {
        userId: userId,
      },
    },
    {
      $unwind: "$items",
    },
    {
        $lookup:{
            from:"products",
            localField:"items.productId",
            foreignField:"_id",
            as:"productDetails"
        }
    },
    {
        $unwind:"$productDetails"
    },
    {
        $addFields:{
            subtotal:{
                $multiply:["$productDetails.productPrice","$items.quantity"]
            }
        }
    },{
        $group:{
            _id:"",
               total: { $sum: "$subtotal" }
            
        }
    }
    
        ],
        details:[  {
      $match: {
        userId: userId,
      },
    },
    {
      $unwind: "$items",
    },
    {
        $lookup:{
            from:"products",
            localField:"items.productId",
            foreignField:"_id",
            as:"productDetails"
        }
    },
    {
        $unwind:"$productDetails"
    },
    {
        $addFields:{
            subtotal:{
                $multiply:["$productDetails.productPrice","$items.quantity"]
            }
        }
    },]
    }
}])
  return res.json({ facet });

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



