const router = require("express").Router();
const controller = require('../models/emotionController')

router.get('/', controller.getEmotion);

module.exports = router;
