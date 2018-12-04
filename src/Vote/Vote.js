import React, { Component } from 'react'
import './Vote.css'
import Header from '../Header/Header'
import Message from '../Message/Message'

class Vote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusText: [
        '',
        'Din röst togs emot!',
        'Din röst har ändrats!',
        'Du är inte behörig att rösta',
        'Omröstningen är inte öppen'
      ]
    }
  }

  render() {
    if (!this.props.open) {
      return (
        <div>
          <Header title="Mentometer" />
          <div id="content">
            <p>Ingen omröstning är öppen.</p>
          </div>
        </div>
      )
    }

    const { question, status, alternatives, socket } = this.props
    const vote = (e, id) => {
      e.preventDefault()
      socket.emit('vote', { alternative: id })
    }

    return (
      <div>
        <div className="question lighten-1">
          <div className="wrapper">
            { question }
          </div>
        </div>
        <Message text={this.state.statusText[status]} expire="3000" />
        <ul className="alternatives theme-color">
          { alternatives.map((alternative, i) => (
            <li className="lighten-3" key={ alternative.content }>
              <a href="#" onClick={ e => vote(e, alternative.id) } className="lighten-3">{ alternative.content }</a>
            </li>
          )) }
        </ul>
      </div>
    )
  }

}

export default Vote;
