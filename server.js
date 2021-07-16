const express = require('express');
// import mongoose from 'mongoose';
// import path from 'path';
const  cors = require('cors');
// import bodyParser from 'body-parser';
// import morgan from 'morgan';

const app = express();
app.use(cors())
app.get('/',(req,res)=>{
    res.send("app is running well")
})







const PORT = process.env.PORT || 8900

app.listen(PORT, () => console.log(`Server started on PORT ${PORT}`));