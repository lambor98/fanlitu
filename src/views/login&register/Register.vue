<template>
    <div class="register box">
        <Top title="会员注册"/>
        <form action="" onsubmit="return false">
            <div class="loginbox">
                <img :src="imgHeader+'static/login/tel.png'" alt="">
                <input type="text" placeholder="请输入您的手机号码" v-model="tel" @change="worn1=false" autocomplete="off">
                <span class="tel-worn worn" v-if="worn1">
                    手机号格式出错
                </span>
                <img :src="imgHeader+'static/login/clear.png'" alt="" v-if="tel!=''" @click="tel=''">
            </div>
            <div class="codebox">
                <div class="code-left">
                    <img :src="imgHeader+'static/login/code.png'" alt="">
                    <input type="text" placeholder="请输入图形验证码" v-model="imgCode" autocomplete="off">
                </div>
                <div class="code-right">
                    <img :src="randomCode" alt="如若刷新失败请点击" @click="getRandomCode()">
                </div>
                <span class="code-worn worn" v-if="worn2">
                   图形验证码出错
                </span>
            </div>
            <div class="codebox">
                <div class="code-left">
                    <img :src="imgHeader+'static/login/pwd.png'" alt="">
                    <input type="text" name="telcode" placeholder="请填写你的验证码" v-model="telCode" max="5" autocomplete="off">
                </div>
                <div class="code-right">
                    <p class="getTelCode" @click="time==60?getTelCode():''">{{time==60?"获取验证码":time+"s后继续操作"}}</p>
                </div>
                <span class="telcode-worn worn" v-if="worn3">
                   短信验证码出错
                </span>
            </div>
             <div class="loginbox">
                <img :src="imgHeader+'static/login/pwd.png'" alt="">
                <input :type="isShow?'text':'password'"  name="pwd" placeholder="请输入密码，6-20位数字和字母组合" v-model="pwd" @change="worn2=false" autocomplete="new-password">
                <span class="pwd-worn worn" v-if="worn5">
                     密码应为6-20位，不可为纯数字，不可包含特殊字符
                </span>
                <img :src="imgHeader+'static/login/hide.png'" alt="" v-if="!isShow" @click="isShow=!isShow">
                <img :src="imgHeader+'static/login/show.png'" alt="" v-if="isShow" @click="isShow=!isShow">
            </div>
             <div class="agreement">
                <span class="agm-worn" v-show="worn4">请同意协议</span>
                <van-checkbox v-model="check"></van-checkbox>
                <p>我已同意</p>
               <router-link tag="p" to="/">《返利兔协议》</router-link>
            </div>
             <span class="btn" @click="register">
                立即注册
            </span>
            <div class="loginType">
                <p @click="$router.replace({name:'login'})">直接登录</p>
            </div>

        </form>
    </div>
</template>
<script>
        /* eslint-disable */

import Top from "../../components/top/normalTop.vue"
import axios from "axios"
import "../../style/QuickLogin.scss";
import {mapState,mapActions} from "vuex"
import {Toast} from "vant"
export default {
    data() {
        return {
            tel:null,
            pwd:null,
            worn1:false,    //手机格式
            worn2:false,    //图形验证码
            worn3:false,    //telCode
            worn4:false,    //同意协议？
            worn5:false,    //密码
            flag:1,
            imgCode:null,
            telCode:null,
            check:false,
            isShow:false,
            time:60,
            invCode:null,//邀请码
        }
    },
    mounted() {
        this.getRandomCode()
        let inv = this.$route.query.in
        sessionStorage.setItem("invCode",inv)
        this.invCode = sessionStorage.invCode
    },
    methods: {
        ...mapActions(["getRandomCode"]),
         Test(){   
            //检验输入
            let reg = /^1[3|4|5|7|8][0-9]{9}$/;
            this.worn1 = reg.test(this.tel*1)?false:true;
            this.worn2 = this.imgCode?false:true;
           
        },
        getTelCode(){
            this.Test();
            if(!this.worn1 && !this.worn2){
                axios.post(this.url+"/general/creactSms",{mobile:this.tel,captcha:this.imgCode}).then((res)=>{
                   if(res.data.status=="1000"){
                       Toast.success(res.data.msg)
                       this.worn2 = false;
                       this.countdown();
                   }else{
                       Toast.fail(res.data.msg)
                       this.worn2 = true;
                       this.getRandomCode();
                   }
                }).catch(err=>{
                  Toast.fail("错误"+err)
                })
            }
        },
        register(){
            this.Test();
            this.worn4 = this.check?false:true  //是否同意协议
            this.worn3 = this.telCode?false:true
            let pwdReg =  /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/;
            this.worn5 = !pwdReg.test(this.pwd); 
            if(!this.worn1 && !this.worn2 && !this.worn3 && !this.worn4 && !this.worn5){
                axios.post(this.url+"/buyer_reg/index",{mobile:this.tel,check_code:this.telCode,pass_word:this.pwd,invent_code:this.invCode}).then(res=>{
                console.log(res)
                   if(res.data.status=="1000"){
                        Toast.success(res.data.msg)
                        this.$router.replace({name:"login"})
                    }else{
                        Toast.fail(res.data.msg)
                        setTimeout(()=>{
                            this.$router.go(0)
                        },1000)
                    }
                }).catch(err=>{
                    Toast.fail("错误"+err)
                })
            }
        },
        countdown(){
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
        ...mapState(["randomCode","url","imgHeader"])
    },
    components:{
        Top
    }
    
}
</script>

