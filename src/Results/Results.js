import React, { Component } from 'react'

class Results extends Component {
	render() {
		const {question, alternatives, votes} = this.props
		return (
			<div>
				<h1>{ question }</h1>
	            <ul className="results">
	              { alternatives.map((alternative, index) => (
	                <li key={JSON.stringify(alternative)}>
	                  <div className="theme-color bar-label">{ alternative.content } ({ votes[index] })</div>
	                  <div className="bar-container">
	                    <div className="bar lighten-3" style={{width: (votes.reduce((a,b) => (a+b), 0) > 0 ? (votes[index] / votes.reduce((a,b) => Math.max(a,b), 0)) : 0) * 100 + '%'}}></div>
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