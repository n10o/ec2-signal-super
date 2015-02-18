var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
//    console.log(req.user);
//    res.redirect('http://localhost:8888/');
    res.render('index', { title: 'EC2 Signal', user: req.user });
});


module.exports = router;
