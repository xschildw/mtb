import {DisappearingInput, FakeInput} from '@components/surveys/widgets/SharedStyled'
import {styled} from '@mui/material'
import {latoFont} from '@style/theme'
import {ScaleQuestion} from '@typedefs/surveys'

const StyledContainer = styled('div', {label: 'StyledContainer'})(() => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}))

const SliderThumb = styled('div', {label: 'SliderThumb'})(({theme}) => ({
  width: theme.spacing(3),
  height: theme.spacing(3),
  background: theme.palette.primary.main,
  borderRadius: '50%',
  boxShadow: `0px 1px 4px '#AEB5BC'`,
}))
const ScaleDisplay = styled('div', {label: 'Scale'})<{
  width: number
}>(({width}) => ({
  position: 'relative',
  height: '46px',
  textAlign: 'center',
  width: `${width}px`,
  margin: '0 auto',
}))

const Labels = styled('div', {label: 'labels'})(({theme}) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  margin: theme.spacing(9, -2.5, 0, -2.5),
  '& > *': {
    width: '80px',
    backgroundColor: '#fff',
  },
  '& div:first-of-type, span:first-of-type': {
    textAlign: 'left',
  },
  '& >div:last-of-type,  span:last-of-type ': {
    textAlign: 'right',
    '> input, textarea': {
      textAlign: 'right',
    },
  },
}))

const CircleContainer = styled('div', {label: 'Circle'})<{
  left: number
  cradius: number
}>(({left, cradius}) => ({
  left: `${left}px`,
  top: '-3px',
  textAlign: 'center',
  width: `${cradius * 2}px`,
  position: 'absolute',

  fontWeight: 300,
  fontSize: '24px',
  '&> div.circle': {
    width: `${cradius * 2}px`,
    height: `${cradius * 2}px`,
    borderRadius: '50%',
    marginBottom: '12px',
    background: '#F1F3F5',
    boxShadow: 'inset 0px 1px 4px #AEB5BC',
  },
}))
const LikertLine = styled('div', {label: 'LikertLine'})<{width?: number}>(() => ({
  backgroundColor: ' #EAECEE',
  height: '2px',
  top: '7px',
  width: `95%`,
  position: 'absolute',
  background: ' #EAECEE',
}))

const SliderLine = styled('div', {label: 'LikertLine'})<{width?: number}>(() => ({
  height: '4px',
  top: '11px',
  width: `100%`,
  position: 'absolute',
  background: '#D3D3DB',
  boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.25)',
  borderRadius: '25px',
}))

const StyledMinMaxLabel = styled(DisappearingInput, {
  label: 'StyledMinMaxLabels',
})(({theme}) => ({
  fontFamily: latoFont,
  fontWeight: 400,
  fontSize: '12px',
  color: '#2A2A2A',
  width: '100%',
  '& > input, textarea': {
    padding: theme.spacing(0.125, 1),
  },
}))

const MinMaxLabel: React.FunctionComponent<{
  step: ScaleQuestion
  type: 'MIN' | 'MAX'

  onChange: (iItem: ScaleQuestion) => void
}> = ({step, type, onChange}) => {
  const {minimumLabel, maximumLabel} = step.inputItem.formatOptions
  const value = type === 'MIN' ? minimumLabel : maximumLabel

  const CONFIG = {
    MIN: {
      label: 'Min Label',
      labelId: 'minLbl',
    },
    MAX: {
      label: 'Max Label',
      labelId: 'maxLbl',
    },
  }

  const onUpdate = (value: string) => {
    const inputItem = {
      ...step.inputItem,

      formatOptions: {
        ...step.inputItem.formatOptions,
        minimumLabel: type === 'MIN' ? value : step.inputItem.formatOptions.minimumLabel,
        maximumLabel: type === 'MAX' ? value : step.inputItem.formatOptions.maximumLabel,
      },
    }
    onChange({...step, inputItem})
  }

  return (
    <StyledMinMaxLabel
      area-label={CONFIG[type].label}
      sx={{fontWeight: 'bold'}}
      id={CONFIG[type].label}
      value={value}
      multiline={true}
      placeholder={CONFIG[type].label}
      onChange={e => onUpdate(e.target.value)}
    />
  )
}

const Scale: React.FunctionComponent<{
  step: ScaleQuestion
  onChange: (step: ScaleQuestion) => void
}> = ({step, onChange}) => {
  const circleRadius = 11
  const {minimumValue = 0, maximumValue = step.uiHint === 'likert' ? 7 : 100} = step.inputItem.formatOptions
  const range = maximumValue - minimumValue + 1
  //const width = range > 3 ? 125 : 100
  const width = step.uiHint === 'likert' ? 200 : 190
  return (
    <StyledContainer>
      {step.uiHint === 'likert' && (
        <ScaleDisplay width={width} key="scale">
          <LikertLine />
          {[...new Array(range)].map((item, index) => (
            <CircleContainer key={index} left={(width / (range - 1)) * index - circleRadius} cradius={circleRadius}>
              <div className="circle" />
              {index + minimumValue}
            </CircleContainer>
          ))}
          <Labels>
            <MinMaxLabel type="MIN" step={step} onChange={onChange} />
            <MinMaxLabel type="MAX" step={step} onChange={onChange} />
          </Labels>
        </ScaleDisplay>
      )}
      {step.uiHint === 'slider' && (
        <div style={{textAlign: 'center'}}>
          <FakeInput />
          <ScaleDisplay width={width} key="scale">
            <Labels sx={{marginTop: '15px', marginLeft: '-18px'}}>
              <span className="sliderVal" key="min">
                {' '}
                {minimumValue}
              </span>
              <span className="sliderVal" key="max">
                {maximumValue}
              </span>
            </Labels>
            <SliderLine sx={{top: '9px'}} /> <SliderThumb style={{position: 'absolute', top: 0, left: '-2px'}} />
            <Labels sx={{marginTop: '12px'}}>
              <MinMaxLabel type="MIN" step={step} onChange={onChange} />
              <MinMaxLabel type="MAX" step={step} onChange={onChange} />
            </Labels>
          </ScaleDisplay>
        </div>
      )}
    </StyledContainer>
  )
}

export default Scale
