const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const adminRouter = require('./routes/adminRouter');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

app.enable('trust proxy');
app.use(bodyParser.json()); // Use bodyParser.json() instead of bodyParser()
app.use(express.static(path.join(__dirname,"public")));
app.use(cors());
app.options('*',cors());

let DB = `mongodb+srv://mkj:<password>@cluster0.yye3jcz.mongodb.net/?retryWrites=true&w=majority`;
password = '5LNFncgUIevGrq18';

DB = DB.replace('<password>',password);

mongoose.connect(DB,{}).then(()=>{
    console.log('Connection Successfull');
});

app.use('/api/v1/admin', adminRouter);

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
