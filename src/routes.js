import React from 'react';

const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Login = React.lazy(() => import('./pages/Login'));
const Company = React.lazy(() => import('./pages/Company'));
const Role = React.lazy(() => import('./pages/Role'));
const Transaction = React.lazy(() => import('./pages/Transaction'));
const User = React.lazy(() => import('./pages/User'));
const VehicleType = React.lazy(() => import('./pages/VehicleType'));
const ParkingTicket = React.lazy(() => import('./pages/ParkingTicket'));


const routes = [
  { path: '/', exact: true, name: 'Home', block: [] },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, block: [] },
  { path: '/login', name: 'Login', component: Login, block: [] },
  { path: '/company', name: 'Company', component: Company, block: ['manage', 'user'] },
  { path: '/role', name: 'Role', component: Role, block: ['security', 'manage', 'user'] },
  { path: '/transaction', name: 'Transaction', component: Transaction, block: [] },
  { path: '/user', name: 'User', component: User, block: ['user'] },
  { path: '/vehicle-type', name: 'Vehicle Type', component: VehicleType, block: ['security', 'manage', 'user'] },
  { path: '/parking-ticket', name: 'Parking Ticket', component: ParkingTicket, block: [] },
];

export default routes;
