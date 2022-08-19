const Sauces = require('../models/sauces');

exports.createSauces = (req, res, next) => {
    delete req.body._id;
    const sauces = new sauces({ 
      ...req.body
    });
    sauces.save()
    .then(() => res.status(201).json({ message: "Objet enregistré"}))
    .catch(() => res.status(400).json({ error }));
  };

  exports.modifySauces = (req, res, next) => {
    Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
  };

  exports.deleteSauces = (req, res, next) => {
    Thing.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
      .catch(error => res.status(400).json({ error }));
  };

  exports.getOneSauces = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(404).json({ error }));
  };

  exports.getAllSauces = (req, res, next) => {
    sauces.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
  };