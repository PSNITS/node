const express = require("express");
const db = require("../../utils/database")

const router = express.Router();


router.get("/user",async (req,res,next)=>{
    let request = db.request();
    const result = await request.query("select * from user_info");
    res.send({msg:"fetch user successfully", data:result.recordsets});
    // res.send("hello world")
})


module.exports = router
