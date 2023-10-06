const express = require("express");
const db = require("../../utils/database")
const cTime = require("../../utils/current_time")
const cDay = require("../../utils/current_day")
const router = express.Router();


 const breakDetails = router.get("/break_details",async (req,res,next)=>{
    let request = db.request();
    const result = await request.query("select * from break_details");
    res.send({msg:"fetch user successfully", data:result.recordsets});
    // res.send("hello world")
})


const breakIn = router.post("/breakIn", async (req,res,next)=>{
  const {name} = req.body;
  let request = db.request();
  const date = new Date();
  function addZero(i) {
    if (i < 10) {i = "0" + i}
    return i;
  }
  const cMonth = date.getMonth() + 1;
  const cTime = + String(addZero(date.getHours())) + ":" + String(addZero(date.getMinutes())) + ':' + String(addZero(date.getMinutes())) +'.' + String(addZero(date.getMilliseconds())) ;
  const cDay= String(addZero(date.getFullYear())) + "-" + String(addZero(cMonth)) + "-" + String(addZero(date.getDate()));



    const result2 = await request.query("SELECT isnull(max(break_id),0) + 1 'break_id' FROM break_details WHERE e_id = '"+ name +"' ");
    const newI =result2.recordsets[0][0].break_id;


    
    await request.query(`UPDATE login_details SET breaks_status='YES' WHERE date='${cDay}' AND e_id='${name}'`)
    const result = `INSERT INTO break_details (e_id,date,break_in,break_id) VALUES ('${name}','${cDay}','${cTime}',${newI})`;
  
    await db.query(result,(err,result)=>{ 
      if (err) {
        console.log(err);
      }
      res.send(result);
    })
  })
  
  
  const breakOut = router.put("/breakOut",async (req,res,next)=>{
const {name} = req.body;
  let request = db.request();
  const date = new Date();
  function addZero(i) {
    if (i < 10) {i = "0" + i}
    return i;
  }
  const cMonth = date.getMonth() + 1;
  const cTime = + String(addZero(date.getHours())) + ":" + String(addZero(date.getMinutes())) + ':' + String(addZero(date.getMinutes())) +'.' + String(addZero(date.getMilliseconds())) ;
  const cDay= String(addZero(date.getFullYear())) + "-" + String(addZero(cMonth)) + "-" + String(addZero(date.getDate()));

  // for uniq break id start
    const result2 = await request.query("SELECT isnull(max(break_id),0) 'break_id' FROM break_details WHERE e_id = '"+ name +"' ");
    const newI = result2.recordsets[0][0].break_id;
    // for uniq break id end



    const breakInTime = await request.query(`SELECT break_in FROM break_details WHERE e_id='${name}' AND date='${cDay}' AND break_id=${newI}`)
  const bT = breakInTime.recordsets[0][0].break_in;
  const bTime =  new Date(bT).getUTCHours() + ":" + new Date(bT).getUTCMinutes() + ":" + new Date(bT).getUTCSeconds() + "." + new Date(bT).getUTCMilliseconds();
  const bdt = await request.query(`SELECT DATEDIFF(minute, '${cDay} ${bTime}', '${cDay} ${cTime}') AS DateDiff;`)
  const breakTime = bdt.recordset[0].DateDiff;
  const result = `UPDATE break_details SET break_out='${cTime}',t_break_time='${breakTime}'  WHERE e_id='${name}' AND break_id=${newI}`;
  
  
  
  

  
  
  await request.query(`UPDATE login_details SET breaks_status='NO' WHERE date='${cDay}' AND e_id='${name}'`)
    await db.query(result,(err,result)=>{ 
      if (err) {
        console.log(err);
      }
      console.log(result);
      res.send(result);
    })
  })

  const lastBreak = router.post("/lastBreak", async (req,res,next)=>{
    const {name,time} = req.body;
    let request = db.request();
    // console.log(time);

  
  
      const result2 = await request.query("SELECT isnull(max(break_id),0) 'break_id' FROM break_details WHERE e_id = '"+ name +"' ");
      const newI =result2.recordsets[0][0].break_id;

     

      const result = `select * from break_details where e_id='${name}' AND break_id=${newI}`;

      // await request.query(`UPDATE break_details SET break_out=${time} WHERE break_id='${newI}' AND e_id='${name}'`);
  
    
      await db.query(result,(err,result)=>{ 
        if (err) {
          console.log(err);
        }
        res.send(result.recordset[0]);
      })
    })


module.exports = breakDetails

module.exports = breakIn

module.exports = breakOut

module.exports = lastBreak
