const express = require('express');
const router = express.Router();

const bodyparser = require('body-parser');
const jsonParser = bodyparser.json();

const {ShoppingList} = require('./models');

// we're going to add some items to ShoppingList
// so there's some data to look at
ShoppingList.create('beans', 2);
ShoppingList.create('tomatoes', 3);
ShoppingList.create('peppers', 4);

// when the root of this router is called with GET, return
// all current ShoppingList items
router.get('/', (req, res) => {
  res.json(ShoppingList.get());
});

router.post('/', jsonParser, (req, res) => {
  // ensure `name` and `budget` are in request body
  const requiredFields = ['name', 'budget'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  const item = ShoppingList.create(req.body.name, req.body.budget);
  res.status(201).json(item);
});

// when PUT request comes in with updated item, ensure has
// required fields. also ensure that item id in url path, and
// item id in updated item object match. if problems with any
// of that, log error and send back status code 400. otherwise
// call `ShoppingList.update` with updated item.
router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['name', 'budget', 'id'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  if (req.params.id !== req.body.id) {
    console.log('here');
    const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating shopping list item \`${req.params.id}\``);
  ShoppingList.update({
    id: req.params.id,
    name: req.body.name,
    budget: req.body.budget
  });
  res.status(204).end();
});

// when DELETE request comes in with an id in path,
// try to delete that item from ShoppingList.
router.delete('/:id', (req, res) => {
  ShoppingList.delete(req.params.id);
  console.log(`Deleted shopping list item \`${req.params.ID}\``);
  res.status(204).end();
});


module.exports = router;