<template>
  <div class="view">
    <h1> Attendance for</h1>
    <h1> {{this.title}} </h1>
    <v-btn color="primary" dark slot="activator" class="mb-2" @click="takeAttendance">Take Attendance</v-btn>

    <v-layout row-wrap justify-start>
      <v-flex s7>
       <v-data-table :headers="headers" :items="items" hide-actions class="elevation-1">
         <template slot="items" slot-scope="props">
           <td>{{props.item.name}}</td>
           <td>{{props.item.netid}}</td>
           <td>{{props.item.attend}}</td>
           <td>{{props.item.absence}}</td>

         </template>
         <template slot="no-data">
           <v-btn color="primary" @click="getPosts">Reset</v-btn>
         </template>
       </v-data-table>
   </v-flex>
  </v-layout></div>

</template>

<script>
import 'vuetify/dist/vuetify.min.css'
import PostsService from '@/services/PostsService'

export default {
  name: 'ViewAttendance',
  components: {
  },
  data () {
    return {
      date: '', //date passed through params
      title:'', //date displayed on header
      menu:false,
      posts: [], //data students
      dates: [],
      items: [], //for table
      headers: [
        {text: 'Name', value: 'name'},
        {text: 'Net ID', value: 'netid'},
        {text: 'Attendance', value: 'attendance', sortable: false},
        {text: 'Absences', value: 'absences', sortable: false}
      ],
    }
  },
  created() {
    let path = this.$route.path
    path = path.split('/')
    this.date = path[2]
    console.log("this.date",this.date);
    this.getPosts()
  },
  methods: {
    async getPosts () {
      const response = await PostsService.fetchPosts()
      console.log("response", response.data);
      this.posts = response.data.posts
      console.log('posts', this.posts)
      this.items = response.data.posts
      console.log("items",this.items)
      this.totalAbsence()

    },
    totalAbsence () {
      let split = this.date.split("-")
      let newdate = split[0].substring(2,4)+split[1]+split[2]
      this.title = split[0] + " " + split[1] + " " + split[2]
      console.log("new",newdate)
      for (let items in this.posts) {
        let totalabsence = 0

        console.log("hi");
        for (let days in this.posts[items].date) {
          console.log("posts[items]2",this.posts[items].date[days])
          if (this.posts[items].date[days].attend == "absent") {
            console.log("student",this.posts[items]);
            totalabsence ++
            this.items[items]["absence"] = totalabsence
          }
          if (this.posts[items].date[days].date == newdate) {
            this.items[items]["attend"] = this.posts[items].date[days].attend
          }
        }
      }
    },
    takeAttendance () {
      window.location.replace('http://localhost:8080/attendance/' + this.date)
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
