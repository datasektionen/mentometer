require('dotenv').config() // Read .env into process.env
var express = require('express')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)
var fetch = require('node-fetch')
var db = require('./models') // The user model from mongoose
var socketAuth = require('./socketAuth')

/**
 * The mentometer Node.js server consists of two parts. The express part 
 * and the socket.io part. 
 * 
 * The express part listens to the PORT env
 * (or 8080 if not given) and serves the build of the React frontend
 * on every path. If the build has no file on that location, the index.html
 * of the build is served instead, to enable routing in React.
 *
 * The socket.io part declares a websocket server that handles the logic
 * behind the voting. This is communicated with from React.
 */

// The express HTTP server
// Serve the build on every possible url where a file exists, otherwise index.html
app.use('/', express.static('build'));
app.use((req, res) => res.sendFile(`${__dirname}/build/index.html`))

// Listen on the given port
var port = process.env.PORT || 8080;
server.listen(port);
console.log("Express server listening on port " + port);


/**
 * Below is the logic for the socket.io server and voting overall.
 */
const state = {
  question: '', // The question voting for right now
  alternatives: [], // The existing alternatives
  voteList: {}, // A hashmap of users u1234567 => alternativeid that have voted with their vote
  open: false,
  get votes () { 
    return this.alternatives.map((a,i) => {
      let list = []
      for (let key in this.voteList) {
        list.push(this.voteList[key])
      }
      return list.filter(x => x === i).length
    }) 
  },
  lastOpened: Date.now()
}

io.use(socketAuth)
.on('connection', function (socket) {
  var getAdminSockets = () => {
    return Object.keys(io.sockets.adapter.nsp.sockets).map(soc => io.sockets.adapter.nsp.sockets[soc]).filter(sock => sock.user.isAdmin)
  }

	// On new connections, first send data to new user
  socket.emit('alternatives', state.alternatives)
  socket.emit('question', state.question)
  socket.emit('status', state.voteList[socket.user.ugkthid] === undefined ? 0 : 1)
  socket.emit('admin', socket.user.isAdmin)
  socket.emit('open', state.open)

  if (socket.user.isAdmin) {
    socket.emit('votes', state.votes)
    db.User.find({}).then(users => socket.emit('users', users))
    db.Log.find({}).sort('-closed_at').then(x => socket.emit('log', x))
  }

  /**
   * Websocket-"routes"
   */
  //
	// Define what we should do when user votes
  // 
	socket.on('vote', function (data) {
    if (!state.open) {
      socket.emit('status', 4)
      return
    }

    // Refresh the user, might have gone non-attending
    db.User.findOne({ ugkthid: socket.user.ugkthid })
      .then(user => {
        user.isAdmin = socket.user.isAdmin
        socket.user = user
        if (!user.attending) {
          socket.emit('status', 3)
          return
        }

        const existed = state.voteList.hasOwnProperty(socket.user.ugkthid)
        state.voteList[socket.user.ugkthid] = data.alternative

        // Inform every admin about new result
        getAdminSockets().forEach(sock => {
          sock.emit('votes', state.votes)
        })

        // Inform frontend everything is ok and log
        socket.emit('status', existed ? 2 : 1)
        console.log('Received vote')
    })
	});

	// When we receive a new question, update the old and remove alternatives
	socket.on('question', function (data) {
    if (state.question === data || !socket.user.isAdmin || state.open) {
      return
    }
		state.question = data
		state.voteList = []
		socket.emit('votes', state.votes)
		io.sockets.emit('question', state.question)
		io.sockets.emit('alternatives', state.alternatives)
    io.sockets.emit('status', 0)
    getAdminSockets().forEach(sock => 
      sock.emit('votes', state.votes)
    )
	})

  // When admin tries to update alternatives, update them
  // TODO: Only for admins
  socket.on('alternatives', function (data) {
    if (!socket.user.isAdmin) {
      return
    }
    if (state.open) {
      return
    }
    state.alternatives = data
    state.voteList = {}
    getAdminSockets().forEach(sock => sock.emit('votes', state.votes))
    io.sockets.emit('status', 0)

    // Spread the new alternatives amongst the clients
    io.sockets.emit('alternatives', state.alternatives)
  })

  socket.on('open', function (data) {
    if (!socket.user.isAdmin) {
      return
    }
    state.open = data
    io.sockets.emit('status', 0)
    if (data) {
      state.voteList = {}
      state.lastOpened = Date.now()
      io.sockets.emit('open', data)
      getAdminSockets().forEach(sock => {
        sock.emit('votes', state.votes)
      })
    } else {
      db.User.find({ attending: true }).then(x => {
        let log = new db.Log({
          opened_at: state.lastOpened,
          closed_at: Date.now(),
          question: state.question,
          participants: state.votes.reduce((a, b) => a + b, 0),
          attending: x.length,
          result: state.alternatives.map((alternative, idx) => ({ alternative: alternative, votes: state.votes[idx] }))
        })
        log.save().then(() => {
          io.sockets.emit('open', data)
          getAdminSockets().forEach(sock => {
            sock.emit('votes', state.votes)
            db.Log.find({}).sort('-closed_at').then(x => sock.emit('log', x))
          })
        })
        
      })
    }
  })

  // Add a new alternative
  // TODO: Only for admins
  socket.on('new-alternative', function (data) {
    if (!socket.user.isAdmin) {
      return
    }
    if (state.open) {
      return
    }
    state.alternatives.push({content: data.content ? data.content : '', id:state.alternatives.map(x => x.id).reduce((x,y) => Math.max(x,y), -1) + 1})
    io.sockets.emit('alternatives', state.alternatives)
    socket.emit('votes', state.votes)
    state.voteList = {}
    getAdminSockets().forEach(sock => sock.emit('votes', state.votes))
    io.sockets.emit('status', 0)
  })

  socket.on('update-user', function (data) {
    console.log('Updating user,', data)
    if (!socket.user.isAdmin) {
      return
    }
    db.User.findOne({ ugkthid: data.ugkthid }).then(user => {
      user.attending = data.attending
      user.save().then(x => {
        db.User.find({}).then(users => {
          io.sockets.emit('users', users)
        })
      })
      fetch('https://hodis.datasektionen.se/ugkthid/' + data.ugkthid) // To increase ranking in Hodis
    })
  })

  socket.on('add-user', function (data) {
    if (!socket.user.isAdmin) {
      return
    }
    db.User.createFromUgKthId(data.ugkthid, user => {
      user.attending = true
      user.save().then(x => {
        db.User.find({}).then(users => {
          io.sockets.emit('users', users)
        })
      })
    })
  })

  socket.on('add-user-exact', function (data) {
    if (!socket.user.isAdmin) {
      return
    }
    db.User.createFromKthId(data, user => {
      if (!user) {
        db.User.find({}).then(users => {
          io.sockets.emit('users', users)
        })
        return
      }
      user.attending = true
      user.save().then(x => {
        db.User.find({}).then(users => {
          io.sockets.emit('users', users)
        })
      })
    })
  })

	// Remove an alternative
	// TODO: Only for admins
	socket.on('drop-alternative', function (data) {
    if (!socket.user.isAdmin) {
      return
    }

    if (state.open) {
      return
    }
		// Find the alternative and remove it, also remove its votes
		var idx = state.alternatives.findIndex(x => x.id == data.id)
		state.alternatives.splice(idx, 1)
    state.voteList = {}
    getAdminSockets().forEach(sock => sock.emit('votes', state.votes))
    io.sockets.emit('status', 0)

		// Send the now shorter list of alternatives to everyone
		io.sockets.emit('alternatives', state.alternatives)
		socket.emit('votes', state.votes) // TODO: Only to admins
	})
});