<template>
  <div class="card">
    <h1> {{ title }} </h1>
    <img :src="imageUrl">
    <!-- <p>{{ description }}</p> -->
  </div>
</template>

<script>
export default {
  name: 'SpecialCard',
  props: ['description', 'title', 'imageUrl']
}
</script>

<style scoped>
.card {
  /*background: orange;*/
  height: 50vh;
  width: 30vh;
}

.card img {
  height: 200px;
  width: 70%%;
}


</style>
