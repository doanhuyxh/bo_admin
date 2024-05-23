import { lazy } from 'react'
// import { Redirect } from 'react-router-dom'

const PagesRoutes = [
  {
    path: '/login',
    component: lazy(() => import('../../views/pages/authentication/Login')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/pages/users',
    component: lazy(() => import('../../views/pages/user/index'))
  },
  {
    path: '/pages/user-detail/:id',
    component: lazy(() => import('../../views/pages/user/details/index'))
  },
  {
    path: '/pages/account-admin',
    component: lazy(() => import('../../views/pages/account-admin/index'))
  },
  {
    path: '/pages/payment-method',
    component: lazy(() => import('../../views/pages/payment-method/index'))

  },
  {
    path: '/pages/game-control',
    component: lazy(() => import('../../views/pages/game-control/index'))

  },
  {
    path: '/pages/deposit',
    component: lazy(() => import('../../views/pages/deposit/index'))
  },
  {
    path: '/pages/withdraw',
    component: lazy(() => import('../../views/pages/withdraw/index'))
  },
  {
    path: '/pages/bet-record',
    component: lazy(() => import('../../views/pages/bet-record/index'))
  },
  {
    path: '/pages/role/add',
    exact: true,
    component: lazy(() => import('../../views/pages/account-admin/edit-role')),
    meta: {
      navLink: '/pages/account-admin'
    }
  },
  {
    path: '/pages/role/:id',
    exact: true,
    component: lazy(() => import('../../views/pages/account-admin/edit-role')),
    meta: {
      navLink: '/pages/account-admin'
    }
  },
  {
    path: '/pages/maintain',
    component: lazy(() => import('../../views/pages/maintain/index'))
  },
  {
    path: '/pages/notify',
    component: lazy(() => import('../../views/pages/notify/index'))
  },
  {
    path: '/pages/policy-affiliate',
    component: lazy(() => import('../../views/pages/policy-affiliate/index'))
  },
  {
    path: '/pages/policy-transaction',
    component: lazy(() => import('../../views/pages/policy-transaction/index'))
  },
  {
    path: '/pages/manage-form',
    component: lazy(() => import('../../views/pages/manage-empty-form/index'))
  },
  // {
  //   path: '/pages/login-v1',
  //   component: lazy(() => import('../../views/pages/authentication/LoginV1')),
  //   layout: 'BlankLayout'
  // },
  // {
  //   path: '/pages/login-v2',
  //   component: lazy(() => import('../../views/pages/authentication/LoginV2')),
  //   layout: 'BlankLayout'
  // },
  // {
  //   path: '/register',
  //   component: lazy(() => import('../../views/pages/authentication/Register')),
  //   layout: 'BlankLayout',
  //   meta: {
  //     authRoute: true
  //   }
  // },
  // {
  //   path: '/pages/register-v1',
  //   component: lazy(() => import('../../views/pages/authentication/RegisterV1')),
  //   layout: 'BlankLayout'
  // },
  // {
  //   path: '/pages/register-v2',
  //   component: lazy(() => import('../../views/pages/authentication/RegisterV2')),
  //   layout: 'BlankLayout'
  // },
  // {
  //   path: '/forgot-password',
  //   component: lazy(() => import('../../views/pages/authentication/ForgotPassword')),
  //   layout: 'BlankLayout',
  //   meta: {
  //     authRoute: true
  //   }
  // },
  // {
  //   path: '/pages/forgot-password-v1',
  //   component: lazy(() => import('../../views/pages/authentication/ForgotPasswordV1')),
  //   layout: 'BlankLayout'
  // },
  // {
  //   path: '/pages/forgot-password-v2',
  //   component: lazy(() => import('../../views/pages/authentication/ForgotPasswordV2.js')),
  //   layout: 'BlankLayout'
  // },
  // {
  //   path: '/pages/reset-password-v1',
  //   component: lazy(() => import('../../views/pages/authentication/ResetPasswordV1')),
  //   layout: 'BlankLayout'
  // },
  // {
  //   path: '/pages/reset-password-v2',
  //   component: lazy(() => import('../../views/pages/authentication/ResetPasswordV2')),
  //   layout: 'BlankLayout'
  // },
  // {
  //   path: '/pages/profile',
  //   component: lazy(() => import('../../views/pages/profile'))
  // },
  // {
  //   path: '/pages/faq',
  //   component: lazy(() => import('../../views/pages/faq'))
  // },
  // {
  //   path: '/pages/knowledge-base',
  //   exact: true,
  //   component: lazy(() => import('../../views/pages/knowledge-base/KnowledgeBase'))
  // },
  // {
  //   path: '/pages/knowledge-base/:category',
  //   exact: true,
  //   component: lazy(() => import('../../views/pages/knowledge-base/KnowledgeBaseCategory')),
  //   meta: {
  //     navLink: '/pages/knowledge-base'
  //   }
  // },
  // {
  //   path: '/pages/knowledge-base/:category/:question',
  //   component: lazy(() => import('../../views/pages/knowledge-base/KnowledgeBaseCategoryQuestion')),
  //   meta: {
  //     navLink: '/pages/knowledge-base'
  //   }
  // },
  // {
  //   path: '/pages/account-settings',
  //   component: lazy(() => import('../../views/pages/account-settings'))
  // },

  // {
  //   path: '/pages/blog/detail/:id',
  //   exact: true,
  //   component: lazy(() => import('../../views/pages/blog/details')),
  //   meta: {
  //     navLink: '/pages/blog/detail'
  //   }
  // },
  // {
  //   path: '/pages/blog/detail',
  //   exact: true,
  //   component: () => <Redirect to='/pages/blog/detail/1' />
  // },
  // {
  //   path: '/pages/blog/edit/:id',
  //   exact: true,
  //   component: lazy(() => import('../../views/pages/blog/edit')),
  //   meta: {
  //     navLink: '/pages/blog/edit'
  //   }
  // },
  // {
  //   path: '/pages/blog/edit',
  //   exact: true,
  //   component: () => <Redirect to='/pages/blog/edit/1' />
  // },
  // {
  //   path: '/pages/pricing',
  //   component: lazy(() => import('../../views/pages/pricing'))
  // },
  // {
  //   path: '/misc/coming-soon',
  //   component: lazy(() => import('../../views/pages/misc/ComingSoon')),
  //   layout: 'BlankLayout',
  //   meta: {
  //     publicRoute: true
  //   }
  // },
  {
    path: '/misc/not-authorized',
    component: lazy(() => import('../../views/pages/misc/NotAuthorized')),
    layout: 'BlankLayout',
    meta: {
      publicRoute: true
    }
  },
  {
    path: '/misc/maintenance',
    component: lazy(() => import('../../views/pages/misc/Maintenance')),
    layout: 'BlankLayout',
    meta: {
      publicRoute: true
    }
  },
  {
    path: '/misc/error',
    component: lazy(() => import('../../views/pages/misc/Error')),
    layout: 'BlankLayout',
    meta: {
      publicRoute: true
    }
  }
]

export default PagesRoutes
