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
  const { id } = req.session.user;
  const userId = new mongoose.Types.ObjectId(id);
  // const userCart =  await cartModel.find({userId})
  //    return res.json({userCart})

//   const userCart = await cartModel.aggregate([
//     {
//       $match: {
//         userId: userId,
//       },
//     },
//     {
//       $unwind: "$items",
//     },
//     {
//         $lookup:{
//             from:"products",
//             localField:"items.productId",
//             foreignField:"_id",
//             as:"productDetails"
//         }
//     },
//     {
//         $unwind:"$productDetails"
//     },
//     {
//         $addFields:{
//             subtotal:{
//                 $multiply:["$productDetails.productPrice","$items.quantity"]
//             }
//         }
//     },
    
//   ]);


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
};




