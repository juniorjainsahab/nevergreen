import React from 'react'
import {mount, shallow} from 'enzyme'
import {Input} from '../../../../src/client/common/forms/Input'
import {Password} from '../../../../src/client/common/forms/Password'

describe('<Password/>', () => {

  const DEFAULT_PROPS = {
    children: ''
  }

  it('should have the password type by default', () => {
    const props = {...DEFAULT_PROPS}
    const wrapper = shallow(<Password {...props} />)
    expect(wrapper.find(Input).prop('type')).toEqual('password')
  })

  it('should allow the password to be shown', () => {
    const props = {...DEFAULT_PROPS}
    const wrapper = mount(<Password {...props} />)
    wrapper.find('button').simulate('click')
    expect(wrapper.find(Input).prop('type')).toEqual('text')
  })
})