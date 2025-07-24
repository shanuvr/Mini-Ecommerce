
db.carts.aggregate([
    {
        $match:{
            userId:ObjectId("687b0d0cfa674d6fba68438b")
        },
       

    },
    {
         $unwind:"$items"
    },
    {
        $lookup:{
            from:"products",
            foreignField:"_id",
            localField:"items.productId",
            as:"productDetails"
        }
    },
    {
        $addFields:{
            product:{$arrayElemAt:["$productDetails",0]}
        }
    },
    {
        $addFields:{
            total:{
                $multiply:["$product.productPrice","$items.quantity"]
            }
        }
    }
])