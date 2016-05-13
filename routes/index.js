// router
// handles data input and page display

var express = require('express');
var router = express.Router();

var display = require('../controllers/displaycontroller');
var input = require('../controllers/datainputcontroller');

// indexLocals is the object that we pass to the function rendering
// the page
var indexLocals = {
	// title: 'VM display',
	// date: 'yyyy-mm-dd', //TODO
	// status: '', 
};

// display the page
router.get('/', function(req, res, next) {
	console.log('rendering index page');
    display.generateTableElements()
        .done(function(elements) {
        	indexLocals[status] = elements;
        	//TODO
            res.render('layout', indexLocals);
        });
});

// input data
router.post('/', function(req, res) {
	res.send();
	console.log('received data', 'calling generateDB');
	input.generateDB(req.body);
});


module.exports = router;