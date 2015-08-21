var URL = require('url')
var redis = require('redis')

module.exports = function (config) {
  var client, url, port, host, db, auth, options

  config = config || {}

  if (config) {
    try {
      url = URL.parse(config && config.url || process.env.REDIS_PORT || 'redis://localhost:6379')
      port = url.port
      host = url.hostname
      db = config.db
      auth = config && config.auth

      options = {
        no_ready_check: true
      }

      client = redis.createClient(port, host, options)

      if (auth) {
        client.auth(auth, function () {})
      }

      if (db) {
        client.select(db)
      }

    } catch (e) {
      throw new Error(e)
    }
  }

  module.exports = client

  return client
}
