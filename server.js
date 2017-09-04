
const express = require('express');
const router = express.Router();
const morgan = require('morgan');

const shoppingListRouter = require('./shoppingListRouter');
const recipesRouter = require('./recipesRouter');

const app = express();

// log the http layer
app.use(morgan('common'));

app.use('/shopping-list', shoppingListRouter);

app.use('/recipes', recipesRouter);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
