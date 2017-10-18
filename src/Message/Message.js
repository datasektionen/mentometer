import React, { Component } from 'react'

class Message extends Component { 
	constructor(props) {
		super(props);
		this.state = {
			delay: 1000,
			visible: true
		}
	}
  	
	componentWillReceiveProps(nextProps) {
    // Reset timer
    this.setTimer()
    this.setState({
    	visible: true,
    	delay: this.props.expire
    })
	}

  componentDidMount() {
      this.setTimer()
  }

  setTimer() {
    // Clear existing timer
    if (this._timer != null) {
    	clearTimeout(this._timer)
    }

    // Hide after delay milliseconds
    this._timer = setTimeout(function() {
      this.setState({visible: false})
      this._timer = null
    }.bind(this), this.state.delay)
  }

  componentWillUnmount() {
    clearTimeout(this._timer)
  }

  render() {
  	const { visible } = this.state
  	const { text } = this.props
    return ( 
      <div className={ 'status lighten-2' + ((visible && text && text.length) ? '' : ' hideit') }>
        <div className="wrapper">
          { text }
        </div>
      </div>
    )
  }

}

export default Message;
