<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">

    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <button @click="print">测试打印</button>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import goodsPlan from "../plugins/print";

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  mounted() {
    console.log(this.$http)
  },
  methods:{
    print(){
      goodsPlan.funcInfo();
    }
  }
}
</script>
