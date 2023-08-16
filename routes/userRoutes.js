const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.get('/user',authController.isAuthorised,userController.userDashboard);
router.get('/update-profile',authController.isAuthorised,userController.getupdateProfile);
router.post('/update-avatar',userController.upload.single('avatar'),userController.checkFileExist,userController.updateAvatar);
router.post('/update-profile',userController.updateProfile);
router.post('/remove-avatar',userController.removeAvatar);
router.get('/update-password',userController.getupdatePassword);
router.post("/update-password",userController.updatePassword,authController.logout);
router.get('/forgot-password',userController.getforgotPassword)
router.post('/forgot-password',userController.forgotPassword)

module.exports = router;  