import {act, cleanup, render, RenderResult, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {ScaleQuestion} from '@typedefs/surveys'
import Likert from './Scale'

const QUESTION: ScaleQuestion = {
  type: 'simpleQuestion',
  identifier: 'simpleQ3',
  nextStepIdentifier: 'followupQ',
  title: 'How much do you like apples?',
  detail: 'Description to show',
  uiHint: 'likert',
  inputItem: {
    type: 'integer',
    formatOptions: {
      maximumLabel: 'Very much',
      maximumValue: 7,
      minimumLabel: 'Not at all',
      minimumValue: 1,
    },
  },
}

function setUp(step: ScaleQuestion = QUESTION) {
  const user = userEvent.setup()
  const component = render(<Likert step={step} onChange={step => onChange(step)} />)
  const buttons = {
    setMinVal: component.getByRole('button', {name: /min/i}),
    setMaxVal: component.getByRole('button', {name: /max /i}),
  }
  const inputs = {
    setMinLabel: screen.getByRole('textbox', {name: /min/i}),
    setMaxLabel: screen.getByRole('textbox', {name: /max/i}),
  }

  return {user, component, buttons, inputs}
}
const onChange = jest.fn()
afterEach(cleanup)

test('show the setting correctly', async () => {
  const {buttons, inputs} = setUp()
  expect(buttons.setMinVal).toHaveTextContent('1')
  expect(buttons.setMaxVal).toHaveTextContent('7')
  expect(inputs.setMinLabel).toHaveValue('Not at all')
  expect(inputs.setMaxLabel).toHaveValue('Very much')
})

test('display a correct UI for likert and slider scale', async () => {
  //the max value choices are different
  //do likert
  let {component, buttons, user} = setUp()
  const getMaxForLikert = (component: RenderResult) => component.queryByRole('option', {name: /7/i})
  const getMaxForSlider = (component: RenderResult) => component.queryByRole('option', {name: /100/i})
  await act(async () => await user.click(buttons.setMaxVal))
  expect(getMaxForLikert(component)).toBeInTheDocument()
  expect(getMaxForSlider(component)).not.toBeInTheDocument()

  //do slider
  const setupResult = setUp({...QUESTION, uiHint: 'slider'})
  await act(async () => await setupResult.user.click(setupResult.buttons.setMaxVal))
  expect(getMaxForLikert(setupResult.component)).not.toBeInTheDocument()
  expect(getMaxForSlider(setupResult.component)).toBeInTheDocument()
})

test('update the setting correctly', async () => {
  const expectInputs = [
    {
      ...QUESTION.inputItem,
      formatOptions: {
        ...QUESTION.inputItem.formatOptions,
        minimumValue: 0,
      },
    },
    {
      ...QUESTION.inputItem,
      formatOptions: {
        ...QUESTION.inputItem.formatOptions,

        maximumValue: 5,
      },
    },
    {
      ...QUESTION.inputItem,
      formatOptions: {
        ...QUESTION.inputItem.formatOptions,
        minimumLabel: QUESTION.inputItem.formatOptions.minimumLabel + 'T',
      },
    },
    {
      ...QUESTION.inputItem,
      formatOptions: {
        ...QUESTION.inputItem.formatOptions,
        maximumLabel: QUESTION.inputItem.formatOptions.maximumLabel + 'X',
      },
    },
  ]

  const {component, buttons, inputs, user} = setUp()
  expect(buttons.setMinVal).toHaveTextContent('1')
  //st min value
  await act(async () => await user.click(buttons.setMinVal))

  let item = component.getByRole('option', {name: /0/i})
  await act(async () => await user.click(item))
  expect(onChange).toHaveBeenCalledWith({
    ...QUESTION,
    inputItem: expectInputs[0],
  })
  //set max value
  await act(async () => await user.click(buttons.setMaxVal))
  item = component.getByRole('option', {name: /5/i})
  await act(async () => await user.click(item))
  expect(onChange).toHaveBeenCalledWith({
    ...QUESTION,
    inputItem: expectInputs[1],
  })

  //set min label
  await act(async () => await user.type(inputs.setMinLabel, 'T'))

  expect(onChange).toHaveBeenCalledWith({
    ...QUESTION,
    inputItem: expectInputs[2],
  })
  //set max label
  await act(async () => await user.type(inputs.setMaxLabel, 'X'))

  expect(onChange).toHaveBeenCalledWith({
    ...QUESTION,
    inputItem: expectInputs[2],
  })
})
