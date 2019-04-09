let baseBelongsTo = "sails.models.TABLE_NAME.belongsTo(sails.models.REFERENCES, { as: 'REFERENCES', foreignKey: 'FK_VALUE' });"
let baseHasMany = "sails.models.TABLE_NAME.hasMany(sails.models.REFERENCES, { as: 'REFERENCES', foreignKey: 'FK_VALUE' });"

module.exports = {

  setTableName: function(item, template) {
    template = template.replace(/MODEL_TABLENAME/g, "'" + item.tableName + "'")
    return template
  },

  setAttributes: function(item, template) {
    let attr = {}
    for (var k in item.columns) {
      let _column = item.columns[k]
      attr[k] = {
        type: sequelizeType(_column.type),
        allowNull: _column.null
      }
      if (_column.auto_increment) attr[k].autoIncrement = _column.auto_increment
    }
    attr[item.keys.primaryKey].primaryKey = true

    template = template.replace(/MODEL_ATTRIBUTES/g, JSON.stringify(attr).replace(/\"/g, ''))
    return template
  },

  setRelations: function(item, tables, template) {
    let relations = ''
    item.keys.foreignKeys.forEach(function(fk) {
      _relation = baseBelongsTo.replace(/TABLE_NAME/g, item.tableName).replace(/REFERENCES/g, fk.references.table).replace(/FK_VALUE/g, fk.fk)
      relations += _relation
    })

    tables.forEach(function(table){
      if(table.tableName != item.tableName){
        table.keys.foreignKeys.forEach(function(fkeys){
          if(fkeys.references.table == item.tableName){
            let _hasMany = baseHasMany.replace(/TABLE_NAME/g, item.tableName).replace(/REFERENCES/g, table.tableName).replace(/FK_VALUE/g, fkeys.fk)
            relations += _hasMany
          }
        })
      }
    })

    template = template.replace(/MODEL_ASSOCIATIONS/g, relations)
    return template
  },

  setTimeStamps: function(item, template) {
    let hasCreatedAt, hasUpdatedAt
    for (var k in item.columns){
      if(k == 'createdAt' && (item.columns[k].type == 'DATETIME' || item.columns[k].type == 'DATE')){
        hasCreatedAt = true
      }
      if(k == 'updatedAt' && (item.columns[k].type == 'DATETIME' || item.columns[k].type == 'DATE')){
        hasUpdatedAt = true
      }
    }
    if(hasCreatedAt && hasUpdatedAt){
      template = template.replace(/MODEL_TIMESTAMPS/g, 'true')
    }else{
      template = template.replace(/MODEL_TIMESTAMPS/g, 'false')
    }

    return template
  }


}

function sequelizeType(a) {
  switch (a) {
    case 'VARCHAR':
      return 'Sequelize.STRING';
    case 'TEXT':
      return 'Sequelize.STRING';
    case 'INT':
      return 'Sequelize.INTEGER';
    case 'DOUBLE':
      return 'Sequelize.DOUBLE';
    case 'FLOAT':
      return 'Sequelize.FLOAT';
    case 'DATETIME':
      return 'Sequelize.DATE';
    case 'TINYINT':
      return 'Sequelize.TINYINT';
    case 'BIGINT':
      return 'Sequelize.INTEGER';
    case 'SMALLINT':
      return 'Sequelize.INTEGER';
  }
  return 'Sequelize.STRING'
}

return module.exports
