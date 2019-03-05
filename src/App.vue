<template>
  <div id="app">
    <router-view/>
    <img  v-if="deep"  class="backTop" @click="backTop"  :src="require('./assets/images/home/backTop.png')" alt="">
  </div>
</template>
<script>
// import async from "async"
// import {Toast} from "vant"
export default {
  data(){
    return{
      deep:false,
      timer:null,
      speed:0,
    }
  },
  mounted(){
    // console.time("wh")
    // async.series(
    // [
    //  (callback)=>{
    //    setTimeout(() => {
    //       callback(null,"第一次执行")
    //    }, 2000);
    //  },
    //  (callback)=>{
    //    setTimeout(() => {
    //       callback(null,"第二次执行")
    //    }, 5000);
    //  }
    // ],(err,result)=>{
    //   if (err) throw err
    //   console.log(result);
    //   console.timeEnd("wh")
    // });
    window.onscroll = ()=>{
        let scroll = null;
        if(document.documentElement.scrollTop){
            scroll = document.documentElement.scrollTop
        }else{
            scroll = document.body.scrollTop
        }
        if(scroll >= 700){
            this.deep = true

        }else{
            this.deep = false
        }
    }
  },
    methods:{
      backTop(){
        clearInterval(this.timer)
        this.speed = (document.documentElement.scrollTop || document.body.scrollTop)*0.1
        this.timer=setInterval(()=>{
          let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
          if(document.documentElement.scrollTop){
              document.documentElement.scrollTop = scrollTop - this.speed
          }else{
              document.body.scrollTop = scrollTop - this.speed
          }
            if(scrollTop<=0){
              clearInterval(this.timer);
            }
        },10)

      }
    },


}
</script>
<style lang="scss" scoped>
  .backTop{
    position: fixed;
    bottom: 1.5rem;
    width: .6rem;
    right: .2rem;
    opacity: .7;
    z-index: 9999;
  }
</style>


