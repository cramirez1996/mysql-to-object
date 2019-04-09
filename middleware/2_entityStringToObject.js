const utils = require('../utils/utils.js')

Array.prototype.chunk = function(chunkSize) {
	var array = this

	return [].concat.apply([],
		array.map(function(elem,i) {
			return i%chunkSize ? [] : [array.slice(i,i+chunkSize)];
		})
	)
 }

function convertEntitiesToString(entities) {
  if(!entities) return
	let parsedEntities = []

	entities.forEach(function(item){
		let tableName = utils.getTableName(item)
		let columns = utils.getColumns(item)
		// console.log(columns);
		parsedEntities.push({tableName : tableName, columns: columns})
	})

	let tables = []

	parsedEntities.forEach(function(a){

		let _table = {
			tableName: a.tableName,
			columns: {},
			keys: {},
			raws: a.columns
		}

		let keys = []

		a.columns.forEach(function(b, i){

			// let property = b.trim().match(/^(\`)(.*?)(\`)/g)
			let column = utils.getColumnProperties(b)

			if(column){
				_table.columns[column.columnName] = column.columnOptions
			}else{
				keys.push(b)
			}

		})
		_table.keys = utils.getKeys(keys)
		tables.push(_table)
	})

	return tables
}


module.exports = (function() {
  return function(context, next) {
    context.entityObjects =  convertEntitiesToString(context.stringEntities)
    next(context)
  }
})();
