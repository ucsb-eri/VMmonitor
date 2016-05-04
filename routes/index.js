var express = require('express');
var router = express.Router();

var display = require('../controllers/displaycontroller');
var input = require('../controllers/datainputcontroller');

// indexLocals is the object that we pass to the function rendering
// the page
var indexLocals = {
	title: VM display,
	date: 'yyyy-mm-dd', //TODO
	status: elements, 
};

// display the page
router.get('/', function(req, res, next) {
    display.generateTableElements()
        .done(function(elements) {
            res.render('index', indexLocals);
        });
});

// input data
router.post('/', function(req, res) {
	res.send();
	// console.log('received data');
	input.generateDB(req.body);
});


module.exports = router;