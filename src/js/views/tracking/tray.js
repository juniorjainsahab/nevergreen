import React, {Component, PropTypes} from 'react'
import Container from '../general/container'
import Projects from './projects'
import TraySettings from './traySettings'
import Loading from '../general/loading'
import ValidationMessages from '../general/validationMessages'
import Shortcut from '../general/Shortcut'
import moment from 'moment'

class Tray extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showSettings: false,
      hidden: false,
      lastFetched: this._updateLastFetch()
    }
  }

  componentDidMount() {
    const intervalId = setInterval(() => {
      this.setState({lastFetched: this._updateLastFetch()})
    }, 60000)
    this.setState({intervalId})
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId)
  }

  componentWillReceiveProps() {
    this.setState({lastFetched: this._updateLastFetch()})
  }

  render() {
    let subContent

    if (this.state.showSettings) {
      subContent = <TraySettings tray={this.props.tray}
                                 removeTray={this.props.removeTray}
                                 updateTray={this._updateTray.bind(this)}
                                 cancel={this._toggleSettingsView.bind(this)}/>
    } else {
      if (this.props.tray.error) {
        const errorMessages = [
          'Unable to fetch projects because of an error:',
          `${this.props.tray.error.status} - ${this.props.tray.error.message}`
        ]
        subContent = <Loading loading={this.props.tray.fetching}>
          <ValidationMessages messages={errorMessages}/>
        </Loading>
      } else {
        subContent = <Loading loading={this.props.tray.fetching}>
          <Projects index={this.props.index} trayId={this.props.tray.trayId}/>
        </Loading>
      }
    }

    const toggleLabel = this.state.showSettings ? 'Show projects' : 'Show settings'
    const title = this.props.tray.name || this.props.tray.url
    const subTitle = this.props.tray.name ? this.props.tray.url : ''

    return (
      <Container title={title} subTitle={subTitle}>
        <div>
          <div className='tray-sub-bar'>
            <button className='button' onClick={this._toggleSettingsView.bind(this)} title='Toggle settings'>
              <span className={'icon-' + (this.state.showSettings ? 'list' : 'cog') }/>
              <span className='text-with-icon'>{toggleLabel}</span>
              <Shortcut hotkeys={[`p ${this.props.index}`]}/>
            </button>
            <button className='button' onClick={this.props.refreshTray}>
              <span className='icon-loop2'/>
              <span className='text-with-icon'>Refresh tray</span>
              <Shortcut hotkeys={[`r ${this.props.index}`]}/>
            </button>
            <span className='tray-refresh-last-fetch'>last refreshed {this.state.lastFetched} ago</span>
          </div>
          <div>
            {subContent}
          </div>
        </div>
      </Container>
    )
  }

  _toggleSettingsView() {
    this.setState({
      showSettings: !this.state.showSettings
    })

    return false
  }

  _updateLastFetch() {
    if (this.props.tray.timestamp) {
      return moment(this.props.tray.timestamp).fromNow(true)
    }
  }

  _updateTray(trayId, name, url, username, password) {
    this.setState({
      showSettings: false
    })
    this.props.updateTray(trayId, name, url, username, password)
  }
}

Tray.propTypes = {
  index: PropTypes.number.isRequired,
  tray: PropTypes.object.isRequired,
  removeTray: PropTypes.func.isRequired,
  refreshTray: PropTypes.func.isRequired,
  updateTray: PropTypes.func.isRequired
}

export default Tray
