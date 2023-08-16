const express = require('express');
const router=express.Router();
const authController=require('../controllers/authController')

router.get('/register',authController.registerGet);
router.get('/login',authController.loginGet);
router.post('/register',authController.registerPOST);

router.post('/login',authController.loginPOST);
router.post('/logout',authController.logout);

module.exports = router;