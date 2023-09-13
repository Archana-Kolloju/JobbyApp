import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import {IoLocationSharp} from 'react-icons/io5'
import {BsBriefcaseFill} from 'react-icons/bs'
import {BiLinkExternal} from 'react-icons/bi'
import Cookies from 'js-cookie'
import SimilarJobs from '../SimilarJobs'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class AboutJobDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobDetails: [],
    similarJobDetails: [],
  }

  componentDidMount() {
    this.getSelectedJobItem()
  }

  getSelectedJobItem = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(`https://apis.ccbp.in/jobs/${id}`, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedJobDetails = [data.job_details].map(eachItem => ({
        companyWebsiteUrl: eachItem.company_website_url,
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        lifeAtCompany: {
          description: eachItem.life_at_company.description,
          imageUrl: eachItem.life_at_company.image_url,
        },
        packagePerAnnum: eachItem.package_per_annum,
        location: eachItem.location,
        rating: eachItem.rating,
        skills: eachItem.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        })),
        title: eachItem.title,
      }))

      const updatedSimilarJobDetailsData = data.similar_jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: data.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        rating: eachItem.rating,
        title: eachItem.title,
      }))

      console.log(updatedSimilarJobDetailsData)
      console.log(data)

      this.setState({
        jobDetails: updatedJobDetails,
        apiStatus: apiStatusConstants.success,
        similarJobDetails: updatedSimilarJobDetailsData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderJobDetailsSuccessView = () => {
    const {jobDetails, similarJobDetails} = this.state
    if (jobDetails.length >= 1) {
      const {
        companyWebsiteUrl,
        companyLogoUrl,
        employmentType,
        id,
        jobDescription,
        lifeAtCompany,
        packagePerAnnum,
        location,
        rating,
        title,
        skills,
      } = jobDetails[0]
      return (
        <>
          <div className="about-job-container">
            <div className="job-items-con">
              <div className="job-header-con">
                <div className="job-logo-con">
                  <img
                    src={companyLogoUrl}
                    alt="job details company logo"
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
              <div className="description-con">
                <h1 className="description-title">Description</h1>
                <a href={companyWebsiteUrl} className="url">
                  Visit <BiLinkExternal />
                </a>
              </div>
              <p className="description-text">{jobDescription}</p>
              <h1 className="skills-heading">Skills</h1>
              <ul className="skills-con">
                {skills.map(eachItem => (
                  <li className="skill-li-con" key={eachItem.name}>
                    <img
                      className="skill-img"
                      src={eachItem.imageUrl}
                      alt={eachItem.name}
                    />
                    <p className="skill-text">{eachItem.name}</p>
                  </li>
                ))}
              </ul>
              <div className="life-at-company-con">
                <div className="life-at-company-text-con">
                  <h1 className="company">Life at Company</h1>
                  <p className="life-at-company-text">
                    {lifeAtCompany.description}
                  </p>
                </div>
                <img
                  src={lifeAtCompany.imageUrl}
                  className="company-img"
                  alt="life at company"
                />
              </div>
            </div>
            <h1 className="similar-jobs-heading">Similar Jobs</h1>
            <ul className="similar-jobs-ul-con">
              {similarJobDetails.map(eachItem => (
                <SimilarJobs
                  key={eachItem.id}
                  similarJobData={eachItem}
                  employmentType={employmentType}
                />
              ))}
            </ul>
          </div>
        </>
      )
    }
    return null
  }

  renderJobFailureView = () => (
    <div className="job-details-failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="no-job-heading">OOPS! Something Went Wrong</h1>
      <p className="no-jobs-text">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="failure-button"
        onClick={this.getSelectedJobItem}
      >
        Retry
      </button>
    </div>
  )

  renderJobLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetailsSuccessView()
      case apiStatusConstants.failure:
        return this.renderJobFailureView()
      case apiStatusConstants.inProgress:
        return this.renderJobLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="bout-job-con">
        <Header />
        {this.renderJobDetails()}
      </div>
    )
  }
}

export default AboutJobDetails
