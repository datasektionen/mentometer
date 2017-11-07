import React, { Component } from 'react'
import './Admin.css'
import Header from '../Header/Header'
import Results from '../Results/Results'

class Admin extends Component {
  render() {
    const { question, alternatives, open } = this.props
    const dropAlternative = (e, alternative) => {
      console.log('Dropping', alternative)
      this.props.socket.emit('drop-alternative', alternative)
    }
    const updateAlternative = (e, alternative) => {
      var alts = this.props.alternatives
      alts[alts.indexOf(alternative)].content = e.target.value
      this.props.socket.emit('alternatives', alts)
    }
    const newAlternative = (e) => {
      e.preventDefault()
      this.props.socket.emit('new-alternative', {})
    }
    const syncQuestion = (e) => {
      e.preventDefault()
      this.props.socket.emit('question', e.target.value)
    }
    const yesNo = (e) => {
      e.preventDefault()
      this.props.socket.emit('alternatives', [])
      this.props.socket.emit('new-alternative', { content: 'Ja' })
      this.props.socket.emit('new-alternative', { content: 'Nej' })
      this.props.socket.emit('new-alternative', { content: 'Blankt' })
    }
    const bifall = (e) => {
      e.preventDefault()
      this.props.socket.emit('alternatives', [])
      this.props.socket.emit('new-alternative', { content: 'Bifall' })
      this.props.socket.emit('new-alternative', { content: 'Avslag' })
      this.props.socket.emit('new-alternative', { content: 'Blankt' })
    }
    const yesNoQuestion = (e) => {
      e.preventDefault()
      this.props.socket.emit('question', 'Ja, nej eller blank röst?')
      yesNo(e)
    }
    const bifallQuestion = (e) => {
      e.preventDefault()
      this.props.socket.emit('question', 'Bifalla, avslå eller rösta blankt?')
      bifall(e)
    }
    const openVoting = (e) => {
      e.preventDefault()
      this.props.socket.emit('open', true)
    }
    const closeVoting = (e) => {
      e.preventDefault()
      this.props.socket.emit('open', false)
    }
    const play = (e) => {
      e.preventDefault()
      this.props.socket.emit('music', true)
    }
    const pause = (e) => {
      e.preventDefault()
      this.props.socket.emit('music', false)
    }
    if (!this.props.admin) {
      return (
        <div>
          <Header title="Omröstning" />
          <div id="content">
            <p>Du måste vara inloggad som Drek för att kunna hantera frågor.</p>
          </div>
        </div>
      )
    }
    return ( 
      <div>
        <Header title="Omröstning" action={ open ? {str: 'Stäng', onClick: closeVoting} : {str: 'Öppna', onClick: openVoting}} />
        <div id="content">
          <button className="theme-color btn-color" onClick={play}>Spela musik</button> &nbsp;
          <button className="theme-color btn-color" onClick={pause}>Avbryt musik</button>
          <Results {...this.props} {...this.state} />
          <br />
          { !open ? (
          <div>
            <h1>Ändra</h1>
            <div style={{ float: 'right' }}>
              ...eller: <button className="theme-color btn-color" onClick={yesNoQuestion}>Ja, nej eller blank röst?</button> &nbsp; <button className="theme-color btn-color" onClick={bifallQuestion}>Bifalla, avslå eller rösta blankt?</button><br /><br />
            </div>
            <input style={{maxWidth:'500px'}} type="text" value={ question } onChange={ syncQuestion } />
            
            <h3>Alternativ</h3>
            <div style={{ float: 'right' }}>
              ..eller: <button className="theme-color btn-color" onClick={yesNo}>Ja / Nej / Blankt</button> &nbsp; <button className="theme-color btn-color" onClick={bifall}>Bifall / Avslag / Blankt</button><br />
            </div>
            <div style={{ maxWidth:'500px' }}>
            <ul className="alternatives-admin">
              { alternatives.map((alternative, index) => (
                <li key={JSON.stringify(alternative)}>
                  <input type="text" onBlur={e => updateAlternative(e, alternative)} defaultValue={ alternative.content } />
                  <button onClick={e => dropAlternative(e, alternative)} tabIndex={index + 1} className="button delete theme-color">Ta bort</button>
                </li>
              )) }
            </ul>
            </div>
            <br />
            <button onClick={newAlternative} className="primary-action theme-color btn-color">Nytt alternativ</button>
          </div>
          ) : false }
        </div>
      </div>
    )
  }

}

export default Admin;
