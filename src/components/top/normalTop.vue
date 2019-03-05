<template>
    <div class="normalTop">
        <mt-header :title="title">
            <div slot="left">
                <mt-button icon="back" @click="back">返回</mt-button>
            </div>
        </mt-header>
    </div>
</template>
<script>
export default {
    props:["title"],
    methods:{
        back(){
            if(sessionStorage.lastRouter!="null"){
                this.$router.back()
            }else{
                this.$router.push({name:"home"}) //如果返回无效，则跳转至主页

            }
        }
    },
    mounted(){
        let title = document.getElementsByClassName("mint-header-title")[0];
        title.onclick=()=>{
            this.$router.push({name:"home"})
        }
    }
    
}
</script>
<style lang="scss">
.normalTop{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    width: 100%;
    height: .88rem;
    .mint-header{
        height: .88rem;
        background: #2b3840;
        font-size: .32rem;
    }
}
</style>
