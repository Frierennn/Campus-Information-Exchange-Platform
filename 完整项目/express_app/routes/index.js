var express = require('express');
var router = express.Router();

var data = [
  { id: 1, name: "Chicken Wing", category: "Food", qty: 3, price: 10 },
  { id: 2, name: "Pizza", category: "Food", qty: 1, price: 50 },
  { id: 3, name: "Hamburger", category: "Food", qty: 1, price: 12 },
  { id: 4, name: "Coca Cola", category: "Drink", qty: 2, price: 5 },
  { id: 5, name: "Orange Juice", category: "Drink", qty: 1, price: 15 },
  { id: 6, name: "Potato Chips", category: "Snack", qty: 1, price: 8 },
]

router.get('/all', function (req, res, next) {
  res.json(data)
});

router.get('/all/2', function (req, res, next) {
  res.json(data[1])
});

router.get('/food', function (req, res, next) {
  res.json(data.slice(0,3))
});

router.get('/drink/4', function (req, res, next) {
  res.json(data[3])
});

module.exports = router;
