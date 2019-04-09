const _middleware = require('./middleware')
const express = require('express');
const app = express();
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser');
var multer = require('multer')
const zipper = require('zip-local')
var upload = multer({
  dest: 'uploads/'
})

Array.prototype.chunk = function(chunkSize) {
  var array = this

  return [].concat.apply([],
    array.map(function(elem, i) {
      return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
    })
  )
}

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.post('/convert', upload.single('file'), function(req, res) {
  var Middleware = new _middleware()
  fs.readFile(req.file.path, (err, data) => {
    var stringSql = data.toString()

    var models = fs.readdirSync(path.resolve('ormModels'))
    models.forEach(function(file){
      fs.unlinkSync(path.resolve('ormModels', file))
    })

    var controllers = fs.readdirSync(path.resolve('ormControllers'))
    controllers.forEach(function(file){
      fs.unlinkSync(path.resolve('ormControllers', file))
    })

    Middleware.use(require('./middleware/1_entitiesToString')(stringSql));
    Middleware.use(require('./middleware/2_entityStringToObject'));
    Middleware.use(require('./middleware/3_ormModels'));
    Middleware.use(require('./middleware/4_ormControllers'));

    Middleware.go({}, (context) => {
      res.send(context)


    })



  });

});

app.listen(3000, function() {
  console.log('App listening on port 3000!');
});
