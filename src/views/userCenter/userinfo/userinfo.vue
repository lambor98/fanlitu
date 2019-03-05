<template>
    <div class="userinfo box">
        <Top title="个人信息"/>
        <div @click="headerVisible=true">
            <mt-cell title="头像" is-link>
                <img :src="userinfo.avatar==''?require('../../../assets/images/user/wang.png'):userinfo.avatar"  alt="">
            </mt-cell>
             <mt-actionsheet
            :actions="actions"
            v-model="headerVisible"
            closeOnClickModa>
            </mt-actionsheet>
        </div>
        <div>
            <mt-cell title="用户名">
                {{userinfo.user_name}}
            </mt-cell>
        </div>
        <div @click="$router.push({name:'bindTaobao'})">
            <mt-cell title="买号信息" is-link>
                {{userinfo.nickname?userinfo.nickname:"请设置"}}
            </mt-cell>
        </div>
        <div @click="sexVisible=true">
            <mt-cell title="性别" is-link label="(请务保持与支付宝截图一致)">
                {{userinfo.gender==null?"请选择":userinfo.gender | sex}}
            </mt-cell>
            <mt-actionsheet
            :actions="sexactions"
            v-model="sexVisible"
            closeOnClickModal>
            </mt-actionsheet>
        </div>
        <div @click="openPicker()">
            <mt-cell title="出生日期" is-link>
               {{userinfo.birth?userinfo.birth:"请设置"}}
            </mt-cell>
        </div>
        
        <div @click="$router.push('useraddress')">
            <mt-cell title="收货地址" is-link>
            点击查看
            </mt-cell>
        </div>
        <div @click="$router.push('changeqq')">
            <mt-cell title="联系QQ" label="(填写有助于提高中奖率哦)" is-link>
                {{userinfo.qq==''?"请绑定":userinfo.qq}}
            </mt-cell>
       </div>
       <div @click="userinfo.is_check==0?$router.push('changeTel'):''">
            <mt-cell title="联系电话" label="(若您的手机已丢失或停用，请立即更换)" :is-link="userinfo.is_check==0?true:false">
                {{userinfo.is_check==0?"请绑定":"已绑定"}}
            </mt-cell>
       </div>
       <div @click="$router.push('security')">
            <mt-cell title="账户安全" is-link>
                查看
            </mt-cell>
        </div>
        <mt-datetime-picker
            v-model="pickerValue"
            ref="picker"
            type="date"
            year-format="{value} 年"
            month-format="{value} 月"
            date-format="{value} 日"
            :startDate="startDate"
            :endDate="endDate"
            @confirm="changeBirth">
        </mt-datetime-picker>
        <input accept="image/*" name="img" id="imgFile" type="file" @change="upload" v-show="1>2">
        <img :src="headerImg"  alt="" id="bigimg" v-show="1>2">
        <van-button type="danger" @click="loginOut">退出/切换账户</van-button>
    </div>
</template>
<script>
import axios from "axios"
import {Toast,Dialog} from 'vant';
import {getObjectURL} from "../../../tool/upload.js"
import Top from "../../../components/top/normalTop.vue"
import {mapState,mapActions} from "vuex"
import lrz from "lrz"

export default {
    data() {
        return {
            actions:[
                {name:"相册",method:()=>{this.goPick()}}
            ],
            sexactions:[
                {name:"男",method:()=>{this.changeSex(1)}},
                {name:"女",method:()=>{this.changeSex(2)}}
            ],
            headerVisible:false, //选择头像弹窗显隐
            sexVisible:false,  //选择性别弹窗显隐
            headerImg:require('../../../assets/logo.png'), //头像地址
            pickerValue:new Date('1950-01-01'), //日期选择器初始日期
            startDate:new Date('1950-01-01'),  //日期选择器开始日期
            endDate:new Date() //日期选择器结束日期

        }
    },
    components:{
        Top
    },
    mounted() {
        this.getUserinfo();
        this.isLogin();
    },
    updated(){
    },
    methods: {
        ...mapActions(["getUserinfo","isLogin"]),
        //上传头像
        upload(e){
            let fileMsg = e.currentTarget.files;
            let path = getObjectURL(fileMsg[0]);
            let dataURL=null;
            let that =this
            lrz(fileMsg[0],{width:200}).then(function(rst){
                dataURL= rst.base64
                axios.post(that.url+"/center/upload",{baseImage:dataURL,scenario:3}).then(res=>{
                    if(res.data.status=="1000"){
                        let imgPath = res.data.data.filedir;
                        axios.post(that.url+"/bind_info/change_avatar",{avatar:imgPath}).then(res=>{
                            if(res.data.status=="1000"){
                                that.userinfo.avatar=path;                  //本地更新头像
                            }else{
                                 that.userinfo.avatar=require('../../../assets/logo.png');
                            }
                            Toast(res.data.msg)
                        }).catch(err=>{
                            Toast("错误："+err)
                            that.userinfo.avatar=require('../../../assets/logo.png');
                        })
                    }else{
                        Toast(res.data.msg)
                    }
                })  
            }).catch((error)=>{
                     Toast("错误："+error)
                     that.userinfo.avatar=require('../../../assets/logo.png');
            }).always(()=>{
                
            })
             
        },
        goPick(){
            document.getElementById("imgFile").click();
        },
        changeSex(sex){
            Dialog.confirm({
            title: '标题',
            message: '性别务必保持与支付宝截图相同，是否继续操作？'
            }).then(() => {
                axios.post(this.url+"/bind_info/gender",{gender:sex}).then(res=>{
                    if(res.data.status=="1000"){
                        Toast("修改成功");
                        this.userinfo.gender = sex
                    }else{
                        Toast(res.data.msg)
                    }
                 }).catch(err=>{
                     Toast.fail("错误："+err)
                 })
            }).catch(() => {
            // on cancel
            });
        },
        //打开日期选择器
        openPicker() {
            this.$refs.picker.open();//设置开始
        },
        //改变生日
        changeBirth(){
            let years =this.pickerValue.getFullYear();
            let month =this.pickerValue.getMonth()+1;
            let day=this.pickerValue.getDate()
            let birth = years+"-"+(month<10?"0"+month:month)+"-"+(day<10?"0"+day:day)
            axios.post(this.url+"/bind_info/updateBirth",{birth}).then(res=>{
                if(res.data.status=="1000"){
                    Toast("修改成功");
                    this.userinfo.birth = birth;
                }else{
                    Toast(res.data.msg)
                }
            }).catch(err=>{
                Toast.fail("错误："+err)
            })
            this.$refs.picker.close();
        },
        loginOut(){
            axios.post(this.url+"/login/loginOut").then(res=>{
                if(res.data.status=="1000"){
                    Dialog.confirm({
                    title: '提示',
                    message: '是否前往登录页面'
                    }).then(() => {
                    this.$router.replace({name:"login"})
                    }).catch(() => {
                    this.$router.push({name:"home"})
                    });
                }
            }).catch(err=>{
                Toast.fail("错误："+err)
            })
        }
    },
    computed: {
        ...mapState(["userinfo","url"])
    },
    filters:{
        sex:(value)=>{
            if(value==1){
                return "男"
            }else if(value==2){
                return "女"
            }else{
                return value
            }
        },
    },
}
</script>
<style lang="scss" scope>
.userinfo{
    #bigimg{
        width: 3rem;
        height: 3rem;
    }

    div{
        border:0px solid #ddd !important;outline:none !important;

        .mint-cell{
            &:last-child{
                background-size: 0px !important;
            }

            img{
                width: .4rem;
                height: .4rem;
            }
            .mint-cell-text{
                font-size: .24rem;
            }
            .mint-cell-value{
                font-size: .24rem;
            }
        }
    }
    .van-button--danger{
        display: block;
        margin: .4rem auto;
    }
}
</style>
