import React, { Component } from 'react'
import './App.css'
import { Switch, Route, Redirect, Link } from 'react-router-dom'
import Vote from './Vote/Vote'
import Users from './Users/Users'
import Admin from './Admin/Admin'
import Log from './Log/Log'
import Other from './Other/Other'
import io from 'socket.io-client'
import Methone from 'methone'

class App extends Component {

  constructor(props) {
    super(props)

    let theme = localStorage.getItem('theme')
    if (!theme) {
      theme = window.THEME_COLOR
    }
    if (!theme || theme === '%REACT_APP_THEME_COLOR%') {
      theme = 'red'
    }

    if (!localStorage.getItem('toggleMusic')) {
      localStorage.setItem('toggleMusic', true)
    }

    this.state = {
      question: 'Ansluter...',
      alternatives: ['Det verkar ta lång tid...'],
      status: '',
      token: localStorage.getItem('token'),
      socket: io(process.env.REACT_APP_WS_URL, {
        query: 'token=' + localStorage.getItem('token')
      }),
      votes: [],
      admin: false,
      open: false,
      users: [],
      theme: theme,
      methoneLinks: [
        <Link to="/">Rösta</Link>,
        <Link to="/other">Annat</Link>
      ] ,
      log: []
    }

    this.state.socket.on('error', function() {
      if (this.state && this.state.token !== localStorage.getItem('token')) {
        this.setState({ token: localStorage.getItem('token') })
      } else {
        window.location = `https://login2.datasektionen.se/login?callback=${encodeURIComponent(window.location.origin)}/token/`
      }
    });

    this.state.socket.on('question', newQuestion => {
      this.setState(({ question }) => ({ question: question.startsWith(newQuestion) ? question : newQuestion }))
    })

    this.state.socket.on('alternatives', alternatives => {
      this.setState({ alternatives })
    })

    this.state.socket.on('status', status => {
      this.setState({ status })
    })

    this.state.socket.on('votes', votes => {
      this.setState({ votes })
    })

    this.state.socket.on('admin', admin => {
      this.setState({
        admin: admin,
        methoneLinks: !admin ? this.state.methoneLinks : [
          <Link to="/">Rösta</Link>,
          <Link to="/admin">Omröstning</Link>,
          <Link to="/users">Användare</Link>,
          <Link to="/log">Historik</Link>,
          <Link to="/other">Annat</Link>
        ]
      })
    })

    this.state.socket.on('music', state => {
      let allowMusic = localStorage.getItem('toggleMusic') == "true"
      if (state && allowMusic) {

        
        const audio = new Audio('/silja.mp3')
        if (this.state.audio) {
          this.state.audio.pause()
          this.state.audio.currentTime = 0
          this.state.audio.play()
        } else {
          audio.play()
          this.setState({audio: audio})
        }
      } else if (this.state.audio) {
        this.state.audio.pause()
        this.state.audio.currentTime = 0
      }
      this.setState({ playing: state })
    })

    this.state.socket.on('open', open => {
      this.setState({ open })
    })

    this.state.socket.on('log', log => {
      this.setState({ log: log })
    })

    this.state.socket.on('users', users => {
      users.sort((a,b) => {
        if (a.attending !== b.attending) {
          return b.attending ? 1 : -1
        }
        if (a.first_name === b.first_name) {
          return a.last_name < b.last_name ? -1 : a.last_name > b.last_name
        }
        return a.first_name < b.first_name ? -1 : a.first_name > b.first_name
      })
      this.setState({ users: users })
    })

    this.syncQuestion = this.syncQuestion.bind(this)
  }

  syncQuestion(question) {
    this.setState({question})
    this.state.socket.emit('question', question)
  }

  render() {
    const changeColor = (color) => {
      localStorage.setItem('theme', color)
      this.setState({
        theme: color
      })
    }

    return (
      <div id="application" className={this.state.theme}>
        <Methone config={{ system_name: "mentometer", color_scheme: this.state.theme.replace('-', '_'), links: this.state.methoneLinks }} />
        <Switch>
          <Route exact path='/' render={match => <Vote  {...this.props} {...this.state} />} />
          <Route exact path='/users' render={match => <Users  {...this.props} {...this.state} />} />
          <Route exact path='/admin' render={match => <Admin  {...this.props} {...this.state} syncQuestion={this.syncQuestion} />} />
          <Route exact path='/log' render={match => <Log  {...this.props} {...this.state} />} />
          <Route exact path='/other' render={match => <Other  {...this.props} {...this.state} changeColor={changeColor} />} />
          <Route exact path='/login' render={match => {window.location = `https://login2.datasektionen.se/login?callback=${encodeURIComponent(window.location.origin)}/token/` }} />} />
          <Route path='/token/:token' render={({match}) => {
            localStorage.setItem('token', match.params.token)
            return <Redirect to='/' />
          }} />
        </Switch>
      </div>
    )
  }

}

export default App;
