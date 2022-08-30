const { textChangeRangeIsUnchanged } = require('typescript');
const Sauce = require('../models/sauce');

exports.createSauces = (req, res, next) => {
    /*delete req.body._id;
    const sauces = new sauces({ 
      ...req.body
    });
    sauces.save()
    .then(() => res.status(201).json({ message: "Objet enregistré"}))
    .catch(() => res.status(400).json({ error }));*/
    console.log('enter here ');
    console.log('req 1.1 ? ' + JSON.stringify(req.body));
    console.log('red ?' + req.body.sauce);

   // {"sauce":"{\"name\":\"t\",\"manufacturer\":\"t\",\"description\":\"t\",\"mainPepper\":\"t\",\"heat\":1,\"userId\":\"62ff992955c783157f5f2f65\"}"}
    
     const saucesObject = JSON.parse(req.body.sauce);
    console.log(saucesObject);
    delete saucesObject._id;
    delete saucesObject._userId;
    console.log('req ath ' + req.auth.userId);
    const sauces = new Sauce({
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
  Sauce.findOne({ _id: req.params.id })
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(404).json({ error }));
  };

exports.getAllSauces = (req, res, next) => {
  console.log("finding sauces");
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
  };