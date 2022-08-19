const express = require('express');
const router = express.Router();
const sauces = require('../models/sauces');
const saucesCtrl = require('../controllers/stuff');

router.post('/', saucesCtrl.createSauces);
router.put('/:id', saucesCtrl.modifySauces);
router.delete('/:id', saucesCtrl.deleteSauces);
router.get('/:id', saucesCtrl.getOneSauces);
router.get('/', saucesCtrl.getAllSauces);

module.exports = router;