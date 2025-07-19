import productModel from "../models/products.js";

export const addProduct = async(req,res)=>{
    console.log(req.body);
    if(req.session.admin){
        try{
 
    let proImage = "";
   if(req.file){
    proImage = req.file.filename;
   }
   const {productName,productCategory,productPrice,productStock,productDescription} = req.body;
   const product = new productModel({
    productName:productName,
    productCategory:productCategory,
    productPrice:productPrice,
    productStock:productStock,
    productDescription:productDescription,
    productImage:proImage

   })
   await product.save()
   res.json({message:product})
   }catch(err){
    console.log(err);
    res.json({message:err})
    
   }


    }else{
        res.status(401).json({message:"admin not logged In"})
    }
    
   

}