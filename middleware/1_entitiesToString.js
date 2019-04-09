Array.prototype.chunk = function(chunkSize) {
	var array = this

	return [].concat.apply([],
		array.map(function(elem,i) {
			return i%chunkSize ? [] : [array.slice(i,i+chunkSize)];
		})
	)
 }

function convertEntitiesToString(sql) {
  if(!sql) return
	let entities
	entities = sql.replace(/\n|\t/g, ' ') //elimina los saltos de linea (minifica) del string

	entities = entities.match(/CREATE TABLE IF NOT EXISTS(.*?)\;/g) //separa cada entidad en un string independiente
	// console.log(entities);
	return entities
}


module.exports = function(sql) {
  return function(context, next) {
		if(!sql) context.stop = true
    context.stringEntities = convertEntitiesToString(sql)
    next(context)
  }
}
