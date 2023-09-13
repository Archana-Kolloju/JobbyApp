import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', showSubmitError: false, errorMsg: ''}

  submitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  submitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitLoginForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()

    console.log(data)
    if (response.ok === true) {
      this.submitSuccess(data.jwt_token)
    } else {
      this.submitFailure(data.error_msg)
    }
  }

  onEnterUsernameInput = event => {
    this.setState({username: event.target.value})
  }

  onEnterPasswordInput = event => {
    this.setState({password: event.target.value})
  }

  renderInputUsernameField = () => {
    const {username} = this.state
    return (
      <div className="form-input">
        <label htmlFor="username" className="label">
          USERNAME
        </label>
        <input
          type="text"
          id="username"
          placeholder="Username"
          value={username}
          onChange={this.onEnterUsernameInput}
          className="input"
        />
      </div>
    )
  }

  renderInputPasswordField = () => {
    const {password} = this.state
    return (
      <div className="form-input">
        <label htmlFor="password" className="label">
          PASSWORD
        </label>
        <input
          id="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={this.onEnterPasswordInput}
          className="input"
        />
      </div>
    )
  }

  render() {
    const {showSubmitError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-bg-con">
        <div className="Login-con">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website-logo"
            className="logo"
          />
          <form className="form" onSubmit={this.onSubmitLoginForm}>
            <div>{this.renderInputUsernameField()}</div>
            <div> {this.renderInputPasswordField()}</div>
            <button type="submit" className="login-btn">
              Login
            </button>
            <div>
              {showSubmitError ? <p className="error">*{errorMsg}</p> : ''}
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default Login
