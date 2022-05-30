var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  console.log('hello')
});

module.exports = router;


// module.exports.index = function(app){
//   app.get('/', function(req, res) {
//   console.log('indexing!')
//   });
// }