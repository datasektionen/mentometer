import React, { Component } from 'react'
import Header from '../Header/Header'

class Other extends Component {
  constructor(props) {
    super(props);
    this.state = {
      colors: [props.theme]
    }

    fetch('https://aurora.datasektionen.se/api/colors')
      .then(x => x.json())
      .then(x => this.setState({ colors: x }))
  }
  render() {
    const changeColor = (e) => {
      this.props.changeColor(e.target.value)
    }
    const { colors } = this.state
    return ( 
      <div>
        <Header title="Annat" />
        <div id="content">
          <p>Mentometersystemet byggdes under ett SM och en pub. Så ta det för vad det är. Rapportera gärna problem och idéer här: <a href="https://github.com/datasektionen/mentometer/issues" target="_blank" rel="noopener noreferrer">github.com/datasektionen/mentometer/issues</a>. Om du är nyfiken på källkoden eller vill bidra finns den här: <a href="https://github.com/datasektionen/mentometer" target="_blank" rel="noopener noreferrer">github.com/datasektionen/mentometer</a>.</p>
          <h1>Färg</h1>
          <p>Om du vill sätta lite färg på vardagen, eller i alla fall SM, så kan du ändra färgen nedanför. Det används mest för att testa ytterligare ett system, nämligen den eminenta top-baren här ovanför. Färgen ändras bara för dig. Alla andra får se den fula vanliga.</p>
          <div className="select" onChange={changeColor}>
            <select defaultValue={this.props.theme}>
              {
                colors.map(x => (
                  <option key={x} value={x}>{x.charAt(0).toUpperCase() + x.slice(1).replace('-', ' ')}</option>
                ))
              }
            </select>
          </div>
        </div>
      </div>
    )
  }

}

export default Other;
