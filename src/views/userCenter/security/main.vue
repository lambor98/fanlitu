<template>
    <div>
        <Top title="账户安全"/>
        <router-view></router-view>
    </div>
</template>
<script>
import Top from "../../../components/top/normalTop.vue"
export default {
    components:{
        Top
    }
    
}
</script>