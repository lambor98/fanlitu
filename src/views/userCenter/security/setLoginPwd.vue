<template>
    <div class="setLogin register box">
        <van-notice-bar mode="link">
        注：为了您的账号安全，请定期更换登录密码并确保登录密码设置与提现密码不一样
        </van-notice-bar>
        <Top title="修改密码"/>
        
        <form action="" onsubmit="return false" autocomplete="new-password">
            <div class="loginbox">
                <img :src="require('../../../assets/images/login/tel.png')" alt="">
                <input type="text" placeholder="请输入您的手机号码" v-model="tel" @change="worn1=false">
                <span class="tel-worn worn" v-if="worn1">
                    手机号格式出错
                </span>
                <img :src="require('../../../assets/images/login/clear.png')" alt="" v-if="tel!=''" @click="tel=''">
            </div>
            <div class="codebox">
                <div class="code-left">
                    <img :src="require('../../../assets/images/login/code.png')" alt="">
                    <input type="text" placeholder="请输入图形验证码" v-model="imgCode">
                </div>
                <div class="code-right">
                    <img :src="randomCode" alt="验证码刷新失败请点击" @click="getRandomCode()">
                </div>
                <span class="code-worn worn" v-if="worn2">
                   图形验证码出错
                </span>
            </div>
            <div class="codebox">
                <div class="code-left">
                    <img :src="require('../../../assets/images/login/pwd.png')" alt="">
                    <input type="text" placeholder="请填写你的验证码" v-model="telCode">
                </div>
                <div class="code-right">
                    <p class="getTelCode" @click="time==60?getTelCode():''">{{time==60?"获取验证码":time+"s后继续操作"}}</p>
                </div>
                <span class="telcode-worn worn" v-if="worn3">
                   短信验证码出错
                </span>
            </div>
             <div class="loginbox">
                <img :src="require('../../../assets/images/login/pwd.png')" alt="">
                <input :type="isShow?'text':'password'" placeholder="请输入密码，6-20位数字和字母组合" v-model="pwd" @change="worn2=false" autocomplete="new-password">
                <span class="pwd-worn worn" v-if="worn5">
                     密码应为6-20位，不可为纯数字，不可包含特殊字符
                </span>
                <img :src="require('../../../assets/images/login/hide.png')" alt="" v-if="!isShow" @click="isShow=!isShow">
                <img :src="require('../../../assets/images/login/show.png')" alt="" v-if="isShow" @click="isShow=!isShow">
            </div>
             
             <span class="btn" @click="reset">
                立即重置
            </span>

        </form>
    </div>
</template>
<script>
        /* eslint-disable */

import Top from "../../../components/top/normalTop.vue"
import axios from "axios"
import "../../../style/QuickLogin.scss";
import {mapState,mapActions} from "vuex"
import {Toast} from "vant"
export default {
    data() {
        return {
            tel:null,
            pwd:null,
            worn1:false,   //手机号
            worn2:false,   //图形验证
            worn3:false,   //手机验证
            worn5:false,   //密码验证
            flag:1,
            imgCode:null,    
            telCode:null,
            isShow:false,
            time:60
        }
    },
    mounted() {
        this.getRandomCode()
    },
    methods: {
        ...mapActions(["getRandomCode"]),
        Test(){   
            //检验输入
            let reg = /^1[3|4|5|7|8][0-9]{9}$/;
            this.worn1 = reg.test(this.tel*1)?false:true;
            this.worn2 = this.imgCode?false:true;
        },
        getTelCode(){ //获取手机验证码
            this.Test()
            if(!this.worn1 && !this.worn2){
                axios.post(this.url+"general/creactSms",{mobile:this.tel,captcha:this.imgCode}).then((res)=>{
                    if(res.data.status=="1000"){
                        Toast.success(res.data.msg)
                        this.worn2 = false;
                        this.countdown()
                    }else{
                        Toast.fail(res.data.msg)
                        this.worn2 = true;
                        this.getRandomCode();
                    }
                })
            }
        },
        reset(){
            //重置密码
            this.Test();
            let pwdReg =  /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/;
            this.worn5 = !pwdReg.test(this.pwd);
            if(!this.worn1 && !this.worn2 && !this.worn5){
                axios.post(this.url+"/bind_info/resetLoginPass",{mobile:this.tel,code:this.telCode,password:this.pwd}).then(res=>{
                   if(res.data.status=="1000"){
                       Toast.success(res.data.msg) 
                       axios.post(this.url+"/login/loginOut").then(res=>{   //重置密码后退出登录
                           if(res.data.status=="1000"){
                                this.$router.push({name:'login'})        //成功退出登录后跳转至登录
                           }else{
                               Toast.fail(res.data.msg)
                           }
                       })
                   }else{
                       Toast.fail(res.data.msg)
                       this.worn3 = false;
                   }
                })
            }
           
        },
         countdown(){  //计时器
            let timer= null;
            clearInterval(timer)
            timer=setInterval(()=>{
                this.time-=1;
                if(this.time==0){
                    this.time=60;
                    clearInterval(timer)
                }
            },1000)
        }
    },
    computed: {
        ...mapState(["randomCode","url"])
    },
    components:{
        Top
    }
    
}
</script>
<style lang="scss" scoped>
    .setLogin{
        margin-top: .88rem !important;
        .btn{
            margin-top: .6rem;
        }
    }
</style>


