const router = require("express").Router();
const controller = require('../controllers/emotionController')

router.post('/', controller.getEmotion);

module.exports = router;
