import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import Posts from '@/components/Posts'
import NewPost from '@/components/NewPost'
import EditPost from '@/components/EditPost'
import Import from '@/components/Import'
import View from '@/components/ViewAttendance'
import Class from '@/components/Class'
import Attendance from '@/components/Attendance'
import Callback from '@/components/Callback.vue'
import Student from '@/components/Student.vue'


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
      path: '/posts/:class',
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
      path: '/view/:class/:date',
      name: 'ViewAttendance',
      component: View
    },
    {
      path: '/class/:id',
      name: 'Class',
      component: Class
    },
    {
      path: '/attendance/:class/:date',
      name: 'Attendance',
      component: Attendance
    },
    {
      path: '/callback',
      name: 'Callback',
      component: Callback
    },
    {
      path: '/student/:class/:id',
      name: 'Student',
      component: Student
    }
  ]
})

// very basic "setup" of a global guard
router.beforeEach((to, from, next) => {
  if(to.name == 'Callback') { // check if "to"-route is "callback" and allow access
    next()
  } else if (router.app.$auth.isAuthenticated()) { // if authenticated allow access
    Vue.prototype.$login = 'true'
    console.log("router",Vue.prototype.$login);
    next()
  } else { // trigger auth0 login
    Vue.prototype.$login = 'false'
    router.app.$auth.login()
  }
})

export default router
