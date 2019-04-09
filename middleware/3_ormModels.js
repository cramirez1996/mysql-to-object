const ormModelUtils = require('../utils/ormModelUtils.js')
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

function convertObjectToORM(tables) {
  tables.forEach(function(table) {
    var template = fs.readFileSync(path.resolve('templates', 'sequelize.js.template'), 'utf-8');

    template = ormModelUtils.setTableName(table, template)
    template = ormModelUtils.setAttributes(table, template)
    template = ormModelUtils.setRelations(table, tables, template)
    template = ormModelUtils.setTimeStamps(table, template)

    template = beautify(template, {
      indent_size: 2,
      space_in_empty_paren: true
    })

    fs.writeFile(path.resolve('ormModels', table.tableName + '.js'), template, function(err) {
      if (err) console.log(err);
    });
  })

}


module.exports = (function() {
  return function(context, next) {
    convertObjectToORM(context.entityObjects)
    next(context)
  }
})();
