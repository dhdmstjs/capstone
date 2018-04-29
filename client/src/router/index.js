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
import callback from '@/components/callback'


Vue.use(Router)

export default new Router({
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
      name: 'callback',
      component: Attendance
    }
  ]
})
