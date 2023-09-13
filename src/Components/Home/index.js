import {Link} from 'react-router-dom'
import Header from '../Header'

import './index.css'

const Home = () => (
  <div className="home-bg-con">
    <Header />
    <div className="home-con">
      <div className="home-content">
        <h1 className="home-heading">
          Find The Job That <br /> Fits Your Life
        </h1>

        <p className="home-text">
          Millions of people are searching for jobs, salary <br />
          information, company reviews. Find the job that fits your <br />
          abilities and potential.
        </p>

        <Link to="/jobs" className="nav-link">
          <button type="button" className="job-route-btn">
            Find Jobs
          </button>
        </Link>
      </div>
    </div>
  </div>
)

export default Home
