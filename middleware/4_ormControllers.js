const ormControllerUtils = require('../utils/ormControllerUtils.js')
const utils = require('../utils/utils.js')
const fs = require('fs')
const path = require("path");
var beautify = require('js-beautify').js;

Array.prototype.chunk = function(chunkSize) {
  var array = this

  return [].concat.apply([],
    array.map(function(elem, i) {
      return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
    })
  )
}

function generateControllers(tables) {
  tables.forEach(function(table) {
    var template = fs.readFileSync(path.resolve('templates', 'sails.sequelize.controller.js'), 'utf-8');

    template = ormControllerUtils.setModelName(table, template)
    template = ormControllerUtils.setIncludes(table, tables, template)

    template = beautify(template, {
      indent_size: 2,
      space_in_empty_paren: true
    })

    let _string = []
    _tableName = table.tableName.split('_')
    _tableName.forEach(function(string){
      _string.push(utils.capitalizeString(string))
    })
    _tableName = _string.join('')

    fs.writeFile(path.resolve('ormControllers', _tableName  + 'Controller.js'), template, function(err) {
      if (err) console.log(err);
    });
  })

}


module.exports = (function() {
  return function(context, next) {
    generateControllers(context.entityObjects)
    next(context)
  }
})();
