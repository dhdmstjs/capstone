\<template>
  <div class="hello">
    <!-- will check if courses have been added -->
    <div v-if="posts.length>0">
      <h1>{{this.course}}</h1>
      <h2>Section {{this.section}}</h2>
    </div>
    <br>
    <div> click on date to take attendance for that day </div>
    <br>
    <v-layout row-wrap justify-center>
      <v-flex xs10>
        <v-date-picker width="290" v-model="date">
          <v-btn flat color="primary" @click="viewAtt(date)">View Attendance</v-btn>
        </v-date-picker>
      </v-flex>
    </v-layout>
</div>

</template>

<script>
import 'vuetify/dist/vuetify.min.css'
import PostsService from '@/services/PostsService'
import axios from 'axios'

export default {
  name: 'Class',
  components: {
  },
  data () {
    return {
      date: null,
      menu:false,
      course: '',
      section:'',
      posts: [],
      class: '', //class passed through route
      route: '',// route to path for view attendance
    }
  },
  created () {
    let path = this.$route.path
    path = path.split('/')
    this.route = path[2]
    let split = path[2].split('-')
    this.course = split[0] + " " + split[1] + " " + split[2]
    this.section = split[3]
    console.log("test", this.$auth.user.name);
    this.getPosts()
  },
  methods: {
    viewAtt(date) {
      console.log("date",date);
      if (this.date == null) { //date not chosen
        const $this = this
        $this.$swal({
          title: 'You have to choose a date first',
          text: 'Click on a date',
          type: 'warning',
        })
      } else {
        window.location.replace('http://188.166.245.15:8080/view/'+ this.route + '/' + date)
      }
    },
    importClass() {
      window.location.replace('http://188.166.245.15:8080/import')
    },
    async getPosts () {
      const response = await PostsService.fetchPosts()
      for (let items in response.data.posts) {
        if (response.data.posts[items].prof == this.$auth.user.name) {
          this.posts.push(response.data.posts[items])
        }
      }
      console.log('posts', this.posts)
    },
  }
}
</script>

<style>
/*.calendar {
  left: 10%;
}*/
</style>

<!-- <style src='boostrap/dist/css/boostrap.css'></style> -->
