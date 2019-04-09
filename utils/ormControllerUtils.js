let includeObject = "{  model: sails.models.TABLE_NAME, as: 'TABLE_NAME' },"

module.exports = {

  setModelName: function(item, template) {
    template = template.replace(/MODEL_NAME/g, item.tableName )
    return template
  },

  setIncludes: function(item, tables, template) {
    let includes = ''
    item.keys.foreignKeys.forEach(function(fk) {
      _include = includeObject.replace(/TABLE_NAME/g, fk.references.table)
      includes += _include
    })
    //
    // tables.forEach(function(table){
    //   if(table.tableName != item.tableName){
    //     table.keys.foreignKeys.forEach(function(fkeys){
    //       if(fkeys.references.table == item.tableName){
    //         let _include = includeObject.replace(/TABLE_NAME/g, item.tableName)
    //         relations += _hasMany
    //       }
    //     })
    //   }
    // })

    template = template.replace(/INCLUDE_OBJECTS/g, includes)
    return template
  }


}

return module.exports
