import React from 'react'
import {Input} from '../../../../src/client/common/forms/Input'
import {render} from '../../testHelpers'

it('should apply the read only attribute and display an icon', () => {
  const props = {readOnly: true}
  const {container, queryByText} = render(<Input {...props}>label</Input>)
  expect(container.querySelector('input')).toHaveAttribute('readOnly')
  expect(queryByText('read only')).toBeInTheDocument()
})

// https://ffoodd.github.io/a11y.css/errors.html#namespace
it('should generate an id (that does not start with a number) to associate the label and input correctly', () => {
  const {container} = render(<Input>label</Input>)
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  const labelId = container.querySelector('label').htmlFor
  expect(labelId).toMatch(/i[0-9]/)
  expect(container.querySelector('input')).toHaveAttribute('id', labelId)
})
