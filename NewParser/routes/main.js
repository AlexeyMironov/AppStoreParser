var express = require('express');
var router = express.Router();

/* GET main page. */

router.get('/', function(req, res) {
    res.render('main');
});

module.exports = router;
