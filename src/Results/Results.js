import React, { Component } from 'react'

class Results extends Component {
	render() {
		const { question, alternatives, votes, open, users } = this.props

		const numVotes = votes.reduce((a, b) => a + b, 0);
		// user.attending is a boolean
		const attending = users.filter(u => u.attending).reduce((a, b) => a + b.attending, 0)
		return (
			<div>
				<h1>{ question }</h1>
				<h3>Antal som röstat: <span style={{color: "black"}}>{numVotes} / {attending}</span></h3>
	            <ul className="results">
	              { alternatives.map((alternative, index) => (
	                <li key={JSON.stringify(alternative)}>
	                  <div className="theme-color bar-label">{ alternative.content } </div>
					  <div className="theme-color bar-label bar-votes">{ open ? "?" : votes[index] }</div>
	                  <div className="bar-container">
						{open ?
							<div className="bar lighten-3" style={{width: "0%"}}></div>
							:
							<div className="bar lighten-3" style={{width: (votes.reduce((a,b) => (a+b), 0) > 0 ? (votes[index] / votes.reduce((a,b) => Math.max(a,b), 0)) : 0) * 100 + '%'}}></div>
						}
	                  </div>
	                  <div className="clear"></div>
	                </li>
	              )) }
	            </ul>
	        </div>
		)
	}
}

export default Results;