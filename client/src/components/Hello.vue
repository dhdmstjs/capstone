<template>
  <div class="hello">
    <h2 >Hello, {{$auth.user.name}}!</h2>
    <br>
    <v-btn color="primary" dark slot="activator" class="mb-2" @click="importClass">Import New Class</v-btn>
    <br><br>
    <!-- will check if courses have been added -->
    <h2>Courses</h2>
    <div v-if="posts.length>0">
      <div v-for="items in this.subjects">
        <v-btn color="primary" dark slot="activator" class="mb-2" @click="gotoPage(items)">{{items}}</v-btn>
      </div>
    </div>

</div>

</template>

<script>
import 'vuetify/dist/vuetify.min.css'
import PostsService from '@/services/PostsService'
import axios from 'axios'
import Vue from 'vue'

export default {
  name: 'hello',
  components: {
  },
  data () {
    return {
      date: null,
      menu:false,
      subjects: [],
      posts: [],
    }
  },
  mounted () {
    this.getPosts()
    console.log("test", this.$auth.user.name);
  },
  methods: {
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
      this.getCourse()
    },
    getCourse(){
      for (let items in this.posts) {
        if (!(this.subjects.includes(this.posts[items].subject)) && (this.posts[items].subject != undefined)) {
          this.subjects.push(this.posts[items].subject)
        }
      }
    },
    gotoPage (items) { //route to appropriate page
      let split = items.split(" ")
      let route = split[0]+"-"+split[1]
      Vue.prototype.$course = route
      console.log("$course", this.$course);
      window.location.replace('http://188.166.245.15:8080/class/'+ this.$course)
    }
  }
}
</script>

<style>
/*.calendar {
  left: 10%;
}*/
</style>

<!-- <style src='boostrap/dist/css/boostrap.css'></style> -->
