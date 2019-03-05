<template>
    <div class="quickLogin box changeTel">
        <Top title="验证手机"/>
        <div class="changeTel">
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
                        <img :src="randomCode"  @click="getRandomCode()">
                    </div>
                    <span class="code-worn worn" v-if="worn2">
                    图形验证码出错
                    </span>
                </div>
                <div class="codebox">
                    <div class="code-left">
                        <img :src="require('../../../assets/images/login/pwd.png')" alt="">
                        <input type="text" placeholder="请填写你的手机验证码" v-model="telCode">
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
                    <input :type="isShow?'text':'password'" placeholder="请输入您现有密码" v-model="pwd" @change="worn2=false" autocomplete="new-password" >
                    <span class="pwd-worn worn" v-if="worn4">
                        请输入密码
                    </span>
                    <img :src="require('../../../assets/images/login/hide.png')" alt="" v-if="!isShow" @click="isShow=!isShow">
                    <img :src="require('../../../assets/images/login/show.png')" alt="" v-if="isShow" @click="isShow=!isShow">
                </div>
                <span class="btn" @click="bindTel">
                    提交
                </span>
               
            </form>
        </div>
    </div>
</template>
<script>
import Top from "../../../components/top/normalTop.vue"
import axios from "axios"
import "../../../style/QuickLogin.scss";
import {mapState,mapActions} from "vuex"
import {Toast} from "vant"
export default {
    data() {
        return {
            tel:null,       //手机号
            pwd:null,       //密码
            worn1:false,  //错误提示-手机格式
            worn2:false,  //错误提示-图形验证码
            worn3:false,  //错误提示-telCode
            worn4:false,  //错误提示-密码
            imgCode:null, //图形验证码
            telCode:null, //手机验证码
            isShow:false, //控制密码显隐
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
        getTelCode(){
           this.Test()
            if(!this.worn1 && !this.worn2){
                axios.post(this.url+"/general/creactSms?captcha="+this.imgCode+"&mobile="+this.tel).then((res)=>{
                    if(res.data.status=="1000"){
                        Toast.success("验证码已发送")     //成功后开始倒计时
                        this.worn2 = false;
                        this.countdown();                //倒计时
                    }else{
                        Toast.fail(res.data.msg);
                        this.worn2 = true
                        this.getRandomCode();           //失败后，刷新验证码
                    }
                })
            }
        },
        bindTel(){
            this.Test();
            this.worn4 = this.pwd?false:true  //密码
            this.worn3 = this.telCode?false:true //手机验证码
            if(!this.worn1 && !this.worn2  && !this.worn3 && !this.worn4){
                 axios.post(this.url+"/bind_info/check_mobile",{mobile:this.tel,password:this.pwd,mobile_code:this.telCode}).then(res=>{
                    if(res.data.status=="1000"){
                        Toast.success("绑定成功")
                        this.$router.push({name:"userinfo"})
                    }else{
                        Toast.fail(res.data.msg); //失败后提示错误
                        this.imgCode=this.telCode=this.pwd=null;
                        this.getRandomCode();
                    }
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
<style lang="scss" scoped>
.changeTel{
    .btn{
        margin: .88rem auto !important;
    }
}
</style>

