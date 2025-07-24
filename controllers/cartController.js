import cartModel from "../models/cart.js";
import productModel from "../models/products.js";

export const addTocart = async(req,res)=>{
    const {productId,quantity} = req.body;
    const {id} = req.session.user;
    const userId = id;
    const productIdFromReqBody = productId;
    try{
        let cartExist = await cartModel.findOne({userId})
       
        
        if(cartExist){
            
            const indexOfExitsProduct = await cartExist.items.findIndex(
                (item)=>{
                    return item.productId.toString()==productIdFromReqBody
                }
            )
            console.log(indexOfExitsProduct);
            if(indexOfExitsProduct!==-1){
                cartExist.items[indexOfExitsProduct].quantity += quantity;
            }else{
                const dataToPush = {
                    productId,
                    quantity
                }
                cartExist.items.push(dataToPush)
            }
            await cartExist.save()
            return res.json({messaage:"product added"})
            
            

        }else{

            const dataToInsert = {
                userId,
                items:[{productId,quantity}]
            }
            const newData = await cartModel.create(dataToInsert)
            return res.json({newData})

        }
    }catch(err){
        res.json({err})
    }
}