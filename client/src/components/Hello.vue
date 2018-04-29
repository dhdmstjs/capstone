<template>
  <div class="hello">
    <h1>{{this.course}}</h1>
    <h2>{{this.section}}</h2>
    <br>
    <v-btn color="primary" dark slot="activator" class="mb-2" @click="importClass">Import New Class</v-btn>
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

export default {
  name: 'hello',
  components: {
  },
  data () {
    return {
      date: null,
      menu:false,
      course: '',
      section:'',
      posts: []
    }
  },
  mounted () {
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
        window.location.replace('http://localhost:8080/view/'+ date)
      }
    },
    importClass() {
      window.location.replace('http://localhost:8080/import')
    },
    async getPosts () {
      const response = await PostsService.fetchPosts()
      console.log("response", response.data);
      this.posts = response.data.posts
      console.log('posts', this.posts)
      this.getCourse()
    },
    getCourse(){
      let split = this.posts[4].subject.split('-')
      this.course = split[0] + " " + split[1]
      this.section= "Section " + split[2]
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
