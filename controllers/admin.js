import mongoose from "mongoose";
import bcrypt from "bcrypt";
import userModel from "../models/users.js";

export const adminLogin = async (req, res) => {
  console.log(req.body);

  const { email, password } = req.body;

  const dataBaseUrl = "mongodb://127.0.0.1:27017/miniEcommerce";
  let data = await mongoose.connect(dataBaseUrl);
  let db = data.connection.db;
  let adminFound = await db.collection("admin").findOne({ email });
  if (!adminFound) {
    return res.status(401).json({ message: "incorrect Email Adress" });
  }

  const ismatched = bcrypt.compare(password, adminFound.password);
  if (!ismatched) {
    return res.status(401).json({ message: "incorrect password" });
  }

  if (ismatched) {
    req.session.admin = {
      Id: adminFound._id,
      email: adminFound.email,
    };
  }
  res.json({ message: req.session.admin });
};

export const adminLogout = (req, res) => {
  req.session.admin = null;
  if (req.sessio.admin!==null) {
    return res.status(500).json({ message: "failed to logout" });
  }
  return res.json({ message: "Session destroyed " });
};


export const showUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.json(users);
  } catch (Err) {
    console.log(Err);
    res.json({ message: "somthing wrong" });
  }
};
