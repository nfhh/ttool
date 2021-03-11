import { createRouter, createWebHashHistory } from 'vue-router'
import Index from '../views/index/Index'
import { getLocalUserInfo } from '@/utils/local'

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index,
    beforeEnter (to, from, next) {
      const { logined } = getLocalUserInfo()
      logined ? next({ name: 'Dashboard' }) : next()
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/dashboard/Dashboard.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const { logined } = getLocalUserInfo()
  const { name } = to
  const isLoginOrRegister = name === 'Index';
  (logined || isLoginOrRegister) ? next() : next({ name: 'Index' })
})
export default router
