import {IoLocationSharp} from 'react-icons/io5'
import {BsBriefcaseFill} from 'react-icons/bs'
import {AiFillStar} from 'react-icons/ai'
import './index.css'

const SimilarJobs = props => {
  const {similarJobData} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    rating,
    title,
  } = similarJobData

  return (
    <li className="similar-job-li-con">
      <div className="img-job-title-con">
        <img
          className="company-job-logo"
          src={companyLogoUrl}
          alt=" similar job company logo"
        />
        <div className="title-job-rating-con">
          <h1 className="title-job-heading">{title}</h1>
          <div className="star-job-rating-con">
            <AiFillStar className="star-job-icon" />
            <p className="rating-job-text">{rating}</p>
          </div>
        </div>
      </div>
      <div className="second-part-job-con">
        <h1 className="description-job-heading">Description</h1>
        <p className="description-job-para">{jobDescription}</p>
      </div>
      <div className="location-job-details-type-con">
        <div className="location-job-icon-location-con">
          <IoLocationSharp className="location-job-icon" />
          <p className="location-job">{location}</p>
        </div>
        <div className="employment-job-type-icon">
          <BsBriefcaseFill size="29" color="#ffffff" />
          <p className="job-type">{employmentType}</p>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobs
