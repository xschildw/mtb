import React from 'react'
import { makeStyles } from '@material-ui/core'
import Subsection from './Subsection'
import { FormControl } from '@material-ui/core'
import { StudyAppDesign } from '../../../types/types'
import { AppDesignUpdateTypes } from './AppDesign'
import LeadInvestigatorDropdown from './LeadInvestigatorDropdown'
import FormGroupWrapper from './FormGroupWrapper'
import TextInputWrapper from './TextInputWrapper'

const useStyles = makeStyles(theme => ({
  firstFormElement: {
    marginTop: theme.spacing(2.5),
  },
  principleInvestigatorsParagraph: {
    fontSize: '12px',
    marginLeft: theme.spacing(2),
    lineHeight: '14px',
    marginTop: theme.spacing(2),
  },
}))

type StudyLeadInformationSectionProps = {
  appDesignProperties: StudyAppDesign
  setAppDesignProperties: Function
  updateAppDesignInfo: Function
  SimpleTextInputStyles: React.CSSProperties
  getContact: Function
  orgMembership: string | undefined
  token: string | undefined
  irbNameSameAsInstitution: boolean
}

const StudyLeadInformationSection: React.FunctionComponent<StudyLeadInformationSectionProps> = ({
  appDesignProperties,
  setAppDesignProperties,
  updateAppDesignInfo,
  SimpleTextInputStyles,
  getContact,
  orgMembership,
  token,
  irbNameSameAsInstitution,
}) => {
  const classes = useStyles()
  return (
    <Subsection heading="Information about the Study Leads">
      <FormGroupWrapper>
        <FormControl className={classes.firstFormElement}>
          <LeadInvestigatorDropdown
            orgMembership={orgMembership!}
            token={token!}
            onChange={(investigatorSelected: string) => {
              const newStudyLead = getContact('LEAD_INVESTIGATOR')
              newStudyLead.name = investigatorSelected
              setAppDesignProperties({
                ...appDesignProperties,
                leadPrincipleInvestigatorInfo: newStudyLead,
              })
            }}
            currentInvestigatorSelected={
              appDesignProperties.leadPrincipleInvestigatorInfo?.name || ''
            }
          ></LeadInvestigatorDropdown>
          <p className={classes.principleInvestigatorsParagraph}>
            Principle Investigators are required to be part of the study as a
            “Study Administrator”.
            <br></br>
            <br></br>
            If your PI is not listed in the dropdown, please add them to the
            study and/or make them a <strong>Co-Study Administrator</strong> via
            the{' '}
            <strong>
              <u>Access Settings</u>
            </strong>{' '}
            tab on the top right hand side.{' '}
          </p>
        </FormControl>
        <FormControl>
          <TextInputWrapper
            SimpleTextInputStyles={SimpleTextInputStyles}
            id="institution-input"
            placeholder="Name of Institution"
            value={
              appDesignProperties.leadPrincipleInvestigatorInfo?.affiliation ||
              ''
            }
            onChange={(
              e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
            ) => {
              const newStudyLead = getContact('LEAD_INVESTIGATOR')
              newStudyLead.affiliation = e.target.value
              const newEthicsBoard = getContact('ETHICS_BOARD')
              newEthicsBoard.name = irbNameSameAsInstitution
                ? e.target.value
                : newEthicsBoard.name
              setAppDesignProperties({
                ...appDesignProperties,
                leadPrincipleInvestigatorInfo: newStudyLead,
                ethicsBoardInfo: newEthicsBoard,
              })
            }}
            onBlur={() =>
              updateAppDesignInfo(AppDesignUpdateTypes.UPDATE_STUDY_CONTACTS)
            }
            multiline
            rows={1}
            rowsMax={1}
            titleText="Institutional Affiliation*"
          />
        </FormControl>
        <FormControl>
          <TextInputWrapper
            SimpleTextInputStyles={SimpleTextInputStyles}
            id="funder-input"
            placeholder="Name of Funder(s)"
            value={appDesignProperties.funder?.name || ''}
            onChange={(
              e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
            ) => {
              const newFunder = getContact('FUNDER')
              newFunder.name = e.target.value
              setAppDesignProperties({
                ...appDesignProperties,
                funder: newFunder,
              })
            }}
            onBlur={() =>
              updateAppDesignInfo(AppDesignUpdateTypes.UPDATE_STUDY_CONTACTS)
            }
            multiline
            rows={1}
            rowsMax={1}
            titleText="Funder*"
          />
        </FormControl>
      </FormGroupWrapper>
    </Subsection>
  )
}

export default StudyLeadInformationSection
