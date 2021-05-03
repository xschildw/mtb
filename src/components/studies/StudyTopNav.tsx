import {
  Box,
  Drawer,
  Hidden,
  IconButton,
  LinearProgress,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Toolbar from '@material-ui/core/Toolbar'
import MenuIcon from '@material-ui/icons/Menu'
import PeopleIcon from '@material-ui/icons/People'
import React, { FunctionComponent } from 'react'
import { NavLink } from 'react-router-dom'
import Logo from '../../assets/logo_mtb.svg'
import { useStudyInfoDataState } from '../../helpers/StudyInfoContext'
import { latoFont } from '../../style/theme'
import BreadCrumb from '../widgets/BreadCrumb'
import HideWhen from '../widgets/HideWhen'
import BLACK_X_ICON from '../../assets/black_x_icon.svg'
import PARTICIPANTS_ICON from '../../assets/group_participants_icon.svg'
import MobileDrawerMenuHeader from '../widgets/MobileDrawerMenuHeader'

const useStyles = makeStyles(theme => ({
  toolbarStudyHeader: {
    height: '104px',
    display: 'flex',
    backgroundColor: '#F8F8F8',

    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${theme.palette.divider}`,
  },

  toolbar: {
    overflowX: 'auto',
    alignItems: 'baseline',
    minHeight: 'auto',
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: theme.spacing(8),
    '&:last-child': {
      paddingRight: 0,
    },
  },

  selectedLink: {
    borderBottom: '2px solid black',
    paddingBottom: theme.spacing(2),
    marginButtom: '-1px',
  },
  menuButton: {
    marginRight: theme.spacing(2),
    float: 'right',
    '&::after': {
      content: '',
      display: 'table',
      clear: 'both',
    },
  },
  drawer: {
    width: '320px',
    flexShrink: 0,
  },
  drawerPaper: {
    width: '320px',

    '& $toolbarLink': {
      flextGroup: 0,
      padding: theme.spacing(1, 2),
      fontStyle: 'normal',
      textTransform: 'uppercase',
    },

    '& $toolbarLink:first-child': {
      paddingLeft: '8px',
    },

    '& $selectedLink': {
      border: 'none',
      fontWeight: 'bolder',
    },
    backgroundColor: '#F8F8F8',
  },
  toolbarLink: {
    padding: theme.spacing(0, 2, 2, 2),
    flexGrow: 1,
    fontFamily: latoFont,
    fontSize: '15px',

    textDecoration: 'none',
    color: 'inherit',
    flexShrink: 0,

    '&:first-child': {
      paddingLeft: theme.spacing(0.5),
    },
    '&:last-child': {
      paddingRight: theme.spacing(0.5),
    },
  },
  mobileToolBarLink: {
    fontFamily: latoFont,
    fontSize: '15px',
    textDecoration: 'none',
    color: 'inherit',
    flexShrink: 0,
    height: '64px',
    boxSizing: 'border-box',
    paddingLeft: theme.spacing(3),
    '&:hover': {
      backgroundColor: '#fff',
    },
    display: 'flex',
    alignItems: 'center',
    borderLeft: '4px solid transparent',
  },
  mobileSelectedLink: {
    borderLeft: '4px solid #353535',
    fontWeight: 'bolder',
  },
  blackXIcon: {
    width: '16px',
    height: '16px',
  },
}))

type StudyTopNavProps = {
  //sections:? { name: string; path: string }[]
  studyId: string
  //studyName?: string
  currentSection?: string
}

const StudyTopNav: FunctionComponent<StudyTopNavProps> = ({
  studyId,
  //studyName,
  currentSection,
}: StudyTopNavProps) => {
  const links = [
    { path: '/studies/builder/:id/session-creator', name: 'STUDY BUILDER' },
    { path: '/studies/:id/participant-manager', name: 'PARTICIPANT MANAGER' },
    { path: '/studies/:id/compliance', name: 'ADHERENCE DATA' },
    { path: '/studies/:id/study-data', name: 'STUDY DATA' },
  ]
  const [isMobileOpen, setIsMobileOpen] = React.useState(false)
  const classes = useStyles()
  //const sessionData = useUserSessionDataState()
  const studyData = useStudyInfoDataState()

  return (
    <Box bgcolor="#fff" px={2}>
      <Hidden lgUp>
        <IconButton
          color="inherit"
          aria-label="Open drawer"
          edge="end"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className={classes.menuButton}
        >
          <MenuIcon></MenuIcon>
        </IconButton>
      </Hidden>
      <Hidden mdDown>
        <Box className={classes.toolbarStudyHeader}>
          <Toolbar
            component="nav"
            variant="dense"
            disableGutters={true}
            className={classes.toolbar}
            style={{
              marginTop: '48px',
              paddingTop: '0',
              alignItems: 'center',
            }}
          >
            <NavLink
              to={'/'}
              key="home"
              className={classes.toolbarLink}
              style={{ paddingBottom: '0' }}
            >
              <img src={Logo} key="img_home" alt="home" />
            </NavLink>
            <HideWhen hideWhen={studyData.study === undefined}>
              <BreadCrumb
                links={[{ url: '/Studies', text: '' }]}
                currentItem={studyData.study?.name}
              ></BreadCrumb>

              <LinearProgress style={{ width: '50px' }} />
            </HideWhen>
          </Toolbar>
          <Toolbar className={classes.toolbar}>
            {links
              .filter(section => section.name)
              .map(section => (
                <NavLink
                  to={section.path.replace(':id', studyId)}
                  key={section.path}
                  className={classes.toolbarLink}
                  activeClassName={classes.selectedLink}
                >
                  {section.name}
                </NavLink>
              ))}
          </Toolbar>
          <Toolbar className={classes.toolbar}>
            <NavLink
              to={'/studies/:id/access-settings'.replace(':id', studyId)}
              key={'path-to-access-settings'}
              className={classes.toolbarLink}
              activeClassName={classes.selectedLink}
              style={{ display: 'flex' }}
            >
              <PeopleIcon></PeopleIcon>&nbsp;&nbsp;Access settings
            </NavLink>
          </Toolbar>
        </Box>
      </Hidden>
      <nav className={classes.drawer}>
        <Drawer
          variant="temporary"
          anchor="right"
          open={isMobileOpen}
          onClose={() => setIsMobileOpen(false)}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          <MobileDrawerMenuHeader
            setIsMobileOpen={setIsMobileOpen}
          ></MobileDrawerMenuHeader>
          {links
            .filter(section => section.name)
            .map(section => (
              <NavLink
                to={section.path.replace(':id', studyId)}
                key={section.path}
                className={classes.mobileToolBarLink}
                activeClassName={classes.mobileSelectedLink}
              >
                {section.name}
              </NavLink>
            ))}
          <NavLink
            to={'/studies/:id/access-settings'.replace(':id', studyId)}
            key={'path-to-access-settings'}
            className={classes.mobileToolBarLink}
            activeClassName={classes.mobileSelectedLink}
            style={{ display: 'flex', marginTop: '32px' }}
          >
            <img src={PARTICIPANTS_ICON} style={{ marginRight: '20px' }}></img>
            Access settings
          </NavLink>
        </Drawer>
      </nav>
    </Box>
  )
}

export default StudyTopNav
