let mysqlColumnOptions = ['AUTO_INCREMENT', 'NOT NULL', 'NULL', 'UNSIGNED', 'ZEROFILL']

module.exports = {

  getKeys: function(keys) {
    let _keys = {
      primaryKey: {},
      foreignKeys: []
    }
    keys.forEach(function(key) {
      key = key.trim()
      if (key.match(/^CONSTRAINT/g)) {

        let references = key.match(/(?<=REFERENCES)(.*?)(\))/g)[0]
        let _references = {
          table: references.match(/(?<=\.)(.*?)(?=\()/g)[0].replace(/\`/g, '').trim(),
          on: references.match(/(?<=\()(.*?)(?=\))/g)[0].replace(/\`/g, '').trim(),
        }
        references = _references

        let fk = key.match(/(?<=FOREIGN KEY)(.*?)(\))/g)[0]
        fk = fk.match(/(?<=`)(.*?)(?=\`)/g)[0]

        _keys.foreignKeys.push({
          fk,
          references
        })
      }

      if (key.match(/^PRIMARY/g)) {
        pk = key
        pk = key.match(/(?<=`)(.*?)(?=\`)/g)[0]
        _keys.primaryKey = pk
      }

    })

    return _keys
  },

  getTableName: function(item) {
    let tableName = item.match(/(?<=CREATE TABLE IF NOT EXISTS)(.*?)(?=\()/g)[0].trim()
    tableName = tableName.replace(/\`/g, '').trim()
    if (tableName.split('.')) {
      tableName = tableName.split('.')[1]
    }
    return tableName
  },

  getColumns: function(item) {
    item = item.match(/(?<=\()(.*)(?=\))/g)[0]
    item = item.replace(/,(?=(((?!\)).)*\()|[^\(\)]*$)/g, "*");
    item = item.trim().split('*')
    return item
  },

  getColumnProperties: function(item) {
    let columnName = item.trim().match(/^(\`)(.*?)(\`)/g)
    let columnOptions, columnType

    if (columnName) {

      let _options = {}
      columnName = columnName[0].replace(/\`/g, '')
      columnOptions = item.trim().replace(/^(\`)(.*?)(\`)/g, '')
      // console.log(columnOptions);
      columnType = columnOptions.trim().split(' ')[0]

      mysqlColumnOptions.forEach(function(option) {

        let optionName = option.replace(' ', '_').toLowerCase()

        if (columnOptions.match(option)) {
          _options[optionName] = true
        } else {
          _options[optionName] = false
        }

        columnOptions = columnOptions.replace(option, '')
      })

      columnOptions = _options
      // console.log(columnType);
      columnOptions['type'] = columnType.replace(/(\()(.*?)(\))/g, '')
      return {
        columnName,
        columnOptions
      }
    }

    return
  },
  capitalizeString: function(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    })
  }



}

return module.exports
