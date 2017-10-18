import React, { Component } from 'react'
import Header from '../Header/Header'
import moment from 'moment'

class Log extends Component { 
  render() {
    const {log} = this.props
    return ( 
      <div>
        <Header title="Historik" />
        <div id="content">
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Öppnad</th>
                <th>Stängd</th>
                <th>Fråga</th>
                <th>Deltagande</th>
                <th>Resultat</th>
              </tr>
            </thead>
            <tbody>
              { log.map(entry => (
                <tr key={ JSON.stringify(entry) }>
                  <td>{ moment(entry.opened_at).format('YYYY-MM-DD HH:mm:ss') }</td>
                  <td>{ moment(entry.closed_at).format('YYYY-MM-DD HH:mm:ss') }</td>
                  <td>{ entry.question }</td>
                  <td>{ entry.participants }/{ entry.attending }</td>
                  <td>
                    <ul>
                      { entry.result ? entry.result.map(row => (
                        <li key={ JSON.stringify(row) }>{ row.votes }: { row.alternative.content }</li>
                      )) : '' }
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

}

export default Log;
