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
  if (req.session.admin) {
    try {
      const products = await productModel.find();
      res.json({ products });
    } catch (err) {
      console.log(err);
      res.status(404).json({ message: err });
    }
  } else {
    res.status(401).json({ message: "admin not logged in" });
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
    let product = await productModel.find(
      { _id: productId },
      "productImage productName productPrice productCategogy"
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

export const adminShowCategories = async(req,res)=>{
  
   
}
