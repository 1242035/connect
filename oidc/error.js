/**
 * Module dependencies
 */

var qs = require('qs')

/**
 * Error Response
 */

function error (err, req, res, next) {
  // 302 Redirect
  if (err.statusCode === 302 && err.redirect_uri) {
    var responseMode = '?' || '#'
    var error = { error: err.error, error_description: err.error_description }
    var uri = err.redirect_uri + responseMode + qs.stringify(error)

    res.redirect(uri)

  // 400 Bad Request
  } else if (err.statusCode === 400) {
    res.set({
      'Cache-Control': 'no-store',
      'Pragma': 'no-cache'
    })

    res.status(400).json({
      error: err.error || err.message,
      error_description: err.error_description,
      error_uri: err.error_uri
    })

  // 401 Unauthorized
  } else if (err.statusCode === 401) {
    // rfc 6750 Bearer Token
    // http://tools.ietf.org/html/rfc6750#section-3
    res.set({
      'WWW-Authenticate': 'Bearer ' +
        'realm="' + err.realm + '", ' +
        'error="' + err.error + '", ' +
        'error_description="' + err.error_description + '"'
    })

    res.status(401).send('Unauthorized')

  // 403 Forbidden
  } else if (err.statusCode === 403) {
    res.status(403).send('Forbidden')

  // 500 Internal Server Error
  } else {
    var statusCode = err.statusCode || 500
    var message = (err.statusCode && err.message) || 'Internal Server Error'

    res.status(statusCode).send(message)
  }

}

/**
 * Exports
 */

module.exports = error
