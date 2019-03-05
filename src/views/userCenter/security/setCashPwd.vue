<template>
    <div class="setPwd box">
       <van-notice-bar mode="closeable">
        注：为了您的账号安全，请设置提现密码，并确保提现密码设置与登录密码不一样
        </van-notice-bar>
        <van-cell-group>
            <van-field v-model="pwd" placeholder="6-20位数字组成"  label="提现密码" type="password" :error-message="worn"/>
            <van-field v-model="pwd2" placeholder="6-20位数字组成"  label="确认密码" type="password" :error-message="worn2"/>
            <van-button type="danger" size="large" @click="check">保存</van-button>
        </van-cell-group>
        
    </div>
</template>
<script>
import axios from "axios"
import { mapState } from "vuex"
import {Toast} from "vant"
export default {
    computed: {
        ...mapState(["url"])
    },
    data() {
        return {
            pwd:null,
            pwd2:null,
            worn:"",
            worn2:"" ,
            flag1:false,
            flag2:false       
        }
    },
    methods: {
        check(){
            let pwdReg =  /^\d{6,20}$/;
            this.flag1= pwdReg.test(this.pwd)
            this.flag2=(this.pwd==this.pwd2)
            this.worn = this.flag1?"":"密码不合法"
            this.worn2 =this.flag2?"":"请确认密码"
            this.savePwd();

        },
        savePwd(){
            if(this.flag1 && this.flag2){
                axios.post(this.url+"/bind_info/setWithdrawPass",{password:this.pwd,confirm_password:this.pwd2}).then(res=>{
                    if(res.data.status=="1000"){
                        this.$router.go(-1)
                        Toast.success(res.data.msg)
                    }else{
                        Toast.fail(res.data.msg)
                    }
                })
            }
        }
    },
   

}
</script>
<style lang="scss">
.setPwd{
    .van-button--large{
        width: 90%;
        margin: auto;
        display: block;
        margin-top: .6rem;
    }
}
</style>
