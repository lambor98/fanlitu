<template>
    <div class="security box">
        <Top title="账户安全"/>
        <van-cell title="绑定淘宝买号" is-link :value="userState.buyer_status?userState.buyer_status:'请设置'" @click="$router.push('bind/bindTaoBao')"/>
        <van-cell title="绑定银行卡" is-link :value="userState.card_status?userState.card_status:'请设置'" @click="$router.push('bind/bindCard')"/>
        <van-cell title="设置提现密码" is-link :value="userState.is_set_pwd=='请设置'?'请设置':'修改'" @click="$router.push('bind/setCashPwd')"/>
        <van-cell title="设置登录密码" is-link value="修改" @click="$router.push('bind/setLoginPwd')"/>
        <!-- <van-button type="danger" size="large">提交</van-button> -->
    </div>
</template>
<script>
import Top from "../../../components/top/normalTop.vue"
import axios from "axios"
import {mapState} from "vuex"
export default {
    data() {
        return {
            userState:{}
        }
    },
    components:{
        Top
    },
    methods:{

    },
    computed: {
        ...mapState(["url"])
    },
    mounted(){
        axios.post(this.url+"/bind_info/secure").then(res=>{
            this.userState = res.data.data
        }).catch(err=>{
            alert(err)
        })
    }
    
}
</script>
<style lang="scss" >
.security{
    .van-cell{
        font-size: .26rem !important;
    }
    .van-button{
        width: 90%;
        display: block;
        margin: .5rem auto;
    }
}
</style>
