<template>
    <div class="quickLogin box">
        <Top title="快速登录"/>
        <form action="" onsubmit="return false">
            <div class="loginbox">
                <img :src="require('../../assets/images/login/tel.png')" alt="">
                <input type="text" placeholder="请输入您的手机号码" v-model="tel" @change="worn1=false">
                <span class="tel-worn worn" v-if="worn1">
                    手机号格式出错
                </span>
                <img :src="require('../../assets/images/login/clear.png')" alt="" v-if="tel!=''" @click="tel=''">
            </div>
            <div class="codebox">
                <div class="code-left">
                    <img :src="require('../../assets/images/login/code.png')" alt="">
                    <input type="text" placeholder="请输入图形验证码" v-model="imgCode">
                </div>
                <div class="code-right">
                    <img :src="randomCode" :alt="flag" @click="getRandomCode()">
                </div>
                <span class="code-worn worn" v-if="worn2">
                   图形验证码出错
                </span>
            </div>
            <div class="codebox">
                <div class="code-left">
                    <img :src="require('../../assets/images/login/pwd.png')" alt="">
                    <input type="text" placeholder="请填写你的手机验证码" v-model="telCode">
                </div>
                <div class="code-right">
                    <p class="getTelCode" @click="time==60?getTelCode():''">{{time==60?"获取验证码":time+"s后继续操作"}}</p>
                </div>
                <span class="telcode-worn worn" v-if="worn3">
                   短信验证码出错
                </span>
            </div>
             <div class="agreement">
                <span class="agm-worn" v-show="worn4">请同意协议</span>
                <van-checkbox v-model="check"></van-checkbox>
                <p>我已同意</p>
               <router-link tag="p" to="/">《返利兔协议》</router-link>
            </div>
             <span class="btn" @click="login">
                立即登入
            </span>
            <div class="loginType">
                <router-link to="/login" tag="p">密码登录</router-link>
                <ul>
                    <router-link to="/register" tag="li">立即注册</router-link>
                    <router-link to="/findPwd" tag="li">忘记密码</router-link>
                </ul>
            </div>
        </form>
    </div>
</template>
<script>
import Top from "../../components/top/normalTop.vue"
import axios from "axios"
import "../../style/QuickLogin.scss";
import {mapState,mapActions} from "vuex"
import {Toast} from "vant"
export default {
    data() {
        return {
            tel:"",
            worn1:false,  //手机格式
            worn2:false,  //图形验证码
            worn3:false,  //telCode
            worn4:false,  //协议
            flag:1,
            imgCode:null, 
            telCode:null,
            check:false,
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
            this.worn4 = this.check?false:true  //是否同意协议
            this.worn3 = this.telCode?false:true
        },
        getTelCode(){
            let reg = /^1[3|4|5|7|8][0-9]{9}$/;
            this.worn1 = reg.test(this.tel*1)?false:true;
            if(!this.worn1){
                axios.get(this.url+"/general/creactSms?captcha="+this.imgCode+"&mobile="+this.tel).then((res)=>{
                    if(res.data.status=="1000"){
                        Toast.success("验证码已发送")     //成功后开始倒计时
                        this.worn2 = false;
                        this.countdown();                //倒计时
                    }else{
                        Toast.fail(res.data.msg);
                        this.worn2 = true
                        this.getRandomCode();           //失败后，刷新验证码
                    }
                }).catch(err=>{
                    Toast.fail("错误"+err)
                })
            }
        },
        login(){ //快速登录
            this.Test();
            if(!this.worn1 && !this.worn2  && !this.worn3 && !this.worn4){
                 axios.post(this.url+"/login/mlogin",{mobile:this.tel,code:this.telCode}).then(res=>{
                    if(res.data.status=="1000"){
                        Toast.success("登入成功")
                        let path= sessionStorage.lastPath;//登录返回至有效的上一层
                         if(path=="null"){this.$router.push("/")}else{
                                this.$router.replace(path)
                            }  
                    }else{
                        Toast.fail(res.data.msg);
                        this.worn3=true;            //失败后提示错误
                    }
                }).catch(err=>{
                    Toast.fail(err)
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
        ...mapState(["randomCode","url"])
    },
    components:{
        Top
    }
    
}
</script>

