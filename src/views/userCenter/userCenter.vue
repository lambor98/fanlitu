<template>
    <div class="userCenter">
        <router-view></router-view>
    </div>
</template>
<script>
import {mapActions} from "vuex"
export default {
    mounted(){
        document.documentElement.scrollTop = 0 ;
        document.body.scrollTop = 0;
        this.isLogin()
    },
    methods:{
        ...mapActions(["isLogin"])
    }
}
</script>