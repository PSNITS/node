const express = require("express");
const db = require("../../utils/database")

const router = express.Router();


  const loginDetailsAll = router.post("/login_details_all",async (req,res,next)=>{
    const name = req.body;
    
    let request = db.request();
    const result = await request.query(`select * from login_details WHERE e_id='${name.name}'`);
    res.send(result.recordsets[0]);

    // res.send("hello world")
})

const loginDetailsUser = router.get("/login_details_user/:id",async (req,res,next)=>{
  const {id} = req.params;
  let request = db.request();

  const date = new Date();
  function addZero(i) {
    if (i < 10) {i = "0" + i}
    return i;
  }
  const cMonth = date.getMonth() + 1;
  const cTime = + String(addZero(date.getHours())) + ":" + String(addZero(date.getMinutes())) + ':' + String(addZero(date.getMinutes())) +'.' + String(addZero(date.getMilliseconds())) ;
  const cDay= String(addZero(date.getFullYear())) + "-" + String(addZero(cMonth)) + "-" + String(addZero(date.getDate()));

  const result = await request.query(`select * from login_details WHERE e_id='${id}' AND date='${cDay}' `);
  // const result = await request.query(`SELECT * FROM login_details WHERE e_id='${id}' ORDER BY punchIn DESC`);
  res.send(result.recordsets[0][0]);
  // res.send("hello world")
})

const punchIn = router.post("/punchIn", async (req,res,next)=>{
  const {name,system} = req.body;
  let request = db.request();
  const date = new Date();
  function addZero(i) {
    if (i < 10) {i = "0" + i}
    return i;
  }
  const cMonth = date.getMonth() + 1;
  const cTime = + String(addZero(date.getHours())) + ":" + String(addZero(date.getMinutes())) + ':' + String(addZero(date.getMinutes())) +'.' + String(addZero(date.getMilliseconds())) ;
  const cDay= String(addZero(date.getFullYear())) + "-" + String(addZero(cMonth)) + "-" + String(addZero(date.getDate()));

  await request.query(`INSERT INTO presence_master (e_id,date,login_system) VALUES ('${name}','${cDay}','${system}')`)

  const result = `INSERT INTO login_details (e_id,date,punchin,breaks_status,login_status) VALUES ('${name}','${cDay}','${cTime}','NO','ACTIVE')`;


  await db.query(result,(err,result)=>{ 
    if (err) {
      console.log(err);
    }
    console.log(result);
    res.send(result);
  })
})

const punchOut = router.put("/punchOut",async (req,res,next)=>{
  const {name,system} = req.body;
  let request = db.request();
  const date = new Date();
  function addZero(i) {
    if (i < 10) {i = "0" + i}
    return i;
  }
  const cMonth = date.getMonth() + 1;
  const cTime = + String(addZero(date.getHours())) + ":" + String(addZero(date.getMinutes())) + ':' + String(addZero(date.getMinutes())) +'.' + String(addZero(date.getMilliseconds())) ;
  const cDay= String(addZero(date.getFullYear())) + "-" + String(addZero(cMonth)) + "-" + String(addZero(date.getDate()));
  


  
  
  
  
  const punchInTime = await request.query(`SELECT punchin FROM login_details WHERE e_id='${name}' AND date='${cDay}'`)
  const pT = punchInTime.recordsets[0][0].punchin;
  const punchTime =  new Date(pT).getUTCHours() + ":" + new Date(pT).getUTCMinutes() + ":" + new Date(pT).getUTCSeconds() + "." + new Date(pT).getUTCMilliseconds();
  const dt = await request.query(`SELECT DATEDIFF(minute, '${cDay} ${punchTime}', '${cDay} ${cTime}') AS DateDiff;`)


  const num =dt.recordset[0].DateDiff;
const hours = (num / 60);
const rhours = Math.floor(hours);
const minutes = (hours - rhours) * 60;
const rminutes = Math.round(minutes);

const totatBreakTime = await request.query(`SELECT SUM(t_break_time) AS sum FROM break_details WHERE e_id='${name}' AND date='${cDay}'`);
const tBreak = totatBreakTime.recordset[0].sum;

const num1 =tBreak;
const hours1 = (num1 / 60);
const rhours1 = Math.floor(hours1);
const minutes1 = (hours1 - rhours1) * 60;
const rminutes1 = Math.round(minutes1);
const second1 = (minutes1 - rminutes1) * 60;
const rsecond1 = Math.round(second1);



const result = `UPDATE login_details SET login_status = 'DEACTIVE',total_break_time='${rhours1 + ":"+rminutes1 +":"+ rsecond1 + "." + "000" }', total_login_time='${rhours + ":"+rminutes }', puchout='${cTime}'  WHERE e_id='${name}' AND date='${cDay}'`;

if (rhours > 9) {
  await request.query(`UPDATE presence_master SET status='ACTIVE', remarks='OVERTIME',logout_system='${system}'`)
}else if (rhours < 8 && rminutes < 30 ) {
  await request.query(`UPDATE presence_master SET status='ACTIVE', remarks='EARLY LOGOUT',logout_system='${system}'`)
}else{
  await request.query(`UPDATE presence_master SET status='ACTIVE', remarks='ON TIME',logout_system='${system}'`)
}


  await db.query(result,(err,result)=>{ 
    if (err) {
      console.log(err);
    }
    console.log(result);
    res.send(result);
  })
})


module.exports = loginDetailsAll

module.exports = loginDetailsUser

module.exports = punchIn

module.exports = punchOut
