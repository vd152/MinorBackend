const router = require("express").Router();
const controller = require('../controllers/musicController')

router.get('/', controller.getAudioMood);
router.get('/:year', controller.getSongByYear);
router.get('/updatedb', controller.saveMusicData);

module.exports = router;