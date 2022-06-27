const router = require("express").Router();
const controller = require('../controllers/musicController')
var passport = require('passport');

router.get('/mood/:mood',passport.authenticate('jwt',{session: false}), controller.getSongByMood);
router.get('/popular',passport.authenticate('jwt',{session: false}), controller.getPopularSongs)
router.get('/search',passport.authenticate('jwt',{session: false}), controller.searchSongs);
router.get('/updatedb', controller.saveMusicData);
router.get('/classify', controller.classifyMusicData);
router.get('/:year',passport.authenticate('jwt',{session: false}), controller.getSongByYear);
router.get('/play/:id', controller.getMusicById);

module.exports = router;