// Read .env into process.env
require('dotenv').config()

var fetch = require('node-fetch')

// The mongoose require
var mongoose = require('mongoose');

// Connect and set up
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;

// All the models should be declared here
var userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  kthid: String,
  ugkthid: String,
  attending: Boolean,
  token: String
})
userSchema.statics.createFromLogin = function(x, cb) {
	this.findOne({ ugkthid: x.ugkthid })
  .then(user => {
    // Create if not existed
    if (!user) {
      user = new this({
        first_name: x.first_name,
        last_name: x.last_name,
        email: x.emails,
        kthid: x.user,
        ugkthid: x.ugkthid,
        attending: false
      })
      user.save().then(user => cb(user))
    } else {
	    cb(user)
	  }
  })
};
userSchema.statics.createFromUgKthId = function(x, cb) {
	this.findOne({ ugkthid: x })
  .then(user => {
		// Create if not existed
    if (!user) {
  	fetch('https://hodis.datasektionen.se/ugkthid/' + x)
  		.then(res => res.json())
  		.then(res => {
	      user = new this({
	        first_name: res.cn.split(' ').slice(0, -1).join(' '),
	        last_name: res.cn.split(' ').slice(-1).join(' '),
	        email: res.uid + '@kth.se',
	        kthid: res.uid,
	        ugkthid: x,
	        attending: false
	      })
	      user.save().then(user => cb(user))
  		})
		} else {
	    cb(user)
	  }
  })
};
userSchema.statics.createFromKthId = function(x, cb) {
	this.findOne({ kthid: x })
  .then(user => {
		// Create if not existed
    if (!user) {
  		fetch('https://hodis.datasektionen.se/uid/' + x)
  		.then(res => res.json())
  		.then(res => {
  			if (res.error) {
  				cb(null)
  				return
  			}
	      user = new this({
	        first_name: res.cn.split(' ').slice(0, -1).join(' '),
	        last_name: res.cn.split(' ').slice(-1).join(' '),
	        email: res.uid + '@kth.se',
	        kthid: res.uid,
	        ugkthid: res.ugkthid,
	        attending: false
	      })
	      user.save().then(user => cb(user))
  		})
		} else {
	    cb(user)
	  }
  })
};
var User = mongoose.model('User', userSchema)

var logSchema = new mongoose.Schema({
	opened_at: Date,
	closed_at: Date,
  question: String,
  participants: Number,
  attending: Number,
  result: [{ alternative: { content: String, id: Number }, votes: Number }]
})
var Log = mongoose.model('Log', logSchema)

module.exports = {
  User,
  Log
}
