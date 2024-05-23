// @ts-nocheck
/* eslint-disable import/no-anonymous-default-export */
import { Truck, Circle, User, CreditCard, Shield, Globe, HardDrive, DollarSign,    } from 'react-feather'
export default [
  {
    id: 'users',
    title: 'Users',
    icon: <User size={12} />,
    permissions: ['VIEW_USERS'],
    navLink: '/pages/users'
  },
  {
    id: 'transaction',
    title: 'Transaction',
    icon: <CreditCard size={20} />,
    // badge: 'light-info',
    // badgeText: '4',
    children: [

      {
        id: 'deposit',
        title: 'Deposit',
        icon: <Circle size={12} />,
        permissions: ['VIEW_DEPOSIT'],
        navLink: '/pages/deposit'
      },
      {
        id: 'withdraw',
        title: 'Withdraw',
        icon: <Circle size={12} />,
        permissions: ['VIEW_WITHDRAW'],
        navLink: '/pages/withdraw'
      },
      {
        id: 'bet-record',
        title: 'Bet',
        icon: <Circle size={12} />,
        permissions: ['VIEW_BET_HISTORY'],
        navLink: '/pages/bet-record'
      },
    ]
  },
  {
    id: 'account-admin',
    title: 'Account Admin',
    icon: <Shield size={12} />,
    permissions: ['VIEW_ROLE'],
    navLink: '/pages/account-admin'
  },
  {
    id: 'payment-method',
    title: 'Payment Method',
    icon: <DollarSign size={12} />,
    permissions: ['VIEW_PAYMENT_METHOD'],
    navLink: '/pages/payment-method'
  },
  {
    id: 'game-control',
    title: 'Game Control',
    icon: <HardDrive size={12} />,
    permissions: ['VIEW_GAME'],
    navLink: '/pages/game-control'
  },
  {
    id: 'maintain',
    title: 'Maintain',
    icon: <Globe size={12} />,
    permissions: ['VIEW_MAINTAIN'],
    navLink: '/pages/maintain'
  },
  {
    id: 'notify',
    title: 'Notify',
    icon: <Globe size={12} />,
    permissions: ['VIEW_MAINTAIN'],
    navLink: '/pages/notify'
  },
  {
    id: 'manage-form',
    title: 'Management Info',
    icon: <Truck size={12} />,
    permissions: ['VIEW_MANAGEMENT_INFO'],
    navLink: '/pages/manage-form'
  },
  // {
  //   id: 'affiliate',
  //   title: 'Policy Affilaite',
  //   icon: <Globe size={12} />,
  //   permissions: ['VIEW_AFFLIATEPOLICY'],
  //   navLink: '/pages/policy-affiliate'
  // },
  // {
  //   id: 'policyTransaction',
  //   title: 'Policy Transaction',
  //   icon: <Truck size={12} />,
  //   permissions: ['VIEW_COMMISSION'],
  //   navLink: '/pages/policy-transaction'
  // },
]
