import {Component} from 'react'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import JobItem from '../JobItem'
import Header from '../Header'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const apiJobsStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    profileDetails: [],
    apiStatus: apiStatusConstants.initial,
    jobDetails: [],
    checkBoxInputs: [],
    radioInput: '',
    searchInput: '',
    apiJobsStatus: apiJobsStatusConstants.initial,
  }

  componentDidMount() {
    this.onGetProfileDetails()
    this.getJobItemsList()
  }

  onGetRadioOption = event => {
    this.setState({radioInput: event.target.id}, this.getJobItemsList)
  }

  onChangeCheckboxInput = event => {
    const {checkBoxInputs} = this.state
    const inputNotInList = checkBoxInputs.filter(
      eachItem => eachItem === event.target.id,
    )
    if (inputNotInList.length === 0) {
      this.setState(
        prevState => ({
          checkBoxInputs: [...prevState.checkBoxInputs, event.target.id],
        }),
        this.getJobItemsList,
      )
    } else {
      const filteredData = checkBoxInputs.filter(
        eachItem => eachItem !== event.target.id,
      )
      this.setState(
        prevState => ({
          checkBoxInputs: filteredData,
        }),
        this.getJobItemsList,
      )
    }
  }

  onGetProfileDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')

    const profileOptions = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const profileResponse = await fetch(
      'https://apis.ccbp.in/profile',
      profileOptions,
    )
    if (profileResponse.ok === true) {
      const profileData = [await profileResponse.json()]
      console.log(profileData)
      const profileDataList = profileData.map(eachItem => ({
        name: eachItem.profile_details.name,
        profileImageUrl: eachItem.profile_details.profile_image_url,
        shortBio: eachItem.profile_details.short_bio,
      }))

      this.setState({
        profileDetails: profileDataList,
        responseSuccess: true,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  getJobItemsList = async () => {
    const {checkBoxInputs, radioInput, searchInput} = this.state
    this.setState({apiJobsStatus: apiJobsStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(
      `https://apis.ccbp.in/jobs?employment_type=${checkBoxInputs}&minimum_package=${radioInput}&search=${searchInput}`,
      options,
    )

    if (response.ok === true) {
      const data = await response.json()

      const fetchedJobDetails = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        packagePerAnnum: eachJob.package_per_annum,
        location: eachJob.location,
        rating: eachJob.rating,
        title: eachJob.title,
      }))

      console.log(fetchedJobDetails)
      this.setState({
        jobDetails: fetchedJobDetails,
        apiJobsStatus: apiJobsStatusConstants.success,
      })
    } else {
      this.setState({apiJobsStatus: apiJobsStatusConstants.failure})
    }
  }

  getJobDetailsView = () => {
    const {jobDetails} = this.state
    const noJobs = jobDetails.length === 0
    return noJobs ? (
      <div className="no-jobs-con">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="no-job-img"
        />
        <h1 className="no-job-heading">No Jobs Found</h1>
        <p className="no-jobs-text">
          We could not find any jobs. Try other filters
        </p>
      </div>
    ) : (
      <ul className="jobs-con">
        {jobDetails.map(eachItem => (
          <JobItem jobItemsList={eachItem} key={eachItem.id} />
        ))}
      </ul>
    )
  }

  getLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  getProfileFailureView = () => (
    <div className="profile-failure-view">
      <button
        type="button"
        className="failure-button"
        onClick={this.onGetProfileDetails}
      >
        Retry
      </button>
    </div>
  )

  getProfileDetailsView = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails[0]

    return (
      <div className="profile-con">
        <img src={profileImageUrl} alt="profile" className="profile-img" />
        <h1 className="profile-name">{name}</h1>
        <p className="bio">{shortBio}</p>
      </div>
    )
  }

  renderProfileStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.getProfileDetailsView()
      case apiStatusConstants.inProgress:
        return this.getLoadingView()
      case apiStatusConstants.failure:
        return this.getProfileFailureView()
      default:
        return null
    }
  }

  getJobFailureView = () => (
    <div className="no-jobs-con">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="no-job-img"
      />
      <h1 className="no-job-heading">OOPS! Something Went Wrong</h1>
      <p className="no-jobs-text">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="failure-button"
        onClick={this.getJobItemsList}
      >
        Retry
      </button>
    </div>
  )

  renderJobStatus = () => {
    const {apiJobsStatus} = this.state

    switch (apiJobsStatus) {
      case apiJobsStatusConstants.success:
        return this.getJobDetailsView()
      case apiJobsStatusConstants.inProgress:
        return this.getLoadingView()
      case apiJobsStatusConstants.failure:
        return this.getJobFailureView()
      default:
        return null
    }
  }

  onGetSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onSubmitSearchInput = () => {
    this.getJobItemsList()
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobItemsList()
    }
  }

  render() {
    const {checkBoxInputs, radioInput, searchInput} = this.state

    return (
      <>
        <Header />
        <div className="job-container">
          <div className="profile-employment-section">
            {this.renderProfileStatus()}
            <hr />
            <ul className="employment-section">
              <h1 className="employment-heading">Type of Employment</h1>

              {employmentTypesList.map(eachType => (
                <li className="type-con" key={eachType.employmentTypeId}>
                  <input
                    type="checkbox"
                    id={eachType.employmentTypeId}
                    className="checkbox"
                    onChange={this.onChangeCheckboxInput}
                    value={checkBoxInputs}
                  />
                  <label
                    className="employment-label"
                    htmlFor={eachType.employmentTypeId}
                  >
                    {eachType.label}
                  </label>
                </li>
              ))}
            </ul>

            <ul className="employment-section">
              <h1 className="employment-heading">Salary Range</h1>

              {salaryRangesList.map(eachSalary => (
                <li className="type-con" key={eachSalary.salaryRangeId}>
                  <input
                    id={eachSalary.salaryRangeId}
                    type="radio"
                    className="checkbox"
                    onChange={this.onGetRadioOption}
                    value={radioInput}
                  />
                  <label
                    className="employment-label"
                    htmlFor={eachSalary.salaryRangeId}
                  >
                    {eachSalary.label}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div className="job-details-con">
            <div className="search-con">
              <input
                type="search"
                className="search-bar"
                placeholder="search"
                onChange={this.onGetSearchInput}
                onKeyDown={this.onEnterSearchInput}
                value={searchInput}
              />
              <button
                className="search-icon-btn"
                type="button"
                data-testid="searchButton"
                onClick={this.onSubmitSearchInput}
              >
                <BsSearch size="24" color="#cbd5e1" />
              </button>
            </div>
            <ul>{this.renderJobStatus()}</ul>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
