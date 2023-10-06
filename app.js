require("dotenv").config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');


// const userInfo = require("./routes/user_info/user_info");

// const loginDetailsAll = require("./routes/login_details/login_details");
// const loginDetailsUser = require("./routes/login_details/login_details");
// const punchIn = require("./routes/login_details/login_details");
// const punchOut = require('./routes/login_details/login_details');

// const breakDetails = require("./routes/break_details/break_details");
// const breakIn = require("./routes/break_details/break_details");
// const breakOut = require("./routes/break_details/break_details");

// const empMaster = require("./routes/emp_master/emp_master");
// const presenceMaster = require("./routes/presence_master/presense_master");
// const lastBreak = require('./routes/break_details/break_details');
// const systemDetPost = require('./routes/system/system_info');

const app = express();
app.use(cors())
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

const PORT = process.env.PORT || 5000;

// app.use("/get", userInfo);
// app.use("/get", breakDetails);
// app.use("/get", empMaster);
// app.use("/get", loginDetailsAll);
// app.use("/get", loginDetailsUser);
// app.use("/get", presenceMaster);




// app.use("/post",punchIn)
// app.use("/post",breakIn)
// app.use("/post",lastBreak)
// app.use("/post",systemDetPost)



// app.use("/put",punchOut)
// app.use("/put",breakOut)


app.use("/",(req,res,next)=>{
    res.send("<h1>successful running</h1>")
})



app.listen(PORT);