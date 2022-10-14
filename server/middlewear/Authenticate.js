const jwt=require("jsonwebtoken");
const User=require("../model/userSchema");

const Authenticate= async(req,resp,next)=>{
  try {
    const token=req.cookies.jwtoken;
    const verifytoken=jwt.verify(token,process.env.SECRET_KEY);
    const rootUser= await User.findOne({_id:verifytoken._id, "tokens.token":token});

    if(!rootUser){throw new Error("User not found")};
    req.token=token;
    req.rootUser=rootUser;
    req.userID=rootUser._id;

    next();

  } catch (error) {
    resp.status(401).send("Unuthorized:No Token Provided");
    console.log(error);
  }

}

 module.exports=Authenticate;