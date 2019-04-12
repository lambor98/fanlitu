<template>
    <div class="login box">
        <Top title="会员登入"/>
        <form action="" onsubmit="return false">
            <div class="loginbox">
                <img :src="imgHeader+'static/login/tel.png'" alt="">
                <input type="text" placeholder="请输入您的手机号码" v-model="tel" @change="worn1=false">
                <span class="tel-worn worn" v-if="worn1">
                    请输入手机号码
                </span>
                <img :src="imgHeader+'static/login/clear.png'" alt="" v-if="tel!=''" @click="tel=''">
            </div>
            <div class="loginbox">
                <img :src="imgHeader+'static/login/pwd.png'" alt="">
                <input :type="isShow?'text':'password'" placeholder="请输入您的密码" v-model="pwd" @change="worn2=false">
                <span class="pwd-worn worn" v-if="worn2">
                    请输入密码
                </span>
                <img :src="imgHeader+'static/login/hide.png'" alt="" v-if="!isShow" @click="isShow=!isShow">
                <img :src="imgHeader+'static/login/show.png'" alt="" v-if="isShow" @click="isShow=!isShow">
            </div>
            <div class="agreement">
                <span class="agm-worn" v-show="worn3">请同意协议</span>
                <van-checkbox v-model="check"></van-checkbox>
                <p>我已同意</p>
               <router-link tag="p" to="/">《返利兔协议》</router-link>
            </div>
            <span class="btn" @click="login">
                立即登入
            </span>
            <div class="loginType">
                <p @click="$router.replace({name:'quicklogin'})">手机快捷登录</p>
                <ul>
                    <li @click="$router.replace({name:'register'})">立即注册</li>
                    <li @click="$router.replace({name:'findpwd'})">忘记密码</li>
                </ul>
            </div>
        </form>

    </div>
</template>
<script>
import axios from "axios"
import {Toast} from 'vant'
import Top from "../../components/top/normalTop.vue"
import {mapState, mapActions} from "vuex"
export default {
    data() {
        return {
            tel:null,
            pwd:null,
            isShow:false,
            worn1:false,
            worn2:false,
            worn3:false,
            check:true,
            isGood:false,
            radio:"1",
            isLogin:false,
            api:null,
            user:{
    
            }
        }
    },
    components:{
        Top
    },
    computed: {
        ...mapState(["url","proxy","http","imgHeader"])
    },
    mounted() {
        
    },
    methods: {
        ...mapActions(["setSession"]),
        //判断是否出错
        Test(){
            this.worn1=this.tel?false:true;
            this.worn2=this.pwd?false:true;
            this.worn3=this.check?false:true;
            if(!this.worn1 && !this.worn2 && !this.worn3){
                this.isGood=true
            }else{
                this.isGood=false
            }
        },
        //登录操作
        login(){
            this.Test();
            if(this.isGood){
                Toast.loading("加载中")
                axios.post(this.url+"/login/index.html",{user_name:this.tel,pass_word:this.pwd}).then((res)=>{
                   if(res.data.status=="1000"){
                        Toast.success("登录成功")
                        setTimeout(()=>{
                            let path = sessionStorage.lastPath
                            if(path=="null" || path==null ){
                                this.$router.replace({name:"home"})
                            }else{
                                this.$router.replace({name:path})
                                // this.$router.go(-1)
                            }
                        },1000)
                   }else{
                        Toast.fail("登录失败，"+res.data.msg)
                   }
                }).catch(err=>{
                    Toast.fail("错误："+err)
                })
            }
        }
    },
    beforeRouteEnter (to, from, next) {
        if(from.name!="quicklogin" && from.name!="register" &&from.name!="findpwd"){  //保证登录完成后返回上一页，并且不可返回在登录注册等页面
            sessionStorage.setItem("lastPath",from.name)
        }
        next()

    }
   
    
}
</script>
<style lang="scss">
   input:-webkit-autofill , textarea:-webkit-autofill, select:-webkit-autofill {
	-webkit-text-fill-color: #000 !important;
	-webkit-box-shadow: 0 0 0px 1000px transparent  inset !important;
    background-color:transparent;
    background-image: none;
     transition: background-color 50000s ease-in-out 0s; //背景色透明  生效时长  过渡效果  启用时延迟的时间
    }
    .login{
        margin-top: 1.4rem !important;
        .loginbox{
            width:7.1rem;
            height: .8rem; 
            border: 1px solid #ddd;
            margin: auto;
            margin-top: .6rem;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            input{
                width: 6rem;
                font-size: .26rem;
                border: none;
                margin-left: .2rem;
                background: transparent;
            }
            img{
                position: absolute;
                width: .26rem;
                &:last-child{
                    width: .4rem;
                    right: .2rem;
                }
                &:first-child{
                    left: .2rem;
                }
            }
            .worn{
                position: absolute;
                bottom: -.5rem;
                color: red;
                display:inline;
                left: .2rem;
            }

        }
        .agreement{
            display: flex;
            width: 7.1rem;
            margin: .6rem auto auto auto;
            padding: .4rem 0;
            font-size: .22rem;
            padding: .4rem 0;
            position: relative;
            p{
                line-height: .3rem;
                margin-left: .1rem;
                &:last-child{
                    color: red;
                }
            }
            span{
                position: absolute;
                right: 2rem;
                color: red;
                font-size: .28rem;
            }
            .van-checkbox{
                .van-icon{
                    border-color: #000 !important;
                    width: .3rem !important;
                    height: .3rem !important;
                    line-height: .3rem !important;
                }
            }
        }
        .btn{
            width: 7.1rem;
            height: .8rem;
            background: red;
            display: block;
            margin: auto;
            text-align: center;
            line-height: .8rem;
            color: white;
            font-size: .34rem;
            border-radius: .1rem;
        }
        .loginType{
            font-size: .34rem;
            text-align: center;
            p{
                padding: .3rem 0;
            }
            ul{
                display: flex;
                font-size: .26rem;
                width: 35%;
                margin: auto;
                color: #197ffe;
                justify-content: space-around;
                li{
                    width: 50%;
                    &:last-child{
                        border-left: 1px solid;
                    }
                }
            }
        }
    }
</style>
