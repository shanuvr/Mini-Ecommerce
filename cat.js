import mongoose from "mongoose";
const category = {
    name:"Health & Personal Care",
    description:"This Category contains all the things related to Health & Personal Care"
}

const database = 'mongodb://127.0.0.1:27017/miniEcommerce'
let data = await mongoose.connect(database)
const db = data.connection.db

async function addCat(){
    db.collection('category').insertOne(category)
}
addCat()