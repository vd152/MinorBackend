const User = require('../models/userModel')

exports.createUser = (req,res) =>{
    res.send("hello user")
}

exports.registerUser = async(req, res) => {
    const {name, email, password, dob} = req.body;

    if(!name || !email || !password || !dob){
        return res.status(422).json({
            success: false,
            message: "Please fill all the required fields."
        })
    }
    let userExists;
    try{
        userExists = await User.findOne({email})
    }catch(err){
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        })
    }

    if(userExists){
        return res.status(400).json({
            success: false,
            message: "User already exists"
        })
    }

    const user = new User({
        name, email, password, dob
    })

    user
    .save()
    .then(user=>{
        return res.status(200).json({
            success: true, 
            data: user
        })
    })
    .catch(err=>{
        console.log(err)
        return res.status(500).json({
            success: false, 
            message: "Something went wrong"
        })
    })

}