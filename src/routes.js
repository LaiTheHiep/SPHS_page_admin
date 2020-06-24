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
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/login', name: 'Login', component: Login },
  { path: '/company', name: 'Company', component: Company },
  { path: '/role', name: 'Role', component: Role },
  { path: '/transaction', name: 'Transaction', component: Transaction },
  { path: '/user', name: 'User', component: User },
  { path: '/vehicle-type', name: 'Vehicle Type', component: VehicleType },
  { path: '/parking-ticket', name: 'Parking Ticket', component: ParkingTicket },
];

export default routes;
