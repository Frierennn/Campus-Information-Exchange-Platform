var express = require('express');
var router = express.Router();
var query = require('../database/DBConfig.js');
var mysql = require('mysql');

router.get('/', function (req, res, next) {
  query("select * from test;", function (err, vals, fields) {
    res.send('express响应成功!' + JSON.stringify(vals));
    //res.json(vals);
  });
});

module.exports = router;