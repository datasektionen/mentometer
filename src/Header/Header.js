import React, { Component } from 'react'
import './Header.css'

class Header extends Component {
  render() {
    return (
      <header>
        <div className="header-inner">
          <div className="row">
            <div className="header-left col-md-2"></div>
            <div className="col-md-8">
              <h2>{ this.props.title }</h2>
            </div>
            <div className="header-right col-md-2">
            { this.props.action ?
              (<button className="primary-action" onClick={this.props.action.onClick}>{ this.props.action.str }</button>) :
              (<span></span>)
            }
            </div>
          </div>
        </div>
      </header>
    )
  }

}

export default Header;
