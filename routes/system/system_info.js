const express = require("express");
const router = express.Router()
const db = require("../../utils/database");


const systemDetPost = router.post("/system", async (req,res,next)=>{
    const {name,systemId} = req.body

    console.log(name,systemId)

    // let request = db.request();

    // await request.query(`UPDATE login_details SET system_details=${systemId} WHERE e_id='${name}'`)
})





module.exports = systemDetPost;