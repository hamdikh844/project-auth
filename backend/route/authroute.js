const router=require("express").Router();
const  {RegisterUser, LoginUser}=require("../controller/authController")

// /api/auth/register
router.post("/register",RegisterUser);
router.post("/login",LoginUser);








module.exports=router;
