const express = require('express');
const router = express.Router();

const bodyparser = require('body-parser');
const jsonParser = bodyparser.json();

const {Recipes} = require('./models');

// adding some recipes to `Recipes` so there's something
// to retrieve.
Recipes.create(
  'boiled white rice', ['1 cup white rice', '2 cups water', 'pinch of salt']);
Recipes.create(
  'milkshake', ['2 tbsp cocoa', '2 cups vanilla ice cream', '1 cup milk']);

router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['name', 'ingredients', 'id'];

  for (let i=0; i < requiredFields.length; i++) {
    const field = requiredFields[i];

    if(!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

    if(req.params.id !== req.body.id) {
      const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
      console.error(message);
      return res.status(400).send(message);
    }

    console.log(`Updating recipe item \`${req.params.id}\``);

    Recipes.update({
      id: req.params.id,
      name: req.body.name,
      ingredients: req.body.ingredients
    });
    res.status(204).end();

});

router.get('/', (req, res) => {
  res.json(Recipes.get());
});

router.post('/', jsonParser, (req, res) => {
  // ensure `name` and `budget` are in request body
  const requiredFields = ['name', 'ingredients'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const item = Recipes.create(req.body.name, req.body.ingredients);
  res.status(201).json(item);
});

router.delete('/:id', (req, res) => {
  Recipes.delete(req.params.id);
  console.log(`Deleted recipe \`${req.params.ID}\``);
  res.status(204).end();
});


module.exports = router;