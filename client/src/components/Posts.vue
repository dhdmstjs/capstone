<template>
 <div class="posts">
   <h1>Roster</h1>
   <div v-if="posts.length > 0">
   <v-btn color="primary" dark slot="activator" class="mb-2" @click="takeAttendance">Take Attendance</v-btn>

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
                  <v-text-field label="Student Name" v-model="editedItem.name"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field label="Net ID" v-model="editedItem.netid"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- old table
            <table align="center">
                <tr>
                  <td>Name</td>
                    <td v-for = "day in dateDisplay"> {{day.date}}</td>
                  <td align="center">Action</td>
                </tr>
                <tr v-for="post in posts">
                  <td>{{ post.name }}</td>
                  <td v-for = "day in post.date">{{day.attend}}</td>
                  <td align="center">
                    <router-link v-bind:to="{ name: 'EditPost', params: { id: post._id } }">Edit</router-link> |
                    <a href="#" @click="deletePost(post._id)">Delete</a>
                  </td>
                </tr>
              </table> -->

    <!-- data table -->
      <v-layout row-wrap justify-start>
        <v-flex s7>
       <v-data-table :headers="headers" :items="items" hide-actions class="elevation-1">
         <template slot="items" slot-scope="props">
           <td>{{props.item.name}}</td>
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

export default {
  name: 'posts',
  components: {
        swipe: Swipe,
        swipeItem: SwipeItem
      },
    data () {
      return {
        posts: [],
        dates : [],
        headers: [
          // {text: 'Student', value: 'picture', sortable:'false',align:'left'},
          {text: 'Name', value: 'name'},
          {text: 'Net ID', value: 'netid'},
          { text: 'Actions', value: 'name', sortable: false }
        ],
        items: [],
        editedIndex: -1,
        dialog: false,
        editedItem: {
          _id: '',
          name: '',
          netid: '',
          date: []
        }
      }
    },
  mounted () {
    this.getPosts()
  },
  computed: {
    dateDisplay: function(){
      console.log("this.posts[0].date", this.posts[0].date);
      return this.posts[0].date
    },
    formTitle () {
      return this.editedIndex === -1 ? 'New Student' : 'Edit Student'
    }
    // attendDisplay: function() {
    //   let item = []
    //   for (let items in this.posts){
    //     for (let stuff in this.posts[items].date) {
    //       item.push(this.posts[items].date[stuff])
    //     }
    //   }
    //   console.log("item",item);
    //   return item
    // }
  },
  methods: {
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
      console.log("response", response.data);
      this.posts = response.data.posts
      console.log('posts', this.posts)
      this.items = response.data.posts
      console.log("items",this.items);
      this.dates = this.getDate(this.posts)
    },
    async deletePost (id) {
      console.log("iddelete",id);
      const $this = this
      console.log("this?", $this);
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
    console.log("item",item)
    this.editedIndex = this.items.indexOf(item)
    this.editedItem = Object.assign({}, item)
    this.dialog = true
   },

   async updatePost () {
     console.log("thiedit",this.editedItem._id);
     await PostsService.updatePost({
       id: this.editedItem._id,
       netid: this.editedItem.netid,
       name: this.editedItem.name,
       date: this.editedItem.date
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
        this.items.push(this.editedItem)
      }
      this.close()
    },
    async addPost () {
      await PostsService.addPost({
        id: this.editedItem._id,
        netid: this.editedItem.netid,
        name: this.editedItem.name,
        date: this.editedItem.date
      })
      this.$swal(
        'Great!',
        `Your post has been added!`,
        'success'
      )
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
table tr:nth-child(1) {
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
