<template>
  <div class="student">
    <h1> Student Profile </h1>
    <div v-if="this.url == '' || this.url == null">
      <h3> take a picture with your camera </h3>
      <h3> and then upload it here~ </h3>
      <input type="file" class="form-control" v-on:change="upload" accept="image/*"/>
    </div>
    <div v-if="this.url != '' && this.url != null">
        <div id="preview">
          <img v-if="url" :src="url" />
        </div>
        <v-btn color="primary" dark slot="activator" class="mb-1" @click="deletePic">delete picture</v-btn>
    </div>
    <br>
    <h2> {{this.name}} </h2>
    <h3> Total Absences:  {{this.absences}}</h3>
    <h3> Net ID:  {{this.netid}}</h3>
    <h3> N Number:  {{this.nid}}</h3>
    <h3> Grade:  {{this.grade}}</h3>
    <h3> Major:  {{this.program}}</h3>

  </div>

</template>

<script>
import 'vuetify/dist/vuetify.min.css'
import PostsService from '@/services/PostsService'
import axios from 'axios'
import Vue from 'vue'
import cloudinary from 'cloudinary-core'



export default {
  name: 'Student',
  components: {
  },
  data () {
    return {
      cloudinary: {
       uploadPreset: 'ktm6uosm',
       apiKey: '297185572485971',
       cloudName: 'dcpuysglb'
      },
      sid: '', // student _id from path
      student: null,
      grade: null,
      netid: null,
      nid: null,
      date: [],
      program: null,
      name: null,
      url: null,
      testurl: null,
      cl: null,
      spin: false,
      images: [],
      absences: '',
      route:'',
      title: '', //date title

    }
  },
  created () {
    let path = this.$route.path
    path = path.split('/')
    this.sid = path[3]
    this.route = path[2]
    this.$course = this.route
    console.log("this.url", this.url);
  },
  mounted () {
    this.getPosts()
  },
  computed: {
    clUrl: function() {
        return `https://api.cloudinary.com/v1_1/${this.cloudinary.cloudName}/upload`
        },
  },
  methods: {
    async upload(event) {
      let file = event.target.files
      console.log("file",file);
      const formData = new FormData()
      console.log("file all", file);
      file[0]['tags'] = this.sid
      formData.append('file', file[0]);
      formData.append('upload_preset', this.cloudinary.uploadPreset);
      formData.append('description', this.sid);

      for(var pair of formData.entries()) {
        console.log('hihi'+pair[0]+', '+pair[1]);
      }
      const $this = this
      axios.post('http://188.166.245.15:8081/posts/img', formData)
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
    async getPosts() {
      const response = await PostsService.fetchPosts()
      let student
      for (let items in response.data.posts) {
        if (response.data.posts[items]._id == this.sid) {
          student = response.data.posts[items]
        }
      }
      this.student = student
      this.grade = student.grade
      this.netid = student.netid
      this.nid = student.nid
      console.log("studentdate",student.date);
      this.date = student.date
      this.program = student.program
      this.name = student.name
      this.url = student.url
      console.log("student",student);
      let split = student.subject.split(' ')

      this.route = split[0] + "-" + split[1]
      this.$course= this.route
      console.log("this$", this.$course);
      this.totalAbsence()

    },
    async deletePic() {
      this.url = null
      await PostsService.updatePost({
        id: this.sid,
        netid: this.netid,
        name: this.name,
        url: ''
      })
    },
    totalAbsence () {
      let total = 0
      for (let days in this.date) {
        console.log("this.date", this.date[days]);
        if (this.date[days].date == 'absent') {
          total ++
        }
      }
      this.absences = total
    }
  }
}
</script>

<style scoped>
#preview {
  display: flex;
  justify-content: center;
  align-items: center;
}

#preview img {
  max-width: 100%;
  max-height: 300px;
}
.form-control{
  justify-content: center;
  border: 1px solid #000;
}
</style>
