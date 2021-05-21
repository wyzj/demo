<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">

    <!--<HelloWorld msg="Welcome to Your Vue.js App"/>-->
    <button @click="print">测试</button>
  </div>
</template>

<script>
// @ is an alias to /src
import print from "../plugins/print";

export default {
  name: 'Home',
  mounted() {
  },
  methods:{
    print(){
      print.sqliteDemo();
    }
  }
}
</script>
