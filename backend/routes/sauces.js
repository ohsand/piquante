const express = require('express');
const router = express.Router();
//const sauces = require('../models/sauces');
const saucesCtrl = require('../controllers/stuff');
const auth = require('auth');
const multer = require('../middleware/multer-config.js');

router.post('/', auth, multer, saucesCtrl.createSauces);
router.put('/:id', auth, saucesCtrl.modifySauces);
router.delete('/:id', auth, saucesCtrl.deleteSauces);
router.get('/:id', auth, saucesCtrl.getOneSauces);
router.get('/', auth, saucesCtrl.getAllSauces);

module.exports = router;