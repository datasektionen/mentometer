import React, { Component } from 'react'
import './Users.css'
import Header from '../Header/Header'

class Users extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      zfinger: [],
      activeIndex: 0,
      zfingerSearchText: '',
    }
  }

  searchZfinger(e) {
    this.setState({ zfingerSearchText: e.target.value })
    if (e.target.value.length < 3) {
        this.setState({ zfinger: [] })
        return
    }
    fetch('https://hodis.datasektionen.se/users/' + e.target.value)
      .then(x => x.json())
      .then(res => {
        this.setState({ zfinger: res.slice(0,10) })
      })
  }

  addUserExact(e) {
    e.preventDefault()
    this.props.socket.emit('add-user-exact', this.state.zfingerSearchText)
    this.setState({ zfinger: [], zfingerSearchText: '' })
  }

  handleKeyDown(event) {
    const { zfinger, activeIndex } = this.state
    if (event.keyCode === 9 || event.keyCode === 40) { //tab or down 
      const newActive = (activeIndex + 1) % (zfinger.length + 1)
      this.setState({activeIndex: newActive})
      event.preventDefault()
      event.stopPropagation()
    } else if (event.keyCode === 38) { // up
      const newActive = (activeIndex + zfinger.length) % (zfinger.length + 1)
      this.setState({activeIndex: newActive});
      event.preventDefault();
      event.stopPropagation();
    } else if (event.keyCode === 13) { // enter
      if (activeIndex === zfinger.length) {
        this.addUserExact(event)
      } else {
        this.props.socket.emit('add-user', { ugkthid: zfinger[activeIndex].ugKthid })
        this.setState({ zfinger: [], zfingerSearchText: '' })
      }
    }
  }

  render() {
    if (!this.props.admin) {
      return (
        <div>
          <Header title="Användare" />
          <div id="content">
            <p>Du måste vara inloggad som Drek för att kunna hantera användare.</p>
          </div>
        </div>
      )
    }
    const { zfinger, activeIndex, zfingerSearchText } = this.state
    const { users } = this.props
    const switchAttendingState = (user) => {
      console.log('Attending user')
      user.attending = !user.attending
      this.props.socket.emit('update-user', { ugkthid: user.ugkthid, attending: user.attending })
    }
    const addUser = (e, user) => {
      e.preventDefault()
      this.props.socket.emit('add-user', { ugkthid: user.ugKthid })
      this.setState({ zfinger: [], zfingerSearchText: '' })
    }

    return (
      <div onKeyDown={this.handleKeyDown.bind(this)}>
        <Header title="Användare" />
        <div id="content">
          <input type="text" placeholder="zFinger-sök på namn eller e-post" value={zfingerSearchText} onChange={this.searchZfinger.bind(this)} />
          <ul className="zfinger">
          { zfinger.map((user, idx) => (
            <li key={JSON.stringify(user)} className={ idx === activeIndex ? 'active' : '' } onClick={e => addUser(e, user)}>
              <span className="name"><div className="crop" style={{ backgroundImage: `url(https://zfinger.datasektionen.se/user/${user.uid}/image)` }}></div>{user.cn} ({user.uid})</span>
            </li>
          )) }
          { zfingerSearchText ?
            <li className={ zfinger.length === activeIndex ? 'active' : '' } onClick={this.addUserExact.bind(this)}>
              <span className="name"><div className="crop" style={{ backgroundImage: `url(https://zfinger.datasektionen.se/user/${zfingerSearchText}/image)` }}></div>Lägg till med exakt KTH-användarnamn "{ zfingerSearchText }"</span>
            </li>
            : false
          }
          </ul>
          <h1>{ users.filter((x) => x.attending === true).length } närvarande just nu</h1>
          <ul className="users">
            { users.map(user => (
              <li key={ JSON.stringify(user) }>
                <div className="checkbox">
                  <input type="checkbox" onChange={e => switchAttendingState(user)} defaultChecked={user.attending} id={user._id} />
                  <label htmlFor={user._id}>
                    <span className="name">{user.first_name} {user.last_name}</span>
                  </label>
                </div>
                <div className="clear"></div>
              </li>
            )) }
          </ul>
        </div>
      </div>
    )
  }

}

export default Users;
