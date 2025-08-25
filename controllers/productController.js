import mongoose from "mongoose";
import categoryModel from "../models/category.js";
import productModel from "../models/products.js";

export const addProduct = async (req, res) => {
  console.log(req.body);
  if (req.session.admin) {
    try {
      let proImage = "";
      if (req.file) {
        proImage = req.file.filename;
      }
      const {
        productName,
        productCategory,
        productPrice,
        productStock,
        productDescription,
      } = req.body;
      const product = new productModel({
        productName: productName,
        productCategory: productCategory,
        productPrice: productPrice,
        productStock: productStock,
        productDescription: productDescription,
        productImage: proImage,
      });
      await product.save();
      res.json({ message: product });
    } catch (err) {
      console.log(err);
      res.json({ message: err });
    }
  } else {
    res.status(401).json({ message: "admin not logged In" });
  }
};

export const adminShowProducts = async (req, res) => {
  try{
   const products = await productModel.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'productCategory',
          foreignField: '_id',
          as: 'categoryDetails'
        }
      },
      {
       $unwind:'$categoryDetails'
      },
      {
        $project: {
          productName: 1,
          productCategory:1,
          productPrice: 1,
          productStock: 1,
          productImage: 1,
          productDescription: 1,
          categoryName: '$categoryDetails.name'
        }
      }
    ]);
    console.log(products);
    
    res.json({ products });
  }catch(err){
    return res.json({err})
  }
   
};

export const userShowProducts = async (req, res) => {
  try {
    const products = await productModel.find(
      {},
      "productImage productName productPrice"
    );
    res.json({ products });
  } catch (err) {
    console.log(err);
    res.json({ message: err });
  }
};

export const userShowDetailedProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    let product = await productModel.findById(productId,
      "productImage productName productPrice productCategogy productDescription"
    );
    if (!product) {
      res.status(404).json({ message: "product not found" });
    }
    res.json(product);
  } catch (Err) {
    console.log(Err);
    res.json(Err);
  }
};

export const adminEditProduct = async (req, res) => {
  console.log("edite route worked");
  
  if(req.session.admin){
    try {
    const productId = req.params.id;
    const oldProduct = await productModel.findById(productId);
    if(!oldProduct){return res.json({message:"product not found"})}
    const dataToSet = {
      productName: oldProduct.productName,
      productStock:oldProduct.productStock,
      productCategory:oldProduct.productCategory,
      productDescription:oldProduct.productDescription,
      productImage:oldProduct.productImage,
      productPrice:oldProduct.productPrice
    };
   
    if(req.body.productName){dataToSet.productName=req.body.productName}
    if(req.body.productCategory){dataToSet.productCategory = req.body.productCategory}
    if(req.body.productStock){dataToSet.productStock=req.body.productStock}
    if(req.body.productDescription){dataToSet.productDescription=req.body.productDescription}
    if(req.body.productPrice){dataToSet.productPrice=req.body.productPrice}
    if(req.file){dataToSet.productImage=req.file.filename}
     

    const updateProdct = await productModel.findByIdAndUpdate(productId,dataToSet)
    res.json({updateProdct})

  } catch (err) {
    console.log(err);
    res.json({ message: err });
  }

  }else{
    res.json({message:"admin not logged in"})
  }
};
export const adminDeleteProduct = async(req,res)=>{
 try{
   const productID = req.params.id
   const del = await productModel.findByIdAndDelete(productID)
   return res.json({message:"product deleteed"})

 }catch(err){
  return res.json({err})
  
 }

}
export const adminShowCategories = async(req,res)=>{
  try{
    const categories = await categoryModel.find()
    if(categories){
      return res.json({categories})
    }else{
      return res.json({message:"category is empty"})
    }

  }catch(err){
    return res.json({err})
  }
   
}

export const search = async(req,res)=>{
try {
        const regex = new RegExp(req.params.query, "i"); 
        console.log(regex);
        
        const products = await productModel.find({ productName: regex });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: "Search failed" });
    }
}

export const filter = async(req,res)=>{
  try{
    console.log("in filter");
    const catId = req.params.id;
    const cat = new mongoose.Types.ObjectId(catId);
    console.log(cat);
    
    
    const filterd = await productModel.find({productCategory:cat})
    res.json({filterd})

  }catch(err){
    console.log(err);
    
  }
}