const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require('../models/userModel')

module.exports = (passport) => {
  passport.use(
    new JwtStrategy({
      secretOrKey: process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromHeader("token")
    },(jwt_payload, done)=>{
        User.findById(jwt_payload.id).then(user=>{
            if(user){
                return done(null, user);
            }else{
                return done("You are not authorized", false)
            }
        }).catch(err=>{
            console.log(err)
        })
    })
  );
};
