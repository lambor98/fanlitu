<template>
    <div class="findPwd register box">
        <Top title="找回密码"/>
        <form action="" onsubmit="return false">
            <div class="loginbox" v-if="!pass">
                <img :src="imgHeader+'static/login/tel.png'" alt="">
                <input type="text" placeholder="请输入您的手机号码" v-model="tel" @change="worn1=false">
                <span class="tel-worn worn" v-if="worn1">
                    手机号格式出错
                </span>
                <img :src="imgHeader+'static/login/clear.png'" alt="" v-if="tel!=''" @click="tel=''">
            </div>
            <div class="codebox" v-if="!pass">
                <div class="code-left">
                    <img :src="imgHeader+'static/login/code.png'" alt="">
                    <input type="text" placeholder="请输入图形验证码" v-model="imgCode">
                </div>
                <div class="code-right">
                    <img :src="randomCode" alt="如若刷新失败请点击" @click="getRandomCode()">
                </div>
                <span class="code-worn worn" v-if="worn2">
                   图形验证码出错
                </span>
            </div>
            <div class="codebox" v-if="!pass">
                <div class="code-left">
                    <img :src="imgHeader+'static/login/pwd.png'" alt="">
                    <input type="text" placeholder="请填写你的验证码" v-model="telCode">
                </div>
                <div class="code-right">
                    <p class="getTelCode" @click="time==60?getTelCode():''">{{time==60?"获取验证码":time+"s后继续操作"}}</p>
                </div>
                <span class="telcode-worn worn" v-if="worn3">
                   短信验证码出错
                </span>
            </div>
             <div class="loginbox" v-if="pass">
                <img :src="imgHeader+'static/login/pwd.png'" alt="">
                <input :type="isShow?'text':'password'" placeholder="请输入密码，6-20位数字和字母组合" v-model="pwd1" @change="worn4=false">
                <span class="pwd-worn worn" v-if="worn4">
                     密码应为6-20位，不可为纯数字，不可包含特殊字符
                </span>
                <img :src="imgHeader+'static/login/hide.png'" alt="" v-if="!isShow" @click="isShow=!isShow">
                <img :src="imgHeader+'static/login/show.png'" alt="" v-if="isShow" @click="isShow=!isShow">
            </div>

             <div class="loginbox" v-if="pass">
                <img :src="imgHeader+'static/login/pwd.png'" alt="">
                <input :type="isShow?'text':'password'" placeholder="请确认密码" v-model="pwd2" @change="worn5=false">
                <span class="pwd-worn worn" v-if="worn5">
                     两次输入密码不同
                </span>
                <img :src="imgHeader+'static/login/hide.png'" alt="" v-if="!isShow" @click="isShow=!isShow">
                <img :src="imgHeader+'static/login/show.png'" alt="" v-if="isShow" @click="isShow=!isShow">
            </div>
           
             <span class="btn" @click="pass?resetPwd():findPwd()">
               {{pass?"修改密码":"验证密码"}}
            </span>
            <div class="loginType">
                <p></p>
                <ul>
                    <router-link to="/register" tag="li">立即注册</router-link>
                    <router-link to="/Login" tag="li">立即登录</router-link>
                </ul>
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
            pwd1:null,
            pwd2:null,
            worn1:false, //手机号
            worn2:false, //图形验证码
            worn3:false, //telCode
            worn4:false, //新密码
            worn5:false, //确认密码
            flag:1,
            imgCode:null,
            telCode:null,
            isShow:false,
            pass:false,  //是否开始修改面膜
            time:60,
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
            this.worn3 = this.telCode?false:true;
        },
        getTelCode(){
            let reg = /^1[3|4|5|7|8][0-9]{9}$/;
            this.worn1 = reg.test(this.tel*1)?false:true;
            if(!this.worn1){
                axios.post(this.url+"/general/creactSms",{mobile:this.tel,captcha:this.imgCode}).then((res)=>{
                    if(res.data.status=="1000"){
                        Toast.success(res.data.msg)
                        this.worn2 = false;
                        this.countdown()
                    }else{
                        Toast.fail(res.data.msg)
                        this.worn2 = true
                        this.getRandomCode(); 
                    }
                }).catch(err=>{
                    Toast.fail("错误:"+err)
                })
            }
        },
        findPwd(){
            this.Test();   //验证手机
            if(!this.worn1 && !this.worn2 && !this.worn3){
                axios.post(this.url+"/login/findpass",{mobile:this.tel,code:this.telCode}).then(res=>{
                    if(res.data.status=="1000"){
                        Toast.success(res.data.msg)    
                        this.pass = true;
                         //验证完成后打开修改密码模块
                    }else{
                        Toast.fail(res.data.msg)
                        this.worn3=true; 
                    }
                }).catch(err=>{
                    Toast.fail("错误:"+err)
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
        },
        resetPwd(){  //重置密码
            let pwdReg =  /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/;
            this.worn4 = !pwdReg.test(this.pwd1);
            this.worn5 = (this.pwd1!=this.pwd2);
            if(!this.worn4 && !this.worn5){
                axios.post(this.url+"login/setpass",{password:this.pwd1,repassword:this.pwd2}).then(res=>{
                    if(res.data.status=="1000"){
                        Toast.success(res.data.msg)
                        this.$router.replace({name:"login"})
                    }else{
                        Toast.fail(res.data.msg)
                        this.$router.go(-1)
                    }
                }).catch(err=>{
                   Toast.fail("错误:"+err)
                })
            }
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
<style lang="scss">
 .findPwd{
     .btn{
         margin: 1rem auto auto auto !important;
     }
 }
</style>


