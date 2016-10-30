import {connect} from 'react-redux'
import {addMessage, removeMessage} from '../actions/SuccessActions'
import Success from './Success'

function mapDispatchToProps(dispatch) {
  return {
    addMessage(message) {
      dispatch(addMessage(message))
    },
    removeMessage(message) {
      dispatch(removeMessage(message))
    }
  }
}

function mapStateToProps(store) {
  return {
    messages: store.get('success').toJS()
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Success)
