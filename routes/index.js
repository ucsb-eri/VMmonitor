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
    indexLocals = display.generateTableElements();
        // .done(function(elements) {
        // 	// indexLocals[status] = elements;
        // 	//TODO
        //     res.render('index', indexLocals);
        // });
	res.render('layout');
});

// input data
router.post('/', function(req, res) {
	res.send();
	console.log('received data');
	input.generateDB(req.body).done(console.log('stored data'));
});


module.exports = router;