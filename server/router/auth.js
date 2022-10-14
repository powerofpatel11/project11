const express = require("express");
const User = require("../model/userSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Authenticate = require("../middlewear/Authenticate");
router.get("/", (req, resp) => {
  resp.send("hello");
});

router.post("/register", async (req, resp) => {
  // console.log(req.body);
  // resp.json({message:req.body});
  // console.log("register part");

  // promise method

  //     const {name,email,phone,work,password,cpassword}=req.body
  //   if(!name||!email||!phone||!work||!password||!cpassword){
  //     return resp.status(422).json({error:"please filled the field properly"})
  //   }

  //   User.findOne({email:email}).then((userExist)=>{
  //     if(userExist){
  //         return resp.status(422).json({message:"user already Existed"})
  //     }
  //     const user=new User({name,email,phone,work,password,cpassword})
  //     user.save().then(()=>{
  //         resp.status(201).json({message:"user register is successfully"})
  //     }).catch(()=>{
  //         resp.status(500).json({message : "registered failed"})
  //     })
  //   }).catch((err)=>{
  //     console.log(err);
  //   })

  //  })

  //  async await method
  const { name, email, phone, work, password, cpassword } = req.body;
  if (!name || !email || !phone || !work || !password || !cpassword) {
    return resp.status(422).json({ error: "please filled the field properly" });
  }

  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return resp.status(422).json({ message: "user already Existed" });
    }
    const user = await new User({
      name,
      email,
      phone,
      work,
      password,
      cpassword,
    });
    // const salt=await bcrypt.genSalt(10);
    // const seccpassword = await bcrypt.hash(req.body.cpassword, 10);
    await user.save();

    resp.status(201).json({ message: "user register is successfully" });
  } catch (error) {
    console.log(error);
  }
});

// login Router

router.post("/signin", async (req, resp) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return resp.status(400).json({ message: "please filed the data" });
    }
    const userLogin = await User.findOne({ email: email });
    // console.log(userLogin);

    if (userLogin) {
      const ismatch = await bcrypt.compare(password, userLogin.password);
      const token = await userLogin.generateAuthToken();
      //  console.log(token);
      resp.cookie("jwtoken", token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
      });

      if (!ismatch) {
        resp.status(400).json({ error: "invalid credientals" });
      } else {
        resp.status(200).json({ message: "user signin successfully" });
      }
    } else {
      resp.status(400).json({ error: "invalid credientals" });
    }
  } catch (error) {
    console.log(error);
  }
});

// about js ka page
router.get("/About", Authenticate, (req, resp) => {
  // resp.send("hello this is aboutpage");

  resp.send(req.rootUser);
});
// get user data for contect us and home page
router.get("/getdata", Authenticate, (req, resp) => {
  resp.send(req.rootUser);
});

// contect ka page
router.post("/Contect", Authenticate, async (req, resp) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message) {
      console.log("error in contect form");
      return resp.json({ error: "please filled the contect form" });
    }
    const usercontect = await User.findOne({ _id: req.userID });

    const usermessage = await  usercontect.addMessage(
      name,
      email,
      phone,
      message
    );
    await usercontect.save();
    resp.status(201).json({message:"user contect successfully"})
  } catch (error) {
    console.log(error);
  }
});

// logout js ka page
router.get("/logout", (req, resp) => {
  // resp.send("hello this is aboutpage");
  
  resp.clearCookie("jwtoken",{path:"/"});
  resp.status(200).send("User Logout")

  resp.send(req.rootUser);
});
// password hashing
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzQzYWM4NzA0YjU0NGE1YTI0NjBhZDciLCJpYXQiOjE2NjUzNzk0OTF9.Tvi16Ecjy-TIYFSnwiOZNTD2QCiGBdOzXY2Zh524-zc
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzQzYWU1YjU3Y2Y1MzllY2JmZGE1YzEiLCJpYXQiOjE2NjUzODAwMDB9.Xy_rGAxHiEcY0xTJejOLG8vkz4CJaXHOh-pTCitjRf8
module.exports = router;
