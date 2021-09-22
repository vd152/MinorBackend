const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken');
dotenv.config();

const userRouter = require('./routers/userRouter')
const PORT = 5000

app.use(
    express.urlencoded({
      extended: false,
    })
);
app.use(express.json());
app.use('/user', userRouter);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("MongoDB connected");
  })
  .catch((err) => console.log(err));

app.get('/', (req,res)=>{
    res.send("Hi there")
})

app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`)
})