const { use } = require("passport");
const User = require("../models/userModel");
const util = require("../utils/generateToken");

exports.registerUser = async (req, res) => {
  const { name, email, password, dob } = req.body;

  if (!name || !email || !password || !dob) {
    return res.status(422).json({
      success: false,
      message: "Please fill all the required fields.",
    });
  }
  let userExists;
  try {
    userExists = await User.findOne({ email });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }

  if (userExists) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const user = new User({
    name,
    email,
    password,
    dob,
  });

  user
    .save()
    .then((user) => {
      let newUser = {
        name: user.name,
        email: user.email,
        dob: user.dob,
        token: util.generateToken(user._id),
      };
      return res.status(200).json({
        user: newUser,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    });
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({
      success: false,
      message: "Please fill all the required fields.",
    });
  }
  let user;
  try {
    user = await User.findOne({ email });
  } catch (err) {
    return res.status(500).json({
      message: "Something went wrong",
    });
  }

  if (user && (await user.matchPassword(password))) {
    return res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
        dob: user.dob,
        token: util.generateToken(user._id),
      },
    });
  } else {
    res.status(400).json({
      success: false,
      message: "Invalid email or password.",
    });
  }
};
