import React, {Component, PropTypes} from 'react'
import classNames from 'classnames'
import Header from './header/Header'
import Footer from './footer/Footer'
import Mousetrap from 'mousetrap'
import 'mousetrap/plugins/global-bind/mousetrap-global-bind'
import _ from 'lodash'
import './nevergreen.scss'
import Timer from './common/Timer'

const ONE_SECONDS = 1000
const THREE_SECONDS = 3 * 1000
const TWENTY_FOUR_HOURS = 24 * 60 * 60

class Nevergreen extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.disableFullScreen = _.throttle(this.disableFullScreen, ONE_SECONDS, {trailing: false}).bind(this)
  }

  componentDidMount() {
    this.props.initalise()

    Mousetrap.bindGlobal('esc', () => document.activeElement.blur())
    Mousetrap.bind('?', () => {
      this.props.keyboardShortcut(true)
      this.props.router.push('help')
    })
  }

  componentWillUnmount() {
    Mousetrap.unbind(['?', 'esc'])
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.fullScreenRequested !== this.props.fullScreenRequested) {
      this.props.enableFullScreen(nextProps.fullScreenRequested)
    }
  }

  render() {
    const notificationClassNames = classNames('pop-up-notification', {fullscreen: this.props.isFullScreen})
    const checkVersion = () => this.props.checkForNewVersion(this.props.versionNumber, window.location.hostname)

    const notification = !_.isEmpty(_.trim(this.props.notification)) ?
      <div className={notificationClassNames}>
        <div>
          <span className='icon-notification'/>
          <span className='text-with-icon'>Notification</span>
          <span className='icon-cross pop-up-notification-dismiss' onClick={this.props.dismiss}/>
        </div>
        {this.props.notification}
      </div> : null

    return (
      <main className='nevergreen' onMouseMove={this.disableFullScreen}>
        <Timer onTrigger={checkVersion} interval={TWENTY_FOUR_HOURS}/>
        <Header fullScreen={this.props.isFullScreen}/>
        {notification}
        {this.props.loaded ? this.props.children : null}
        <Footer versionNumber={this.props.versionNumber} versionName={this.props.versionName} versionColour={this.props.versionColour}
                commitHash={this.props.commitHash} fullScreen={this.props.isFullScreen}/>
      </main>
    )
  }

  disableFullScreen() {
    clearTimeout(this.state.fullScreenTimer)
    if (this.props.isFullScreen) {
      this.props.enableFullScreen(false)
    }
    if (this.props.fullScreenRequested) {
      this.setState({fullScreenTimer: setTimeout(() => this.props.enableFullScreen(true), THREE_SECONDS)})
    }
  }
}

Nevergreen.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element
  ]),
  loaded: PropTypes.bool.isRequired,
  versionNumber: PropTypes.string.isRequired,
  versionName: PropTypes.string.isRequired,
  versionColour: PropTypes.string.isRequired,
  commitHash: PropTypes.string.isRequired,
  notification: PropTypes.string,
  initalise: PropTypes.func.isRequired,
  keyboardShortcut: PropTypes.func.isRequired,
  checkForNewVersion: PropTypes.func.isRequired,
  dismiss: PropTypes.func.isRequired,
  router: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  isFullScreen: PropTypes.bool,
  fullScreenRequested: PropTypes.bool,
  enableFullScreen: PropTypes.func.isRequired
}

export default Nevergreen
