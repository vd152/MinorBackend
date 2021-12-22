const router = require("express").Router();
const controller = require('../controllers/emotionController')
var passport = require('passport');

router.post('/',passport.authenticate('jwt',{session: false}), controller.getEmotion);

module.exports = router;
