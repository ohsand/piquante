const { textChangeRangeIsUnchanged } = require('typescript');
const sauces = require('../models/sauces');

exports.createSauces = (req, res, next) => {
    /*delete req.body._id;
    const sauces = new sauces({ 
      ...req.body
    });
    sauces.save()
    .then(() => res.status(201).json({ message: "Objet enregistré"}))
    .catch(() => res.status(400).json({ error }));*/
    const saucesObject = JSON.parse(req.body.sauces);
    delete saucesObject._id;
    delete saucesObject._userId;
    const sauces = new sauces({
      ...saucesObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    sauces.save()
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
  };

exports.modifySauces = (req, res, next) => {
  sauces.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
  };

exports.deleteSauces = (req, res, next) => {
    sauces.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
    .catch(error => res.status(400).json({ error }));
  };

exports.getOneSauces = (req, res, next) => {
  sauces.findOne({ _id: req.params.id })
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(404).json({ error }));
  };

exports.getAllSauces = (req, res, next) => {
  sauces.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
  };