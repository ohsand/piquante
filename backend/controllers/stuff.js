//const { textChangeRangeIsUnchanged } = require('typescript');
const Sauce = require('../models/sauce');
const fs = require('fs');


// creaate a new sauce
exports.createSauces = (req, res, next) => {
     const saucesObject = JSON.parse(req.body.sauce);
    console.log(saucesObject);
    delete saucesObject._id;
    delete saucesObject._userId;
    console.log('req ath ' + req.auth.userId);
    const sauce = new Sauce({
      ...saucesObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisLiked: [],
    });

    sauce.save()
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
  };
  

// edit an existing sauce
exports.modifySauces = (req, res, next) => {
  /*sauces.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));*/
    const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauces),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};

    delete sauceObject.userId;
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(400).json({ message : "non autorisé" });
      } else {
        sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
        .then(() => res.status(200).json({message : 'Objet mofidifié' }))
        .catch(error => res.status(400).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    })
  };

//delete a sauce
exports.deleteSauces = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
    .then(sauces => {
        if (sauces.userId != req.auth.userId) {
            res.status(401).json({message: 'Not authorized'});
        } else {
            const filename = sauces.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                    .catch(error => res.status(401).json({ error }));
            });
        }
    })
    .catch( error => {
        res.status(500).json({ error });
    });
  };

//get one sauce
exports.getOneSauces = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
  };

//get all sauces
exports.getAllSauces = (req, res, next) => {
  console.log("finding sauces");
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
  };

  exports.likeDislikeSauce = (req, res, next) => {
    const like = req.body.like;
    const userId = req.body.userId;
    const sauceId = req.params.id;
    if (!userId) {
      res.status(401).json({ error: "Utilisateur requis !" });
      return;
    }
    
    Sauce.findOne({ _id: sauceId })
      .then((sauce) => {
  
        if (like === 1) {
          if (sauce.usersLiked.includes(userId) || sauce.usersDisliked.includes(userId)) {
           
            res.status(401).json({ error: "L'utilisateur a déjà liké ou disliké" });
          } else {
          
            Sauce.updateOne({ _id: sauceId }, { $push: { usersLiked: userId }, $inc: { likes: +1 } })
              .then(() => res.status(200).json({ message: "J'aime" }))
              .catch((error) => res.status(400).json({ error: error.message }));
          }
        } else if (like === 0) {
          if (sauce.usersLiked.includes(userId)) {
  
            Sauce.updateOne({ _id: sauceId }, { $pull: { usersLiked: userId }, $inc: { likes: -1 } })
              .then(() => res.status(200).json({ message: "Neutre" }))
              .catch((error) => res.status(400).json({ error: error.message }));
          } else if (sauce.usersDisliked.includes(userId)) {
  
            Sauce.updateOne({ _id: sauceId }, { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } })
              .then(() => res.status(200).json({ message: "Neutre" }))
              .catch((error) => res.status(400).json({ error: error.message }));
          } else {
   
            res.status(401).json({ error: "Utilisateur n'a pas liké ou disliké" });
          }
        } else if (like === -1) {
  
          if (sauce.usersLiked.includes(userId) || sauce.usersDisliked.includes(userId)) {
  
            res.status(401).json({ error: "L'utilisateur a déjà liké ou disliké" });
          } else {
        
            Sauce.updateOne({ _id: sauceId }, { $push: { usersDisliked: userId }, $inc: { dislikes: +1 } })
              .then(() => {
                res.status(200).json({ message: "Je n'aime pas" });
              })
              .catch((error) => res.status(400).json({ error: error.message }));
          }
        } else {
          res.status(400).json({ error: "Like ne peut que être égale à -1, 0 ou 1" });
        }
      })
      //
      .catch((error) => res.status(404).json({ error: error.message }));
  };