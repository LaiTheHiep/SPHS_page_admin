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
    block: ['security', 'manage', 'user']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Vehicle Type',
    to: '/vehicle-type',
    icon: 'cil-drop',
    block: ['security', 'manage', 'user']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'User',
    to: '/user',
    icon: 'cil-user',
    block: ['user']
  },
  {
    _tag: 'CSidebarNavItem',
    name: 'Company',
    to: '/company',
    icon: 'cil-align-center',
    block: ['manage', 'user']
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
  }
]

