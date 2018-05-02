<template>
  <div class = "attendance">
    <h1>Attendance for {{this.date}}</h1><br>

          <div class="content">
        		<vue-swing @throwout="onThrowout" :config="config" ref="vueswing">
        			<special-card v-for="post in posts" :key="post.key" :imageUrl="post.url" :title="post.name"></special-card>
        		</vue-swing>
        	</div>

    <!-- <v-btn color="green lighten" dark>
      <v-icon dark left>arrow_back</v-icon>Present
    </v-btn> -->

  </div>
</template>

<script>
import SpecialCard from './Card'
import PostsService from '@/services/PostsService'
import VueSwing from 'vue-swing'
export default {
  name: 'Attendance',
  components: {
    'special-card': SpecialCard,
    VueSwing
  },
  data () {
    return {
      date: '', //date from params
      swipeDirection: 'None',
      posts: [],
      items: [],
      stacksize: 0,
      config: {
        allowedDirections: [
          VueSwing.Direction.LEFT,
          VueSwing.Direction.RIGHT
        ],
        minThrowOutDistance: 300,
        maxThrowOutDistance: 400
      },
      today: '', //parsed date for db,
      route: '', //class routed in
    }
  },
  created () {
    let path = this.$route.path
    path = path.split('/')
    this.route = path[2]
    this.date = path[3]
    console.log("this.route",this.route);
    console.log("this.date",this.date)
    this.getPosts()
  },
  methods: {
    swipe (direction) {
      this.swipeDirection = direction
      //swipe = left present, right absent
   },
    async getPosts () {
      const response = await PostsService.fetchPosts({
      })
      console.log("response", response.data);
      let split = this.route.split('-')
      let subject = split[0]+'-'+split[1]+ ' ' +split[2] + '-' +split[3]
      console.log("subject",subject);
      for (let items in response.data.posts) {
        console.log("items", response.data.posts[items])
        if (response.data.posts[items].prof == this.$auth.user.name && response.data.posts[items].subject == subject) {
          this.posts.push(response.data.posts[items])
        }
      }
      this.items = this.posts
      console.log('posts', this.posts)
    },
    async updatePost (target, direction) {
      let split = this.date.split("-")
      let day = split[0].substring(2,4)+split[1]+split[2]
      console.log("target", target);
      for (let student in this.posts) {
        if (this.posts[student].name == target && direction == 'left') {
          let dateupdate = {date: day, attend: "present"}
          console.log("dateupdate",dateupdate);
          let datearr = this.posts[student].date
          if (this.posts[student].date.length < 1) { //if date array emtpy
            this.posts[student].date.push(dateupdate)
            console.log("none");
          } else if (this.posts[student].date.length >= 1) { //if date array not empty
            let flag = false //to test whether date is there or not
            console.log("this.posts[student].date",this.posts[student].date);
            for (let days in this.posts[student].date) { //assumes theres days
              console.log("testingdaniels", day.indexOf(this.posts[student].date[days].date))
              if (day.indexOf(this.posts[student].date[days].date) > -1) { //if date is there
                console.log("dates there", this.posts[student].date[days].date);
                flag = true
                this.posts[student].date[days].attend = 'present' //only update type of attendance
              }
            }
            if (flag == false) {
              this.posts[student].date.push(dateupdate)
            }
            console.log("this.posts[updated]", this.posts[student].date);
          }
          await PostsService.updatePost({
            id: this.posts[student]._id,
            netid: this.posts[student].netid,
            name: this.posts[student].name,
            date: this.posts[student].date,
            url: this.posts[student].url
          })
          console.log("thispostsstudent", this.posts[student]);

        }
        if (this.posts[student].name == target && direction == 'right') {
          let dateupdate = {date: day, attend: "absent"}
          console.log("dateupdate",dateupdate);
          let datearr = this.posts[student].date
          if (this.posts[student].date.length < 1) { //if date array emtpy
            this.posts[student].date.push(dateupdate)
            console.log("none");
          } else if (this.posts[student].date.length >= 1) { //if date array not empty
            let flag = false //to test whether date is there or not
            console.log("this.posts[student].date",this.posts[student].date);
            for (let days in this.posts[student].date) { //assumes theres days
              console.log("testingdaniels", day.indexOf(this.posts[student].date[days].date))
              if (day.indexOf(this.posts[student].date[days].date) > -1) { //if date is there
                console.log("dates there", this.posts[student].date[days].date);
                flag = true
                this.posts[student].date[days].attend = 'absent' //only update type of attendance
                console.log("test absence", this.posts[student].date[days].attend);
              }
            }
            if (flag == false) {
              this.posts[student].date.push(dateupdate)
            }
            console.log("test absence2", this.posts[student].date);

            console.log("this.posts[updated]", this.posts[student].date);
          }
          await PostsService.updatePost({
            id: this.posts[student]._id,
            netid: this.posts[student].netid,
            name: this.posts[student].name,
            date: this.posts[student].date,
            url: this.posts[student].url
          })
          console.log("thispostsstudent", this.posts[student]);
        }
        // this.$router.push({ name: 'Posts' })
      }
    },
    async onThrowout ({ target, throwDirection }) {
      console.log(`Threw out ${target.textContent}!`)
      console.log("direc", throwDirection);
      console.log("hihi","hi");
      console.log("test", target.textContent.split(" "));
      let text = target.textContent.trim()
      console.log("text", text);
      if (throwDirection == VueSwing.Direction.LEFT) {
        //present -> update database
        this.stacksize ++
        this.updatePost(text, "left")
        console.log("yis");
      }
      if (throwDirection == VueSwing.Direction.RIGHT) {
        //absent
        this.stacksize ++
        this.updatePost(text, "right")
        console.log("no?");
      }
      if (this.stacksize == this.posts.length) { //stack emtpy = done
        window.location.replace('http://188.166.245.15:8080/view/'+ this.route+'/'+this.date)
      }
    }

  }
}
</script>

<style scoped>
.content {
   position: absolute;
   left: 25%;
}

.card {
  align-items: center;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  height: 200px;

  /* YOU MUST INSERT position: absolute otherwise cards will load in different places */
  position: absolute;
  width: 200px;
}
.name {
  align-items: center;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  font-size: 68px;
  height: 450px;
  justify-content: center;
  left: 20%;
  position: absolute;
  top: 15%;
  width: 70%;
}
.imgclass {
  pointer-events: none;
}
</style>
