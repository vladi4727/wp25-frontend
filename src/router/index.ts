import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import { useAuth } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/createaccount',
      name: 'createaccount',
      component: () => import('../views/CreateAccountView.vue'), // lazy-loaded
    },
    {
      path: '/createprofile',
      name: 'createprofile',
      component: () => import('../views/CreateProfileView.vue'), // lazy-loaded
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'), // lazy-loaded
      meta: { requiresAuth: true },
    },
    {
      path: '/matches',
      name: 'matches',
      component: () => import('../views/MatchView.vue'), // lazy-loaded
      meta: { requiresAuth: true },
    },
    {
      path: '/chat/:id',
      name: 'chat',
      component: () => import('../views/ChatView.vue'), // lazy-loaded
      props: true, // allows ChatView to accept prop 'id' if desired
      meta: { requiresAuth: true },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to, from, next) => {
  const auth = useAuth()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !auth.isTokenValid()) {
    next('/')
  } else {
    next()
  }
})

export default router
