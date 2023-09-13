import {Component} from 'react'
import {Link} from 'react-router-dom'
import {IoLocationSharp} from 'react-icons/io5'
import {AiFillStar} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'
import './index.css'

class JobItem extends Component {
  render() {
    const {jobItemsList} = this.props
    const {
      companyLogoUrl,
      employmentType,
      id,
      jobDescription,
      packagePerAnnum,
      location,
      rating,
      title,
    } = jobItemsList

    return (
      <Link to={`/jobs/${id}`} className="nav-link">
        <li className="job-items-con">
          <div className="job-header-con">
            <div className="job-logo-con">
              <img
                src={companyLogoUrl}
                alt="company logo"
                className="company-logo"
              />
              <div>
                <h1 className="title">{title}</h1>
                <div className="rating-con">
                  <AiFillStar size="27" color="#fbbf24" />
                  <p className="rating">{rating}</p>
                </div>
              </div>
            </div>
            <div className="job-details">
              <div className="job-details-text">
                <div className="job-details-2">
                  <IoLocationSharp size="29" color="#ffffff" />
                  <p className="location-text">{location}</p>
                </div>
                <div className="job-details-2">
                  <BsBriefcaseFill size="29" color="#ffffff" />
                  <p className="location-text">{employmentType}</p>
                </div>
              </div>
              <p className="package">{packagePerAnnum}</p>
            </div>
          </div>
          <hr className="hr" />
          <h1 className="description-title">Description</h1>
          <p className="description-text">{jobDescription}</p>
        </li>
      </Link>
    )
  }
}

export default JobItem
