module.exports = {
  create: function(req, res) {
    sails.models.MODEL_NAME.create(req.body, {
        include: [INCLUDE_OBJECTS]
      })
      .then(data => {
        if (data) res.send(200, data)
      })
      .catch(err => {
        res.send(500, err.stack)
      })
  },
  list: function(req, res) {
    sails.models.MODEL_NAME.findAll({
        where: req.query,
        include: [INCLUDE_OBJECTS],
        order: [
          ['id', 'ASC']
        ]
      })
      .then(data => {
        if (data) res.send(200, data)
      })
      .catch(err => {
        res.send(500, err.stack)
      })
  },
  update: function(req, res) {
    sails.models.MODEL_NAME.update(req.body, {
        where: {
          id: req.body.id
        },
        individualHooks: true
      })
      .then(data => {
        if (data) res.send(205, data)
      })
      .catch(err => {
        res.send(500, err.stack)
      })
  },
  delete: function(req, res) {
    sails.models.MODEL_NAME.destroy({
        where: req.query
      })
      .then(data => {
        if (data) res.send(204, data)
      })
      .catch(err => {
        res.send(500, err.stack)
      })
  }
}
