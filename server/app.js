const express = require("express");
const app = express();
// const mongoose = require("mongoose");
const dotevn=require("dotenv")
dotevn.config();
const PORT=process.env.PORT;
const connection=require("./db/connection")
const cookieParser=require("cookie-parser")
app.use(cookieParser())
// const User=require("./model/userSchema");
app.use(express.json());


app.use(require("./router/auth"));
// const middleware = (req, resp, next) => {
//   console.log(`my middlewere `);
//   next();
// };
// middleware();


// app.get("/", (req, resp) => {
//   resp.send("hello this is homepa ge");
// });
// app.get("/about", middleware, (req, resp) => {
//   resp.send("hello this is aboutpage");
// });
// app.get("/contect", (req, resp) => {
//   // resp.cookie("jwtoken","thapa")
//   resp.send("hello this is contectpage");
// });
app.get("/signin", (req, resp) => {
  resp.send("hello this is signin");
});
app.get("/signup", (req, resp) => {
  resp.send("hello this is signup");
});
app.listen(PORT, () => {
  console.log(`server is runnig in ${PORT} port`);
});
