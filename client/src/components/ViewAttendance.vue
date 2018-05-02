<template>
  <div class="view">
    <div v-if="this.posts.length>0">
      <h1> Attendance for</h1>
      <h1> {{this.title}} </h1>
      <v-btn color="primary" dark slot="activator" class="mb-2" @click="takeAttendance">Take Attendance</v-btn>
      <v-layout row-wrap justify-end>
        <v-checkbox label="Mark all as present" v-model="checkbox" @change="updatePost"></v-checkbox>
      </v-layout>
      <div> change attendance directly on each row</div>
      <div> if checkbox does not change table, reload </div>
      <v-layout row-wrap justify-start>
        <v-flex s7>
         <v-data-table :headers="headers" :items="items" hide-actions  class="elevation-1">
           <template slot="items" slot-scope="props">
               <td>
                 <v-avatar size="36px" class="grey lighten-4">
                  <img :src=props.item.url alt="none">
                </v-avatar>
                {{props.item.netid}}
              </td>
               <td>{{props.item.name}}</td>
               <td><v-edit-dialog :return-value.sync="props.item.attend" @open="props.item._attend = attendchange"
            @cancel="props.item.attend = attendchange || attendchange" lazy large >
                 {{ props.item.attend }}
                 <v-select slot="input" v-model="attendchange" returnObject :return-value.sync="attendchange" :items="attendtype" @change="senditem(props.item)" :returnValue="attendtype" single-line persistent required></v-select>
               </v-edit-dialog></td>

               <td>{{props.item.absence}}</td>
           </template>

           <template slot="no-data">
             <v-btn color="primary" @click="getPosts">Reset</v-btn>
           </template>

         </v-data-table>
     </v-flex>
    </v-layout>
  </div>
  <div v-else>
    <br><br>
    <h1>There are no students..! Import them now ~ </h1><br /><br />
    <router-link v-bind:to="{ name: 'Import' }" class="add_post_link">Import Class</router-link>
  </div>

</div>

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
        {text: 'Student', value: 'img', sortable:false, align:'left'},
        {text: 'Name', value: 'name'},
        {text: 'Attendance', value: 'attendance', sortable: false},
        {text: 'Absences', value: 'absences', sortable: false}
      ],
      route: '',
      checkbox: false,
      attendtype: [
        'present',
        'absent',
        'late'
      ],
      dataday:'',
      attendchange: null,
      val:'', //val of attendance date
      object: null, //object to use in attendchangefunc
    }
  },
  created() {
    let path = this.$route.path
    path = path.split('/')
    console.log("path",path);
    this.route = path[2]
    this.date = path[3]
    console.log("this.date",this.date);
    this.getPosts()
  },
  watch: {
    attendchange: function(val) {
      this.val = val
      this.attendchangefunc()
    }
  },
  methods: {
    senditem(item) {
      this.object = item
    },
    async attendchangefunc (){
      let split = this.date.split('-')
      let day = split[0].substring(2,4)+split[1]+split[2]
      this.dataday= day
      console.log("this.object",this.object);
      for (let days in this.object.date) {
        if (this.object.date[days].date === day) {
          this.object.date[days].attend = this.val
        }
      }
      await PostsService.updatePost({
        id: this.object._id,
        netid: this.object.netid,
        name: this.object.name,
        date: this.object.date,
        url: this.object.url
      })
      for (let items in this.posts) {
        if (this.posts[items]._id === this.object._id) {
          this.posts[items].date = this.object.date
          this.items[items].date = this.object.date
        }
      }
      const $this = this
      $this.$swal( //couldn't change datatable dynamically, could only reload page
        'Great!',
        `Your post has been updated!`,
        'success'
      ).then(function () {
        $this.$router.go({
          path: '/'
        })
      })
    },
    async updatePost() {
      let split = this.date.split('-')
      let day = split[0].substring(2,4)+split[1]+split[2]
      this.dataday= day
      let flag= false
      if (this.checkbox == true) { //mark all present
        let dateupdate = {date: day, attend: "present"}
        for (let student in this.posts) {
          for (let days in this.posts[student].date) {
            if (day.indexOf(this.posts[student].date[days].date)>-1) //if date there
              flag = true
              this.posts[student].date[days].attend = 'present'//only update
          }
          if (flag == false) {
            this.posts[student].date.push(dateupdate)
          }
          await PostsService.updatePost({
            id: this.posts[student]._id,
            netid: this.posts[student].netid,
            name: this.posts[student].name,
            date: this.posts[student].date,
            url: this.posts[student].url
          })
        }
        console.log("day",this.posts);
      }
      else { //delete pushed objects
        for (let i = 0; i < this.posts.length; i ++) {
          console.log("this.posts.length", this.posts[i]);
        }
      }
    },
    async getPosts () {
      const response = await PostsService.fetchPosts()
      console.log("response", response.data);
      let split = this.route.split('-')
      let subject = split[0]+'-'+split[1]+ ' ' +split[2] + '-' +split[3]
      console.log("subject",subject);
      for (let items in response.data.posts) {
        if (response.data.posts[items].prof == this.$auth.user.name && response.data.posts[items].subject == subject) {
          this.posts.push(response.data.posts[items])
        }

      }
      for (let things in this.posts) {
        this.posts[things].value = false
      }
      this.items = this.posts
      console.log("this.items",this.items);
      this.totalAbsence()

    },
    totalAbsence () {
      let split = this.date.split("-")
      let newdate = split[0].substring(2,4)+split[1]+split[2]
      this.title = split[0] + " " + split[1] + " " + split[2]
      console.log("new",newdate)
      for (let items in this.posts) {
        let totalabsence = 0
        for (let days in this.posts[items].date) {
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
      window.location.replace('http://188.166.245.15:8080/attendance/'+this.route +'/'+ this.date)
    }
  }
}
</script>

<style type="text/css" >
table th, table tr {
  text-align: left;
}
table thead {
  background: #f2f2f2;
}
table tr td {
  padding: 10px;
}
table tr:nth-child(odd) {
  background: #f2f2f2;
}
table th:nth-child(1) {
  background: #4d7ef7;
  color: #fff;
}
table th:nth-child(2) {
  background: #4d7ef7;
  color: #fff;
}
table th:nth-child(3) {
  background: #4d7ef7;
  color: #fff;
}
table th:nth-child(4) {
  background: #4d7ef7;
  color: #fff;
}
a {
  color: #4d7ef7;
  text-decoration: none;
}
a.add_post_link {
  background: #4d7ef7;
  color: #fff;
  padding: 10px 80px;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bold;
}
</style>
