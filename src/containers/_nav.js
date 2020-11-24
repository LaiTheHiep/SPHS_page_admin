import { ROLES } from '../parameters/const_env';

export default [
  {
    _tag: 'CSidebarNavItem',
    name: 'Dashboard',
    to: '/dashboard',
    icon: 'cil-speedometer',
    badge: {
      color: 'info',
      text: 'NEW',
    },
    block: []
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Role',
    to: '/role',
    icon: 'cil-puzzle',
    block: [ROLES.security, ROLES.manager, ROLES.user]
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Vehicle Type',
    to: '/vehicle-type',
    icon: 'cil-drop',
    block: [ROLES.security, ROLES.manager, ROLES.user]
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'User',
    to: '/user',
    icon: 'cil-user',
    block: [ROLES.user]
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Company',
    to: '/company',
    icon: 'cil-align-center',
    block: [ROLES.manager, ROLES.user]
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Work Day',
    to: '/work-day',
    icon: 'cil-align-center',
    block: [ROLES.security, ROLES.user]
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Transaction',
    to: '/transaction',
    icon: 'cil-credit-card',
    block: []
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Parking Ticket',
    to: '/parking-ticket',
    icon: 'cil-cursor',
    block: []
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Device',
    to: '/device',
    icon: 'cil-spreadsheet',
    block: [ROLES.security, ROLES.manager, ROLES.user]
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Card',
    to: '/card',
    icon: 'cil-layers',
    block: [ROLES.security, ROLES.manager, ROLES.user]
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Feed Back',
    to: '/feed-back',
    icon: 'cil-speech',
    block: []
  },
]

