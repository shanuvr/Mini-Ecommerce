import userModel from "../models/users.js";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  let pro = "";
  if (req.file) {
    pro = req.file.filename;
  }
  const { name, email, password } = req.body;
  const hashedPass = await bcrypt.hash(password, 10);
  const user = new userModel({
    name: name,
    email: email,
    password: hashedPass,
    profilePicture: pro,
  });
  await user.save();

  res.json({ message: "User registered successfully",success:true });
};

export const editUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const oldUser = await userModel.findById(userId);
    if (!oldUser) {
      return res.status(404).json({ message: "user Not found" });
    }
    const dataToBeUpdated = {
      name: oldUser.name,
      email: oldUser.email,
      password: oldUser.password,
      profilePicture: oldUser.profilePicture,
    };

    if (req.body.name) {
      dataToBeUpdated.name = req.body.name;
    }
    if (req.body.email) {
      dataToBeUpdated.email = req.body.email;
    }
    if (req.body.password) {
      const hashForUpdate = await bcrypt.hash(req.body.password, 10);
      dataToBeUpdated.password = hashForUpdate;
    }
    if (req.file) {
      dataToBeUpdated.profilePicture = req.file.filename;
    }
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      dataToBeUpdated
    );
    res.json({ message: "user updated", updatedUser });
  } catch (err) {
    res.status(500).json({ message: "somthng wrong" });
  }
};
 export const loginUser = async(req,res)=>{

    const {email,password} = req.body

    console.log(req.body);
    
    const userFound  = await userModel.findOne({email:email})

    console.log(userFound);

    if(!userFound){return res.status(404).json({message:'No such user'})}

    const isPasswordMatched = await bcrypt.compare(password,userFound.password)

    if(!isPasswordMatched){return res.status(401).json({message:"incorrect password"})}

    if(isPasswordMatched){
        req.session.user = {
            id:userFound._id,
            name:userFound.name,
            email:userFound.email,
        }
        res.status(200).json({message:'login successfull',success:true})
    }

 }

 export const logoutUser = (req,res)=>{
  req.session.user=null;
  if(req.session.user==null){
    return res.json({message:"user logged out "})
  }else{
    return res.json({message:"failed to logout"})
  }
 }

 export const sessioncheck = (req,res) =>{
  if(req.session.user){
    return res.json({loggedin:true,user:req.session.user})
  }else{
    return res.json({loggedin:false,user:null})
  }
 }
 