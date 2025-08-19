import categoryModel from "../models/category.js"
import productModel from "../models/products.js";
export const addCategory = async(req,res)=>{
    console.log(req.body);
    try{
        const insertedCategory = await categoryModel.insertOne(req.body)
        res.json({insertedCategory})
    }catch(err){
        res.json({message:err})
    }


}

export const updateCategory = async(req,res)=>{
   try{
     const categoryId = req.params.id
    const {name,description} = req.body
     const oldData = await categoryModel.findById(categoryId)
     const dataToSet = {
        name:oldData.name,
        description:oldData.description
     }
     if(req.body.name){dataToSet.name = req.body.name}
     if(req.body.description){dataToSet.description = req.body.description}

     const updatedCategory = await categoryModel.findByIdAndUpdate(categoryId,dataToSet)
     return res.json({updatedCategory})
   }catch(err){
    res.json({message:err})
   }
     
    
}

export const deleteCategory = async(req,res)=>{
    try{
        const categoryId = req.params.id
    await productModel.deleteMany({productCategory:categoryId})
    await categoryModel.deleteOne({_id:categoryId})
    return res.json({message:"deleted all the category and all the products in that category"})

    }catch(err){
        return res.json({err})
    }
}

export const showCategories = async(req,res)=>{
    try{
        const allCategories = await categoryModel.find()
        return res.json({allCategories})

    }catch(err){
         res.json({err})
        
    }


}
export const userShowCategory = async(req,res)=>{
   try{
     const categories = await categoryModel.find()
     res.json({categories})

   }catch(err){
    res.json({message:err})
   }


}

export const productspercategory = async(req,res)=>{
    try{
            const data = await productModel.aggregate([
                {
                    $group:{
                        _id:"$productCategory",
                        total:{$sum:1}
                    }
                },{
                    $lookup:{
                        from:"categories",
                        localField:"_id",
                        foreignField:"_id",
                        as:"details"
                    }
                },
                {
                    $unwind:"$details"
                },{
                    $project:{
                        name:"$details.name",
                        total:"$total"
                    }
                }
            ])
            res.json({data})
    }catch(err){
        console.log(err);
        
    }

}