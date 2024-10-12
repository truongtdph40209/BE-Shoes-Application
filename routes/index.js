var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

// Trang home
router.get('/home', async (req, res) => {
  res.render('home'); 
});

module.exports = router;
