var express = require('express');
var router = express.Router();

var controller = require('../controllers/displaycontroller');

/* GET home page. */
router.get('/', function(req, res, next) {
    controller.generateTableElements()
        .done(function(elements) {
            res.render('index', {status: elements});
        });
});

module.exports = router;
