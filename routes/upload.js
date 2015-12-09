var express = require('express');
var router = express.Router();

var controller = require('../controllers/datainputcontroller');

router.post('/', function(req, res, next) {
    var status = req.body;
    console.log(status);
    res.end();
});

module.exports = router;
