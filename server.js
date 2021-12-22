const express = require('express');
const app = express();
var cors = require('cors')
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path')
const fs = require('fs');

dotenv.config();

var passport = require('passport');
require('./config/passport')(passport);

const userRouter = require('./routers/userRouter')
const emotionRouter = require('./routers/emotionRouter')
const musicRouter = require('./routers/musicRouter')
const PORT = 5000

app.use(
    express.urlencoded({
      extended: false,
    })
);
app.use(express.json());
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, './public')))
app.use(cors())


mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    console.log("MongoDB connected");
  })
  .catch((err) => console.log(err));

app.use('/user', userRouter);
app.use('/emotion', emotionRouter);
app.use('/music', musicRouter);
app.get('/', (req,res)=>{
    res.send("API Working")
})

app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`)
})