import { createRouter, createWebHistory } from 'vue-router'
import Default from '@/views/Layouts/Default.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   meta: {
    //     authRequired: true,
    //   },
    //   component: Default,
    //   children: [
    //     {
    //       path: '/',
    //       name: 'home',
    //       component: () => import('../views/Home.vue'),
    //       meta: {
    //         title: 'Trang chủ',
    //       },
    //     },
    //   ],
    // },
    {
      path: '/',
      component: Default,
      children: [
        {
          path: '/',
          name: 'Staff',
          component: () => import('../views/Staff.vue'),
          meta: {
            authRequired: true,
            title: 'Nhân viên',
          },
        },
        {
          path: '/:code',
          name: 'StaffDetail',
          component: () => import('../views/StaffDetail.vue'),
          meta: {
            authRequired: true,
            title: 'Chi tiết nhân viên',
          },
        },
      ],
    },
    {
      path: '/payroll',
      component: Default,
      children: [
        {
          path: '',
          name: 'Payroll',
          component: () => import('../views/Payroll.vue'),
          meta: {
            authRequired: true,
            title: 'Bảng lương',
          },
        },
        {
          path: ':id',
          name: 'PayrollDetail',
          component: () => import('../views/PayrollDetail.vue'),
          meta: {
            authRequired: true,
            title: 'Chi tiết bảng lương',
          },
        },
      ],
    },
    {
      path: '/timesheet',
      component: Default,
      children: [
        {
          path: '',
          name: 'Timesheet',
          component: () => import('../views/Timesheet.vue'),
          meta: {
            authRequired: true,
            title: 'Bảng chấm công',
          },
        },
        {
          path: ':code',
          name: 'TimeSheetDetail',
          component: () => import('../views/TimeSheetDetail.vue'),
          meta: {
            authRequired: true,
            title: 'Chi tiết chấm công',
          },
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
  document.title = to.meta.title || 'Trương Anh'
})
export default router
