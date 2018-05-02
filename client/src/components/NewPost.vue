<template>
  <div class="posts">
    <h1>Add Post</h1>
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
            <button class="app_post_btn" @click="addPost">Add</button>
          </div>
      </div>
  </div>
</template>

<script>
import PostsService from '@/services/PostsService'
export default {
  name: 'NewPost',
  data () {
    return {
      netid: '',
      name: '',
      date: []
    }
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
    async addPost () {
      await PostsService.addPost({
        prof: this.$auth.user.name,
        netid: this.netid,
        name: this.name,
        date: this.parseDate(this.date)
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
