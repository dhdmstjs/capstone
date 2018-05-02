<template>
  <div class="app">
    <h3>Import Students</h3>
    <br>
    <xls-csv-parser :columns="columns" @on-validate="onValidate" :help="help" lang="en"></xls-csv-parser>
    <br><br>
    <div class="results" v-if="results">
      <h3>Results:</h3>
      <pre>{{ JSON.stringify(results, null, 2) }}</pre>
    </div>
  </div>
</template>

<script>
  import XlsCsvParser from 'vue-xls-csv-parser'
  import PostsService from '@/services/PostsService'
  // import '../../static/boostrap.min.css'
  export default {
    name: 'App',
    components: {
      XlsCsvParser,
    },
    data() {
      return {
        columns: [
          { name: 'Campus N ID', value: 'nid', isOptional: true  },
          { name: 'Net ID', value: 'netid' },
          { name: 'Student Name', value: 'name', isOptional: true },
          { name: 'Grade Basis', value: 'basis', isOptional: true  },
          { name: 'Units', value: 'units', isOptional: true  },
          { name: 'Program and Plan', value: 'program', isOptional: true  },
          { name: 'Level/Grade', value: 'grade', isOptional: true  },
          { name: 'Subject', value: 'subject', isOptional: true },
          { name: 'Catalog', value: 'catalog', isOptional: true },
          { name: 'Section', value: 'section', isOptional: true }        ],
        results: null,
        help: 'Necessary columns are: Campus ID (N00000000), NetID, Name',
        subject: '',
        previous:[], //previous posts
      };
    },
    mounted () {
      this.getPosts()
    },
    methods: {
      async getPosts () {
        const response = await PostsService.fetchPosts()
        for (let items in response.data.posts) {
          if (response.data.posts[items].prof == this.$auth.user.name) {
            this.previous.push(response.data.posts[items])
          }
        }
        console.log('posts', this.previous)
      },
      onValidate(results) {
        this.results = results;
        this.parseJSON(results)
      },
      parseName(name) {
        let temp = name.split(',')
        let newname = temp[0] + ', ' + temp [1]
        return newname
      },
      parseNetID(netid){
        if (netid.includes('@')) {
          let split = netid.split("@")
          let newID = split[0]
          return newID
        } else {
          return netid
        }
      },
      parseJSON(results) {
        let test = results
        let newJson = []
        let testLength = test.length
        let dataLength = test[0].data.length
        console.log("test, data", testLength, " ", dataLength)
        console.log('hi',test)
        for (let i = 0; i < dataLength; i++){ //number of students
          let temp = {}
          for (let y = 0; y < testLength; y++) { //how many columns
            let columnName = test[y].column
            if (columnName == 'nid') {
              temp.nid = test[y].data[i]
            }
            if (columnName == 'netid') {
              temp.netid = this.parseNetID(test[y].data[i])
            }
            if (columnName == 'name') {
              temp.name = this.parseName(test[y].data[i])
            }
            if (columnName == 'basis') {
              temp.basis = test[y].data[i]
            }
            if (columnName == 'units') {
              temp.units = test[y].data[i]
            }
            if (columnName == 'program') {
              temp.program = test[y].data[i]
            }
            if (columnName == 'grade') {
              temp.grade = test[y].data[i]
            }
            if (columnName == 'subject') {
              temp.subject = test[y].data[i]
            }
            if (columnName == 'catalog') {
              temp.catalog = test[y].data[i]
            }
            if (columnName == 'section') {
              temp.section = test[y].data[i]
            }
            this.subject = temp.subject + '-' + temp.catalog + '-' +temp.section
          }
          newJson.push(temp)
        }
        console.log("temp??",newJson)
        this.addPost(newJson)
      },
      //add students from csv
      async addPost(newJson) {
        let flag = false
        for (let i = 0; i < newJson.length; i++) {
          for (let j = 0; j < this.previous.length; j++){
            if (this.previous[j].netid == newJson[i].netid) {
              flag = true
            }
          }
          if (flag == false) {
            await PostsService.addPost({
                prof: this.$auth.user.name,
                nid: newJson[i].nid,
                netid: newJson[i].netid,
                name: newJson[i].name,
                program: newJson[i].program,
                grade: newJson[i].grade,
                subject: newJson[i].subject + " " + newJson[i].catalog + "-" + newJson[i].section,
            })
          } else {
            flag = false
          }
        }
         this.$router.push({name:'Posts'})
         window.location.replace('http://188.166.245.15:8080/posts/'+this.subject)
      }
    },
  }
</script>

<style scoped>
@import url('https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css');
</style>
