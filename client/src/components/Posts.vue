<template>
 <div class="posts">
   <h1>Roster</h1>
   <div v-if="posts.length > 0">
   <v-btn color="primary" dark slot="activator" class="mb-2" @click="takeAttendance">Take Attendance</v-btn>
   <!-- <v-layout row-wrap justify-end>
     <v-checkbox label="Delete All" v-model="deleteCheck" @change="deleteAll"></v-checkbox>
   </v-layout> -->
<!-- edit popup menu -->
     <v-dialog v-model="dialog" max-width="500px">
        <v-btn color="primary" dark slot="activator" class="mb-2">New Student</v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field label="Name (Last name, First name)" v-model="editedItem.name" required></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field label="Net ID" v-model="editedItem.netid" required></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field label="N number (N00000000)" v-model="editedItem.nid" required></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <div>import image:</div>
                  <input type="file" class="form-control" v-on:change="upload" accept="image/*"/>
                </v-flex>
              </v-layout>
              <div v-if="this.editedIndex>-1">
                <!-- do nothing if edits -->
              </div>
              <div v-else>
                <v-flex xs12 sm6 md4>
                  <v-select
                  label="Grade" v-model="editedItem.grade" :items="grades" required></v-select>
                </v-flex>
              </div>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    <!-- data table -->
      <v-layout row-wrap justify-start>
        <v-flex s7>
       <v-data-table :headers="headers" :items="items" item-key="netid" hide-actions  class="elevation-1">
         <template slot="items" slot-scope="props">
             <td v-on:click="studentPage(props.item)">
               <v-avatar size="40px" class="grey lighten-4">
                <img :src=props.item.url alt="none">
              </v-avatar>
            </td>
             <td v-on:click="studentPage(props.item)" >{{props.item.name}}</td>
             <td>{{props.item.netid}}</td>
             <td class="justify-center layout px-0">
               <v-btn icon class="mx-0" @click="editItem(props.item)">
                 <v-icon color="teal">edit</v-icon>
               </v-btn>
               <v-btn icon class="mx-0" @click="deletePost(props.item)">
                 <v-icon color="pink">delete</v-icon>
               </v-btn>
             </td>
         </template>

         <template slot="no-data">
           <v-btn color="primary" @click="getPosts">Reset</v-btn>
         </template>
       </v-data-table>
     </v-flex>
   </v-layout>

   </div>
   <div v-else>
     There are no students..! Import them now ~ <br /><br />
     <router-link v-bind:to="{ name: 'Import' }" class="add_post_link">Import Class</router-link>
   </div>
 </div>
</template>

<script>
import PostsService from '@/services/PostsService'
import { Swipe, SwipeItem } from 'vue-swipe'
import 'vuetify/dist/vuetify.min.css'
import axios from 'axios'
import cloudinary from 'cloudinary-core'


export default {
  name: 'posts',
  components: {
        swipe: Swipe,
        swipeItem: SwipeItem
      },
    data () {
      return {
        cloudinary: {
         uploadPreset: 'ktm6uosm',
         apiKey: '297185572485971',
         cloudName: 'dcpuysglb'
        },
        posts: [],
        dates : [],
        headers: [
          {text: 'Student', value: 'img', sortable:false, align:'left'},
          {text: 'Name', value: 'name'},
          {text: 'Net ID', value: 'netid'},
          { text: 'Actions', value: 'name', sortable: false }
        ],
        items: [],
        grades: [
          'Freshman',
          'Sophomore',
          'Junior',
          'Senior'
        ],
        editedIndex: -1,
        dialog: false,
        editedItem: {
          _id: '',
          name: '',
          netid: '',
          date: [],
          prof: '',
          nid: '',
          grade: '',
          subject: '',
          url: '',
        },
        route:'',
        deleteCheck:false,
        subject: '', //subject to add to db
      }
    },
  mounted () {
    this.getPosts()
    console.log("this.$auth.user.name", this.$auth.user.name);
    let path = this.$route.path
    path = path.split('/')
    this.route = path[2]
    console.log("route post", this.route);
  },
  computed: {
    dateDisplay: function(){
      console.log("this.posts[0].date", this.posts[0].date);
      return this.posts[0].date
    },
    formTitle () {
      return this.editedIndex === -1 ? 'New Student' : 'Edit Student'
    },
  },
  methods: {
    studentPage (item) {
      window.location.replace('http://localhost:8080/student/' +this.route + '/'+ item._id)
    },
    async upload(event) { // for images
      console.log("event", event);
      let file = event.target.files
      console.log("file",file);
      const formData = new FormData()
      console.log("file all", file);
      file[0]['tags'] = this.editedItem._id
      console.log("this.edited_od",this.editedItem._id);
      formData.append('file', file[0]);
      formData.append('upload_preset', this.cloudinary.uploadPreset);
      formData.append('description', this.editedItem._id);

      // formData.append('tags', this.sid);
      // For debug purpose only
      // Inspects the content of formData
      for(var pair of formData.entries()) {
        console.log('hihi'+pair[0]+', '+pair[1]);
      }
      const $this = this
      axios.post('http://localhost:8081/posts/img', formData)
        this.$swal(
          'Your image is updating~',
          `Please wait...`,
          'success'
        ).then( function () {
          console.log("posted");
          $this.$router.go({
            path: '/'
          })
        })
    },
    takeAttendance () {
      let today = new Date()
      var dd = today.getDate()
      var mm = today.getMonth()+1
      var yyyy = today.getFullYear()
      if(dd<10){
          dd='0'+dd
      }
      if(mm<10) {
          mm='0'+mm
      }
      today = yyyy+"-"+mm+"-"+dd
      window.location.replace('http://localhost:8080/attendance/' + today)
    },
    getDate(text) {
      let dates = []
      for (let object in text) {
        for (let items in text[object].date){
          var contains = (dates.indexOf(text[object].date[items].date) > -1)
          if (!contains) {
            dates.push(text[object].date[items].date)
          }
        }
      }
      console.log("dates",dates);
    },
    async getPosts () {
      const response = await PostsService.fetchPosts()
      let split = this.route.split('-')
      let subject = split[0]+'-'+split[1]+ ' ' +split[2] + '-' +split[3]
      this.subject = subject
      console.log("subject",subject);
      for (let items in response.data.posts) {
        if (response.data.posts[items].prof == this.$auth.user.name && response.data.posts[items].subject == subject) {
          this.posts.push(response.data.posts[items])
        }
        // if (this.route.includes('undefined')){
        //   this.posts.push(response.data.posts[items])
        // }
      }
      this.items = this.posts
      console.log("items",this.items);
      console.log("this.posts",this.posts);
      this.dates = this.getDate(this.posts)
    },
    async deleteAll (id) {
      console.log("idid",id);
      for (let items in this.posts){
        PostsService.deletePost(this.posts[items]._id)
      }
    },
    async deletePost (id) {
      const $this = this
      $this.$swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then(function () {
        PostsService.deletePost(id._id)
        $this.$router.go({
          path: '/'
        })
      })
    },
    changeSwipe(newIndex, oldIndex) {
     console.log(`swipe from ${oldIndex} to ${newIndex}`)
   },
   editItem(item) {
    this.editedIndex = this.items.indexOf(item)
    this.editedItem = Object.assign({}, item)
    console.log("item",item);
    if (item.url == undefined) {
      this.editedItem.url = ''
    } else {
      this.editedItem.url = item.url
    }
    console.log("edited",this.editedItem);
    this.dialog = true
    this.updatePost()
   },

   async updatePost () {
     console.log("thiedit",this.editedItem._id);
     await PostsService.updatePost({
       id: this.editedItem._id,
       netid: this.editedItem.netid,
       name: this.editedItem.name,
       date: this.editedItem.date,
       prof: this.$auth.user.name,
       url: this.editedItem.url

     })
     this.$router.push({ name: 'Posts' })
   },
   close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },
    save () {
      if (this.editedIndex > -1) { //edit
        console.log("this.$auth.user.name",this.$auth.user.name);
        Object.assign(this.items[this.editedIndex], this.editedItem)
        console.log("editing");
        this.updatePost()
        this.$swal(
          'Great!',
          `Your post has been updated!`,
          'success'
        )
      } else { //add new
        console.log("adding new");
        this.addPost()
      }
      this.close()
    },
    async addPost () {
      let flag = false
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].netid == this.editedItem.netid) {
          flag = true
          console.log("student in db");
          this.$swal(
            `Student already in database. Check netid`,
            'success'
          )
        }
      }
      if (flag == false) {
        console.log("not in db ");
        await PostsService.addPost({
          id: this.editedItem._id,
          netid: this.editedItem.netid,
          name: this.editedItem.name,
          date: this.editedItem.date,
          prof: this.$auth.user.name,
          nid: this.editedItem.nid,
          grade: this.editedItem.grade,
          subject: this.subject
        })
        this.$swal(
          'Great!',
          `Your post has been added!`,
          'success'
        )
        this.editedItem.subject= this.subject
        this.editedItem.prof = this.$auth.user.name
        console.log("this.edited", this.editedItem);
        this.items.push(this.editedItem)
      }
      this.$router.push({ name: 'Posts' })
    }
  }
}

</script>
<style type="text/css">
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
/*table tr:nth-child(1) {
  background: #4d7ef7;
  color: #fff;
}*/
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
.expand {
  justify-content: center;
}
.form-control{
  justify-content: center;
  border: 1px solid #000;
}

</style>
