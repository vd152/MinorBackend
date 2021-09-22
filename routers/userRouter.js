const router = require("express").Router();
const controller = require('../controllers/userController')

router.get('/', controller.createUser)
router.post('/register', controller.registerUser);

module.exports = router;
