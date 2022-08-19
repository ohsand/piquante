const mongoose = require('mongoose');
const express = require ('express');
mongoose.connect('mongodb+srv://ohsand:12345@cluster0.uonbuyb.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
const sauces = require('./models/sauces');

  const app = express();

  app.use(express.json());

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  app.post('/api/sauces', (req, res, next) => {
    delete req.body._id;
    const sauces = new sauces({ 
      ...req.body
    });
    sauces.save()
    .then(() => res.status(201).json({ message: "Objet enregistré"}))
    .catch(() => res.status(400).json({ error }));
  });

  app.put('/api/sauces/:id', (req, res, next) => {
    Thing.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
  });

  app.delete('/api/sauces/:id', (req, res, next) => {
    Thing.deleteOne({ _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
      .catch(error => res.status(400).json({ error }));
  });

  app.get('/api/sauces/:id', (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(404).json({ error }));
  });

  app.use('/api/sauces', (req, res, next) => {
    sauces.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
  });

module.exports = app;