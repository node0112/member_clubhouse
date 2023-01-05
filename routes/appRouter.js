const express = require("express")
const router = express.Router();

const appController = require("../controllers/appController");


router.get('/',appController.index)

router.get('/signup',appController.sign_up_get)
router.post('/signup',appController.sign_up_post)

router.get('/login',appController.log_in_get)
router.post('/login',appController.log_in_post)

router.get('/:id/message',appController.message_get)
router.post('/:id/message',appController.message_post)

router.get('/messageboard',appController.messageboard)

router.get('/logout',appController.log_out)

module.exports = router