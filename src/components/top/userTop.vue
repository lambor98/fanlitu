<template>
    <div class="userTop">
        <mt-header title="个人中心">
            <router-link to="/" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
            <mt-button @click="$router.push('/userCenter/userinfo')" class="setUp" slot="right"><img :src="imgHeader+'static/user/setUp.png'" alt=""></mt-button>
        </mt-header>
    </div>
</template>
<script>
import {mapState} from "vuex";
export default {
    data() {
        return {
        }
    },
    mounted() {
        window.addEventListener('scroll', this.handleScroll)        

    },
    methods: {
        handleScroll(){
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
            let userTop =document.getElementsByClassName("userTop")[0];
            if(userTop){
                let top =userTop.getElementsByTagName("header")[0];
                let apc=scrollTop*1*0.005;
                top.style.background=`rgba(43,56,64,${apc})`;
            } 
        }
    },
    computed:{
        ...mapState(['imgHeader'])
    }
    
}
</script>
<style lang="scss">
 /* eslint-disable */

.userTop{
    width: 100%;
    position: fixed;
    top: 0;
    height: .88rem;
    z-index: 9999;
    // background: rgba($color: #fff, $alpha: 0) !important;
    .mint-header{
        height: .88rem;
        // color: #000;
        font-size: .32rem;
        background: rgba($color: #fff, $alpha: 0);
    }
    .setUp{
        img{
            width: .3rem;
            height: .3rem;
        }
    }

}
</style>
