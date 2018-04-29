import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Posts from '@/components/Posts'
import NewPost from '@/components/NewPost'
import EditPost from '@/components/EditPost'
import Import from '@/components/Import'
import View from '@/components/ViewAttendance'
import Login from '@/components/Login'
import Attendance from '@/components/Attendance'
import Callback from '@/components/Callback.vue'


Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/posts',
      name: 'Posts',
      component: Posts
    },
    {
      path: '/posts/new',
      name: 'NewPost',
      component: NewPost
    },
    {
      path: '/posts/:id',
      name: 'EditPost',
      component: EditPost
    },
    {
      path: '/import',
      name: 'Import',
      component: Import
    },
    {
      path: '/view/:date',
      name: 'ViewAttendance',
      component: View
    },
    {
      path: '/login',
      name: 'Login',
      component: View
    },
    {
      path: '/attendance/:date',
      name: 'Attendance',
      component: Attendance
    },
    {
      path: '/callback',
      name: 'Callback',
      component: Callback
    }
  ]
})

// very basic "setup" of a global guard
router.beforeEach((to, from, next) => {
  if(to.name == 'Callback') { // check if "to"-route is "callback" and allow access
    next()
  } else if (router.app.$auth.isAuthenticated()) { // if authenticated allow access
    next()
  } else { // trigger auth0 login
    router.app.$auth.login()
  }
})

export default router
