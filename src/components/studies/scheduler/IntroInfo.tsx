import {
  Box,
  Button,
  Container,
  createStyles,
  Divider,
  FormControlLabel,
  Theme,
} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import React from 'react'
import {poppinsFont, latoFont} from '../../../style/theme'
import {DWsEnum} from '../../../types/scheduling'
import {SimpleTextInput, PrevButton} from '../../widgets/StyledComponents'
import Duration from './Duration'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    labelDuration: {
      fontFamily: poppinsFont,
      fontSize: '18px',
      fontWeight: 600,
      textAlign: 'left',
      alignSelf: 'start',
    },
    container: {
      backgroundColor: '#FAFAFA',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      padding: theme.spacing(3.75),
      minWidth: '600px',
    },
    formControl: {
      fontSize: '18px',
      width: '100%',
      display: 'flex',
      flexDirection: 'row-reverse',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    divider2: {
      width: '100%',
      marginTop: theme.spacing(5),
      marginBottom: theme.spacing(3.75),
    },
    divider1: {
      width: '100%',
      marginBottom: theme.spacing(3),
    },
    headerText: {
      fontSize: '18px',
      fontFamily: 'Poppins',
      lineHeight: '27px',
    },
    description: {
      fontFamily: 'Lato',
      fontStyle: 'italic',
      fontSize: '15px',
      fontWeight: 'lighter',
      lineHeight: '18px',
    },
    middleContainer: {
      display: 'flex',
      flexDirection: 'row',
      position: 'relative',
      marginLeft: theme.spacing(-8.75),
    },
    weekInformation: {
      fontStyle: 'italic',
      fontFamily: latoFont,
      fontSize: '12px',
      lineHeight: '20px',
      marginLeft: theme.spacing(2.25),
      position: 'absolute',
      right: theme.spacing(-18.75),
      marginTop: theme.spacing(0.5),
      textAlign: 'left',
      listStyle: 'none',
    },
    continueButton: {
      display: 'flex',
      height: '45px',
      marginTop: theme.spacing(8),
      alignSelf: 'flex-start',
    },
  })
)

export interface IntroInfoProps {
  onContinue: Function
}

const IntroInfo: React.FunctionComponent<IntroInfoProps> = ({
  onContinue,
}: IntroInfoProps) => {
  const classes = useStyles()
  const [studyName, setStudyName] = React.useState<any>('')
  const [duration, setDuration] = React.useState<any>('')

  return (
    <Container maxWidth="sm" className={classes.container}>
      <FormControlLabel
        style={{marginBottom: '35px'}}
        classes={{labelPlacementStart: classes.labelDuration}}
        label={
          <Box width="210px" marginRight="40px">
            <strong className={classes.headerText}>Study Name</strong>
            <br /> <br />
            <div className={classes.description}>
              This name will be displayed to your participants in the app.
            </div>{' '}
          </Box>
        }
        className={classes.formControl}
        labelPlacement="start"
        control={
          <SimpleTextInput
            fullWidth
            onChange={e => setStudyName(e.target.value)}
            style={{marginTop: '-20px'}}
          />
        }
      />
      <Divider className={classes.divider1}></Divider>
      <Box className={classes.middleContainer}>
        <FormControlLabel
          classes={{labelPlacementStart: classes.labelDuration}}
          label={
            <Box width="210px" marginRight="40px">
              <strong className={classes.headerText}>
                How long is your study?
              </strong>
              <br /> <br />
              <div className={classes.description}>
                This is the duration that a participant is involved in the
                study.
              </div>{' '}
            </Box>
          }
          className={classes.formControl}
          labelPlacement="start"
          control={
            <Box mt={-10}>
              <Duration
                onChange={e => setDuration(e.target.value)}
                durationString={duration || ''}
                unitLabel="study duration unit"
                numberLabel="study duration number"
                unitData={DWsEnum}
                isIntro={true}></Duration>
            </Box>
          }
        />
        <ul className={classes.weekInformation}>
          <li>Example Conversions</li>
          <li>1 year = 52 weeks</li>
          <li>2 year = 104 weeks</li>
          <li>3 year = 156 weeks</li>
          <li>4 year = 208 weeks</li>
          <li>5 year = 260 weeks</li>
        </ul>
      </Box>
      <Button
        className={classes.continueButton}
        variant="contained"
        color="primary"
        key="saveButton"
        onClick={e => onContinue(studyName, duration, 'timeline_retrieved')}
        disabled={!(duration && studyName)}>
        Continue
      </Button>
    </Container>
  )
}

export default IntroInfo
