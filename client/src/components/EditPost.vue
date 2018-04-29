<template>
  <div class="posts">
    <h1>Edit Post</h1>
      <div class="form">
        <div>
          <input type="text" name="netid" placeholder="NETID" v-model="netid">
        </div>
        <div>
          <input type="text" name = "name" placeholder="NAME" v-model="name">
        </div>
        <div>
          <textarea name = "date" placeholder="DATE: attendance type" v-model="date"></textarea>
        </div>
        <div>
          <button class="app_post_btn" @click="updatePost">Update</button>
        </div>
      </div>
  </div>
</template>

<script>
import PostsService from '@/services/PostsService'
export default {
  name: 'EditPost',
  data () {
    return {
      netid: '',
      name: '',
      date: []
    }
  },
  mounted () {
    this.getPost()
  },
  methods: {
    parseDate(text) {
      let splitWords = text.split('\n')
      let date = []
      console.log("splitWords", splitWords);
      for (let words in splitWords) {
        let split = splitWords[words].split(',')
        let d1 = split[0]
        let d2 = split[1]
        date.push({date:d1, attend:d2})
      }
      console.log("date",date);
      return date
    },
    getDate(text) {
      let date, attend
      let combined = ""
      console.log("text",text);
      for (let item in text) {
        date = text[item].date
        attend = text[item].attend
        combined += date.concat(",",attend)
        combined += '\n'
        console.log("com", combined);
      }
      combined = combined.replace(/\n$/, "")
      return combined

      //date.concat(",",attend,"\n")
    },
    async getPost () {
      const response = await PostsService.getPost({
        id: this.$route.params.id
      })
      console.log("response,data", response.data);
      this.netid = response.data.netid
      this.name = response.data.name
      this.date = this.getDate(response.data.date)
      console.log("id,name", this.netid, " ", this.name);
      // this.$router.push({ name: 'Posts' })
    },
    async updatePost () {
      await PostsService.updatePost({
        id: this.$route.params.id,
        netid: this.netid,
        name: this.name,
        date: this.parseDate(this.date)
      })
      this.$swal(
        'Great!',
        `Your post has been updated!`,
        'success'
      )
      this.$router.push({ name: 'Posts' })
    }
  }
}
</script>
<style type="text/css">
.form input, .form textarea {
  width: 500px;
  padding: 10px;
  border: 1px solid #e0dede;
  outline: none;
  font-size: 12px;
}
.form div {
  margin: 20px;
}
.app_post_btn {
  background: #4d7ef7;
  color: #fff;
  padding: 10px 80px;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bold;
  width: 520px;
  border: none;
  cursor: pointer;
}
</style>
