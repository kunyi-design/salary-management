import { createRouter, createWebHistory } from 'vue-router'
import Default from '@/views/Layouts/Default.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      meta: {
        authRequired: true,
      },
      component: Default,
      children: [
        {
          path: '/',
          name: 'home',
          component: () => import('../views/Home.vue'),
          meta: {
            title: 'Trang chủ',
          },
        },
      ],
    },
    {
      path: '/staff',
      meta: {
        authRequired: true,
        title: 'Nhân viên',
      },
      component: Default,
      children: [
        {
          path: '/staff',
          name: 'Staff',
          component: () => import('../views/Staff.vue'),
        },
        {
          path: '/staff/:code',
          name: 'StaffDetail',
          component: () => import('../views/StaffDetail.vue'),
        },
      ],
    },
    {
      path: '/payroll',
      meta: {
        authRequired: true,
        title: 'Bảng lương',
      },
      component: Default,
      children: [
        {
          path: '/payroll',
          name: 'Payroll',
          component: () => import('../views/Payroll.vue'),
        },
        // {
        //   path: '/staff/:code',
        //   name: 'StaffDetail',
        //   component: () => import('../views/StaffDetail.vue'),
        // },
      ],
    },
    {
      path: '/timesheet',
      meta: {
        authRequired: true,
        title: 'Bảng chấm công',
      },
      component: Default,
      children: [
        {
          path: '/timesheet',
          name: 'Timesheet',
          component: () => import('../views/Timesheet.vue'),
        },
        {
          path: '/timesheet/:code',
          name: 'TimeSheetDetail',
          component: () => import('../views/TimeSheetDetail.vue'),
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        title: 'Đăng nhập',
      },
      component: () => import('../views/Auth/Login.vue'),
    },
    {
      path: '/register',
      name: 'register',
      meta: {
        title: 'Đăng ký',
      },
      component: () => import('../views/Auth/Register.vue'),
    },
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.matched.some((record) => record.meta.authRequired)) {
    if (!token) {
      return next({ path: '/login' })
    }
  }
  next()
})
router.afterEach((to) => {
  document.title = to.meta.title || 'An Dev'
})
export default router
