import React from 'react'
import { makeStyles } from '@material-ui/core'
import Subsection from './Subsection'
import {
  Box,
  CircularProgress,
  FormControl,
  FormGroup,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormHelperText,
} from '@material-ui/core'
import { StudyAppDesign } from '../../../types/types'
import { playfairDisplayFont, poppinsFont } from '../../../style/theme'
import {
  SimpleTextInput,
  SimpleTextLabel,
} from '../../widgets/StyledComponents'
import { AppDesignUpdateTypes } from './AppDesign'
import { isInvalidPhone, isValidEmail } from '../../../helpers/utility'
import clsx from 'clsx'
import SaveButton from '../../widgets/SaveButton'
import { makePhone } from '../../../helpers/utility'

const useStyles = makeStyles(theme => ({
  formFields: {
    fontFamily: poppinsFont,
    fontSize: '14px',
    marginBottom: '24px',

    '& .MuiFormControl-root:not(:last-child)': {
      marginBottom: '16px',
    },
  },
  irbInputFormControl: {
    width: '100%',
    marginBottom: theme.spacing(1),
  },
  informationRowStyle: {
    fontFamily: playfairDisplayFont,
    fontWeight: 'normal',
    fontSize: '15px',
    lineHeight: '18px',
  },
  irbInput: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  errorText: {
    marginTop: theme.spacing(-0.5),
  },
}))

type IrbBoardContactSectionProps = {
  appDesignProperties: StudyAppDesign
  setAppDesignProperties: Function
  updateAppDesignInfo: Function
  SimpleTextInputStyles: React.CSSProperties
  irbNameSameAsInstitution: boolean
  getContact: Function
  setIrbNameSameAsInstitution: Function
  phoneNumberErrorState: {
    isGeneralContactPhoneNumberValid: boolean
    isIrbPhoneNumberValid: boolean
  }
  setPhoneNumberErrorState: Function
  irbPhoneNumber: string
  setIrbPhoneNumber: Function
  emailErrorState: {
    isGeneralContactEmailValid: boolean
    isIrbEmailValid: boolean
  }
  setEmailErrorState: Function
  saveLoader: boolean
  saveInfo: Function
}

const IrbBoardContactSection: React.FunctionComponent<IrbBoardContactSectionProps> = ({
  appDesignProperties,
  setAppDesignProperties,
  updateAppDesignInfo,
  SimpleTextInputStyles,
  irbNameSameAsInstitution,
  getContact,
  setIrbNameSameAsInstitution,
  phoneNumberErrorState,
  setPhoneNumberErrorState,
  irbPhoneNumber,
  setIrbPhoneNumber,
  emailErrorState,
  setEmailErrorState,
  saveLoader,
  saveInfo,
}) => {
  const classes = useStyles()
  return (
    <Subsection heading="IRB or Ethics Board Contact">
      <Box
        width="80%"
        marginTop="12px"
        fontSize="15px"
        lineHeight="18px"
        fontFamily="Lato"
        marginBottom="16px"
      >
        For questions about your rights as a research participant in this study,
        please contact :
      </Box>
      <FormGroup className={classes.formFields}>
        <Box paddingLeft="2px" marginTop="8px">
          What is your IRB of record?*
        </Box>
        <Box
          width="100%"
          boxSizing="border-box"
          marginTop="8px"
          paddingLeft="48px"
          paddingRight="8px"
        >
          <RadioGroup
            aria-label="gender"
            value={
              irbNameSameAsInstitution
                ? 'affiliation_same'
                : 'affiliation_other'
            }
            onChange={e => {
              if (e.target.value === 'affiliation_same') {
                const studyLead = getContact('LEAD_INVESTIGATOR')
                const newEthicsBoard = getContact('ETHICS_BOARD')
                newEthicsBoard.name = studyLead.affiliation || ''
                setAppDesignProperties({
                  ...appDesignProperties,
                  ethicsBoardInfo: newEthicsBoard,
                })
              }
              setIrbNameSameAsInstitution(e.target.value === 'affiliation_same')
            }}
            style={{ marginBottom: '8px' }}
          >
            <FormControlLabel
              value="affiliation_same"
              control={<Radio />}
              label="Same Institutional Affiliation"
            />
            <FormControlLabel
              value="affiliation_other"
              control={<Radio />}
              label="Other"
            />
          </RadioGroup>
          <FormControl className={classes.irbInputFormControl}>
            <SimpleTextInput
              className={clsx(classes.informationRowStyle, classes.irbInput)}
              id="ethics-board-input"
              placeholder="Name IRB of record"
              value={appDesignProperties.ethicsBoardInfo?.name || ''}
              onChange={e => {
                const newEthicsBoard = getContact('ETHICS_BOARD')
                newEthicsBoard.name = e.target.value
                setAppDesignProperties({
                  ...appDesignProperties,
                  ethicsBoardInfo: newEthicsBoard,
                })
              }}
              onBlur={() =>
                updateAppDesignInfo(AppDesignUpdateTypes.UPDATE_STUDY_CONTACTS)
              }
              rows={1}
              rowsMax={1}
              inputProps={{
                style: {
                  fontSize: '15px',
                  width: '100%',
                  height: '44px',
                  boxSizing: 'border-box',
                },
              }}
              readOnly={irbNameSameAsInstitution}
            />
          </FormControl>
        </Box>
        <FormControl
          className={clsx(
            !phoneNumberErrorState.isIrbPhoneNumberValid && 'error',
          )}
        >
          <SimpleTextLabel htmlFor="ethics-phone-number-input">
            Phone Number*
          </SimpleTextLabel>
          <SimpleTextInput
            className={clsx(classes.informationRowStyle, 'error')}
            id="ethics-phone-number-input"
            placeholder="xxx-xxx-xxxx"
            value={irbPhoneNumber}
            onChange={e => {
              setIrbPhoneNumber(e.target.value)
            }}
            onBlur={() => {
              const isInvalidPhoneNumber =
                isInvalidPhone(irbPhoneNumber) && irbPhoneNumber !== ''
              setPhoneNumberErrorState(
                (prevState: typeof phoneNumberErrorState) => {
                  return {
                    ...prevState,
                    isIrbPhoneNumberValid: !isInvalidPhoneNumber,
                  }
                },
              )
              const newEthicsBoard = getContact('ETHICS_BOARD')
              newEthicsBoard.phone = makePhone(irbPhoneNumber)
              setAppDesignProperties({
                ...appDesignProperties,
                ethicsBoardInfo: newEthicsBoard,
              })
            }}
            multiline
            rows={1}
            rowsMax={1}
            inputProps={{
              style: SimpleTextInputStyles,
            }}
          />
          {!phoneNumberErrorState.isIrbPhoneNumberValid && (
            <FormHelperText
              id="ethics-phone-text"
              className={classes.errorText}
            >
              phone should be in the format: xxx-xxx-xxxx
            </FormHelperText>
          )}
        </FormControl>
        <FormControl
          className={clsx(!emailErrorState.isIrbEmailValid && 'error')}
        >
          <SimpleTextLabel htmlFor="ethics-email-input">Email*</SimpleTextLabel>
          <SimpleTextInput
            className={classes.informationRowStyle}
            id="ethics-email-input"
            placeholder="Institutional Email"
            value={appDesignProperties.ethicsBoardInfo?.email || ''}
            onChange={e => {
              const newEthicsBoard = getContact('ETHICS_BOARD')
              newEthicsBoard.email = e.target.value
              setAppDesignProperties({
                ...appDesignProperties,
                ethicsBoardInfo: newEthicsBoard,
              })
            }}
            onBlur={() => {
              const validEmail =
                isValidEmail(
                  appDesignProperties.ethicsBoardInfo?.email || '',
                ) || !appDesignProperties.ethicsBoardInfo?.email
              setEmailErrorState((prevState: typeof emailErrorState) => {
                return {
                  ...prevState,
                  isIrbEmailValid: validEmail,
                }
              })
              updateAppDesignInfo(AppDesignUpdateTypes.UPDATE_STUDY_CONTACTS)
            }}
            multiline
            rows={1}
            rowsMax={1}
            inputProps={{
              style: SimpleTextInputStyles,
            }}
          />
          {!emailErrorState.isIrbEmailValid && (
            <FormHelperText
              id="ethics-email-text"
              className={classes.errorText}
            >
              email should be in a valid format such as: example@placeholder.com
            </FormHelperText>
          )}
        </FormControl>
        <FormControl>
          <SimpleTextLabel htmlFor="IRB-approval-input">
            IRB Protocol ID*
          </SimpleTextLabel>
          <SimpleTextInput
            className={classes.informationRowStyle}
            id="IRB-approval-input"
            placeholder="XXXXXXXXXX"
            value={appDesignProperties.irbProtocolId}
            onChange={e => {
              setAppDesignProperties({
                ...appDesignProperties,
                irbProtocolId: e.target.value,
              })
            }}
            onBlur={() =>
              updateAppDesignInfo(AppDesignUpdateTypes.UPDATE_STUDY_IRB_NUMBER)
            }
            multiline
            rows={1}
            rowsMax={1}
            inputProps={{
              style: SimpleTextInputStyles,
            }}
          />
        </FormControl>
      </FormGroup>
      <Box textAlign="left">
        {saveLoader ? (
          <div className="text-center">
            <CircularProgress color="primary" size={25} />
          </div>
        ) : (
          <SaveButton
            onClick={() => saveInfo()}
            id="save-button-study-builder-2"
          />
        )}
      </Box>
    </Subsection>
  )
}

export default IrbBoardContactSection
