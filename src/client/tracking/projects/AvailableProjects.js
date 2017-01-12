import React, {Component, PropTypes} from 'react'
import AvailableProject from './AvailableProject'
import Messages from '../../common/messages/Messages'
import Text from '../../common/forms/Text'
import Shortcut from '../../common/Shortcut'
import _ from 'lodash'
import './available-projects.scss'

class AvailableProjects extends Component {
  constructor(props) {
    super(props)
    this.state = {filter: null, errors: null, disableButtons: false}
  }

  render() {
    const includeAll = () => {
      this.props.projects
        .filter((project) => !project.removed)
        .forEach((project) => this.props.selectProject(this.props.trayId, project.projectId, true))
    }

    const excludeAll = () => {
      this.props.projects.forEach((project) => {
        this.props.selectProject(this.props.trayId, project.projectId, false)
      })
    }

    const updateFilter = (evt) => {
      if (_.isEmpty(_.trim(evt.target.value))) {
        this.setState({filter: null, errors: null, disableButtons: false})
      } else {
        try {
          const regEx = new RegExp(evt.target.value)
          this.setState({filter: regEx, errors: null, disableButtons: true})
        } catch (e) {
          this.setState({errors: [`Project filter not applied, ${e.message}`]})
        }
      }
    }

    const filteredProjects = this.props.projects.filter((value) => {
      return this.state.filter ? value.name.match(this.state.filter) : true
    })

    const scrollToTop = (e) => {
      this.node.scrollIntoView()
      e.preventDefault()
    }

    return (
      <section className='available-projects' data-locator='available-projects' ref={(node) => this.node = node}>
        <div className='controls'>
          <fieldset className='toggles'>
            <legend className='legend'>Available projects</legend>
            <button className='include-all' onClick={includeAll} disabled={this.state.disableButtons} data-locator='include-all'>
              include all
              <Shortcut hotkeys={[`+ ${this.props.index}`, `= ${this.props.index}`]}/>
            </button>
            <button className='exclude-all' onClick={excludeAll} disabled={this.state.disableButtons}>
              exclude all
              <Shortcut hotkeys={[`- ${this.props.index}`]}/>
            </button>
          </fieldset>
          <div className='project-filter'>
            <Text label='Filter projects' className='project-filter-input' onChange={updateFilter}/>
          </div>
          <Messages type='error' messages={this.state.errors}/>
        </div>
        <ol className='build-items'>
          {
            _.sortBy(filteredProjects, ['name', 'stage']).map((project) => {
              const selected = this.props.selected.includes(project.projectId)
              const selectProject = () => this.props.selectProject(this.props.trayId, project.projectId, !selected)

              return <AvailableProject key={project.projectId} {...project} selected={selected} selectProject={selectProject}/>
            })
          }
        </ol>
        <a className='back-to-top' href='#' onClick={scrollToTop}>back to top</a>
      </section>
    )
  }
}

AvailableProjects.propTypes = {
  index: PropTypes.number.isRequired,
  trayId: PropTypes.string.isRequired,
  projects: PropTypes.arrayOf(PropTypes.shape({
    projectId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    stage: PropTypes.string
  })).isRequired,
  selected: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectProject: PropTypes.func.isRequired
}

export default AvailableProjects