<template>
    <div class="contact box">
        <Top/>
        <van-button class="btn" plain type="danger" @click="alert">点击</van-button>
    </div>
</template>
<script>
import Top from "../../components/top/normalTop.vue"
export default {
    methods:{
        alert(){
            confirm("联系："+"lambor  1030167845@qq.com")
        }
    },
    components:{
        Top,
    }    
}
</script>
<style scoped>
    .btn{
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        text-align: center;
    }
</style>
