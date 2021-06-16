import { Box, Button, Checkbox, Menu, MenuItem } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import CheckIcon from '@material-ui/icons/Check'
import clsx from 'clsx'
import React from 'react'

const useStyles = makeStyles(theme => ({
  root: {
    textAlign: 'left',
  },
  check: {
    padding: theme.spacing(0.5, 0, 0.5, 2),
  },
  icon: {
    marginLeft: '-10px',
    width: '16px',
    '& svg': {
      width: '15px',
      marginTop: '5px',
    },
  },
  select: {
    paddingLeft: 0,
    paddingRight: 0,
    minWidth: 'auto',
    borderRadius: 0,
    cursor: 'pointer',
    '&$focused': {
      // boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.25)',
      backgroundColor: 'transparent',
    },
    '&:hover, &:active': {
      // boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.25)',
      backgroundColor: 'transparent',
    },
    '& .MuiCheckbox-root': {
      paddingRight: 0,
      paddingLeft: 0,
    },
  },
  arrowDown: {
    width: '0px',
    height: '0px',
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderTop: '5px solid #2f2f2f',
  },
  arrowUp: {
    width: '0px',
    height: '0px',
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderBottom: '5px solid #2f2f2f',
  },
  focused: {},
}))

export type SelectionType = 'ALL' | 'PAGE' | undefined

export interface SelectAllProps {
  allText: string
  allPageText: string
  onSelectAllPage: Function
  onSelectAll: Function
  onDeselect: Function
  selectionType: SelectionType
}

const SelectAll: React.FunctionComponent<SelectAllProps> = ({
  allText,
  allPageText,
  onSelectAllPage,
  onSelectAll,
  onDeselect,
  selectionType,
}) => {
  const classes = useStyles()

  const [selection, setSelection] = React.useState<SelectionType>(selectionType)
  const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null)

  const handleMenuClose = () => {
    setMenuAnchor(null)
  }

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenuAnchor(event.currentTarget)
  }
  const setSelect = (type: 'ALL' | 'PAGE' | undefined) => {
    setSelection(type)
    handleMenuClose()
    if (!type) {
      onDeselect()
    } else {
      type === 'ALL' ? onSelectAll() : onSelectAllPage()
    }
  }
  const menuItems = [
    {
      value: 'ALL',
      label: allText,
    },
    {
      value: 'PAGE',
      label: allPageText,
    },
  ]

  return (
    <Box className={classes.root}>
      <Checkbox
        name="selectAllCheckbox"
        className={classes.check}
        checked={selection === 'ALL' || selection === 'PAGE'}
        onChange={e => {
          e.target.checked ? setSelect('ALL') : setSelect(undefined)
        }}
      />{' '}
      <Button
        className={clsx(classes.select, Boolean(menuAnchor) && classes.focused)}
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleMenuClick}
      >
        <div
          className={clsx(
            Boolean(menuAnchor) ? classes.arrowUp : classes.arrowDown,
          )}
        ></div>
      </Button>
      <Menu
        id="study-menu"
        anchorEl={menuAnchor}
        keepMounted
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        {menuItems.map(item => (
          <MenuItem
            onClick={() => setSelect(item.value as SelectionType)}
            key={item.value}
          >
            <div className={classes.icon}>
              {selection == item.value && <CheckIcon />}
            </div>
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}

export default SelectAll
