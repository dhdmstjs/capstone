<template>
  <div id="app">
    <v-app>
      <div v-if="this.$login=='true'">
        <nav class="navbar navbar-dark bg-dark">
          <div>
            <img :src="$auth.user.picture" width="30" height="30">
            <span class="text-muted font-weight-light px-2">{{$auth.user.name}}</span>
            <button type="button" class="btn btn-outline-secondary btn-sm" @click="$auth.logout()">Logout</button>
          </div>
        </nav>
      </div>
    <router-view></router-view>

    <v-bottom-nav app :value="true" :active.sync="e1" color="transparent">
      <div v-if="this.class!=undefined">
        <v-btn flat color="teal" value="roster" @click="route('roster')">
            <span>Roster</span>
            <v-icon>list</v-icon>
        </v-btn>
      </div>
        <v-btn flat color="teal" value="home" @click="route('home')">
          <span>Home</span>
          <v-icon>home</v-icon>
        </v-btn>
      <div v-if="this.class!=undefined">
        <v-btn flat color="teal" value="attendance" @click="route('attendance')">
          <span>Attendance</span>
          <v-icon dark right>check_circle</v-icon>
        </v-btn>
      </div>
      </v-bottom-nav>
    </v-app>
  </div>
</template>

<script>
import 'vuetify/dist/vuetify.min.css'

export default {
  name: 'App',
  data () {
    return {
      e1: 'recent',
      class: '',
    }
  },
  mounted() {
    console.log("hi")
    console.log("login", this.$login);
    console.log("+this.$course",this.$course);
    let split = this.$route.path.split('/')
    this.class= split[2]
    console.log("current route", this.class);
  },
  methods: {
    route(type) {
      if (type == "home") {
        window.location.replace('http://localhost:8080/')
      }
      if (type == "roster") {
        window.location.replace('http://localhost:8080/posts/'+this.class)
      }
      if (type == "attendance") {
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
        window.location.replace('http://localhost:8080/view/'+this.class+'/'+today)

      }
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  text-align: center;
  padding-top: 5px;
  padding-bottom: 56px;
}
</style>
