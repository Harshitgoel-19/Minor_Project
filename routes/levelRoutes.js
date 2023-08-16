const express = require('express');
const router = express.Router();
const levelController=require('../controllers/levelController')

router.post('/api/levelupdate',levelController.levelComplete);
router.post('/levelup',levelController.goNext);

module.exports = router;