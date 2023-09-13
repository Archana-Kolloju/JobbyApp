import {Link, withRouter} from 'react-router-dom'

import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="nav-bar">
      <img
        src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
        alt="website-logo"
        className="logo"
      />
      <div className="menu-con">
        <Link to="/" className="nav-link">
          <p className="select">Home</p>
        </Link>
        <Link to="/jobs" className="nav-link">
          <p className="select">Jobs</p>
        </Link>
      </div>
      <button type="button" className="logout-btn" onClick={onClickLogout}>
        Logout
      </button>
    </nav>
  )
}

export default withRouter(Header)
