var db = require('./models') // The user model from mongoose
var fetch = require('node-fetch')

module.exports = (socket, next) => {
  // This is called when connection a web socket
  // Client must send a query token with a login2 token for authentication
  // The token is then verified agains login2, and if OK we send on to next(),
  // which declines the client. Otherwise, the connection is not accepted.
  const token = socket.handshake.query.token
  fetch(process.env.LOGIN2_API_URL + '/verify/' + token + '?format=json&api_key=' + process.env.LOGIN2_API_KEY)
    .then(x => x.json())
    .catch(e => next(new Error('Authentication error')))
    .then(x => {
      console.log('User ' + x.first_name + ' ' + x.last_name + ' (' + x.user + ') authenticated')

      // Try to find user in database, then save and send on to next()
      // Also check if user is admin and save
      db.User.createFromLogin(x, (user) => {
        socket.user = user
        // Check if admin
        fetch(process.env.PLS_API_URL + '/user/' + user.kthid + '/mentometer/admin')
          .then(x => x.json()).catch(e => {})
          .then(x => { 
            socket.user.isAdmin = x
            next() 
          }).catch(e => {})
      })
    })
    .catch(x => next(new Error('Authentication error')))
}