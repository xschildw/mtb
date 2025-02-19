import {StyledToggleButton, StyledToggleButtonGroup} from '@components/widgets/StyledComponents'
import {useUserSessionDataState} from '@helpers/AuthContext'
import useFeatureToggles, {FeatureToggles} from '@helpers/FeatureToggle'
import ViewListIcon from '@mui/icons-material/ViewListTwoTone'
import ViewModuleIcon from '@mui/icons-material/ViewModuleTwoTone'
import {Box, Button, Container, styled, Typography} from '@mui/material'
import {theme} from '@style/theme'
import {Assessment, AssessmentsType, StringDictionary, ViewType} from '@typedefs/types'
import {FunctionComponent, ReactNode} from 'react'
import {NavLink} from 'react-router-dom'

type AssessmentLibraryWrapperProps = {
  assessments: Assessment[]
  tags?: StringDictionary<number>
  children: ReactNode | ReactNode[]
  onChangeTags: Function
  onChangeViewMode: (v: ViewType) => void
  viewMode?: ViewType
  onChangeAssessmentsType: (t: AssessmentsType) => void
  isAssessmentLibrary?: boolean
  assessmentsType: AssessmentsType
}

const StyledOuterContainer = styled(Box, {
  label: 'StyledOuterContainer',
  shouldForwardProp: prop => prop !== 'isBlue',
})<{
  isBlue: boolean
}>(({theme, isBlue}) => ({
  /*
  flexGrow: 1,
  backgroundColor: isBlue ? '#BCD5E4' : theme.palette.background.default,

  minWidth: '1000px',
  [theme.breakpoints.down('lg')]: {
    minWidth: '750px',
  },
  [theme.breakpoints.down('md')]: {
    maxWidth: '400px',
  },
paddingTop: theme.spacing(1),}*/
}))

const StyledAssessmentContainer = styled(Container, {label: 'StyledAssessmentContainer'})(({theme}) => ({
  padding: theme.spacing(2, 5),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(2, 5),
  },
  [theme.breakpoints.down('md')]: {
    maxWidth: '600px',
    padding: theme.spacing(2, 1),
  },
}))

const StyledCardGrid = styled(Box, {label: 'StyledCardGrid'})<{layoutType?: ViewType}>(({theme, layoutType = 'GRID'}) =>
  layoutType === 'GRID'
    ? {
        display: 'grid',
        padding: theme.spacing(0),
        gridTemplateColumns: `repeat(auto-fill,602px)`,
        gridColumnGap: theme.spacing(2),
        justifyContent: 'center',
        gridRowGap: theme.spacing(2),
        [theme.breakpoints.down('md')]: {
          padding: theme.spacing(3),
          justifyContent: 'center',
          gridRowGap: theme.spacing(4),
        },
      }
    : {display: 'block'}
)

const StyledToggle = styled(StyledToggleButton, {label: 'StyleToggle1'})<{width?: number}>(({theme, width}) => ({
  padding: 0,
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  '&.Mui-selected': {
    boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.12)',
  },
}))

const AssessmentTypeToggle: FunctionComponent<{
  assessmentType: AssessmentsType
  onChange: (a: AssessmentsType) => void
}> = ({assessmentType, onChange}) => {
  const sendUpdate = (value: AssessmentsType) => {
    if (value === null) {
      return
    }

    onChange(value)
  }
  return (
    <Box mb={3} mt={1}>
      <StyledToggleButtonGroup
        width={190}
        value={assessmentType}
        exclusive
        onChange={(e, _val) => {
          sendUpdate(_val)
        }}
        aria-label="allow skipping question">
        <StyledToggle value={'OTHER'} aria-label="make required">
          &nbsp; Assessments
        </StyledToggle>

        <StyledToggle value={'SURVEY'} aria-label="allow skip">
          &nbsp; Surveys
        </StyledToggle>
      </StyledToggleButtonGroup>
    </Box>
  )
}

const AssessmentLibraryWrapper: FunctionComponent<AssessmentLibraryWrapperProps> = ({
  children,
  isAssessmentLibrary = true,
  assessmentsType = 'OTHER',
  onChangeViewMode,
  viewMode = 'GRID',
  tags,
  assessments,
  onChangeTags,
  onChangeAssessmentsType,
}: AssessmentLibraryWrapperProps) => {
  const {token} = useUserSessionDataState()
  const surveyToggle = useFeatureToggles<FeatureToggles>()

  return (
    <StyledOuterContainer isBlue={!token && false /* TODO are they different?*/}>
      {/* Filtering will not be present in the october release */}
      {/* <AssessmentLibraryFilter
        tags={tags}
        assessments={assessments}
        onChangeTags={(tags: string[]) => onChangeTags(tags)}
      /> */}
      <Box
        sx={{
          background: 'linear-gradient(360deg, #EDEEF2 22.68%, #FAFAFB 85.05%)',
          padding: theme.spacing(5.5, 5, 4.5, 5),
          display: 'flex',
          justifyContent: 'space-between',
        }}>
        <Box>
          <Typography variant="h2" sx={{marginBottom: theme.spacing(3)}}>
            Assessments
          </Typography>
          <Typography component={'p'} sx={{fontSize: '16px'}}>
            Need some text here
          </Typography>
        </Box>
        {isAssessmentLibrary && token && (
          <NavLink to={'assessments/preview'} style={{textDecoration: 'none'}}>
            <Button variant="outlined">Demo All Assessments</Button>
          </NavLink>
        )}
      </Box>
      <StyledAssessmentContainer maxWidth="xl">
        {surveyToggle['SURVEY BUILDER'] && false && (
          <AssessmentTypeToggle assessmentType={assessmentsType} onChange={t => onChangeAssessmentsType(t)} />
        )}

        <Box textAlign="right" mt={4} mb={6}>
          <StyledToggleButtonGroup
            width={78}
            value={viewMode}
            exclusive
            onChange={(e, _val) => {
              onChangeViewMode(_val)
              /* sendUpdate(_val)*/
            }}
            aria-label="change viewing mode">
            <StyledToggle value={'GRID'} aria-label="view as cards">
              <ViewModuleIcon />
            </StyledToggle>

            <StyledToggle value={'LIST'} aria-label="view as list">
              <ViewListIcon />
            </StyledToggle>
          </StyledToggleButtonGroup>
        </Box>
        <StyledCardGrid layoutType={viewMode}>{children}</StyledCardGrid>
      </StyledAssessmentContainer>
    </StyledOuterContainer>
  )
}

export default AssessmentLibraryWrapper
