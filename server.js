const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv')
dotenv.config();

const PORT = 5000

mongoose.connect(process.env.MONGO_URI,{ unifiedTopology: true, useNewUrlParser: true}, ()=>{
    console.log('MongoDB connected!')
})

app.get('/', (req,res)=>{
    res.send("Hi there")
})

app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`)
})