<template>
    <div class="bindTaoBao box">
        <van-notice-bar mode="closeable">
        请及时更新自己真实的旺旺号等级,每月可更新1次,旺旺等级不影响中奖率
        </van-notice-bar>

        <div class="top-tip">
            <p>绑定淘宝账号需满足:</p>
            <p>1.注册时间1个月以上、2.支付宝实名认证、3.账号等级2心以上</p>
        </div>
        <van-cell-group v-if="!isBind">
            <van-field label="淘宝账号：" v-model="account" placeholder="请填写日常购物买号，非刷单号" />
            <span class="tip">查看正确淘宝账号></span>
            <van-cell title="淘宝等级：" :value="level?columns[level-1]:'请选择'" is-link @click="show=true"/>
            <van-cell title="上传淘宝等级截图"  />
            <span class="tip">查看如何上传等级事例截图></span>
            <div class="jietu">
                <img :src="path?path:imgHeader+'static/user/img1.png'" @click="openFile" alt="">
                <input accept="image/*" name="img" id="imgFile" type="file" @change="upload" v-show="1>2">
                <p>淘宝账号等级截图</p>
                <ul>
                    <li>
                        1. 登录淘宝APP-[我的淘宝]-点击头像上方[设置]-点击头像-[用户名]显示账号即为正确的淘宝账号 
                    </li>
                    <li>
                        2.请绑定自己经常购物的淘宝账号,有利于提升自己的试用通过率
                    </li>
                    <li>
                        3.严禁绑定刷单账号,一经核查将直接按封号处理！
                    </li>
                </ul>
            </div>  

            <van-button type="danger" size="large" @click="check">提交审核</van-button>

           
        </van-cell-group>
            <van-button v-if="isBind" type="warning" size="large">正在审核</van-button>

        <van-popup v-model="show" position="bottom" :overlay="true"> 
            <van-picker
            show-toolbar
            title="等级选择"
            :columns="columns"
            @cancel="show=false"
            @confirm="onConfirm"
            />
        </van-popup>
          
    </div>
</template>
<script>
import { getObjectURL } from "../../../tool/upload.js"
import {Toast} from "vant"
import axios from "axios"
import {mapState,mapActions} from "vuex"
import lrz from "lrz"
export default {
    data() {
        return {
            account:null,
            show:false,
            columns:["一心","二心","三心","四心","五心","一钻","二钻","三钻","四钻","五钻","一皇冠","二皇冠","三皇冠","四皇冠","五皇冠"],
            level:null,
            dataUrl:"",
            path:null,
            worn1:false,
            worn2:false,
            worn3:false,
            imgName:"",
             //是否真正审核
        }
    },
    created(){
      this.getSecure()
    },
    methods: {
        ...mapActions(["getSecure"]),
        onConfirm(value,index){
            this.level = index*1+1;
            this.show = false
        },
        openFile(){
            document.getElementById("imgFile").click();
        },
        upload(e){                                              //将图片转换成base64码并上传                 
            let file = e.currentTarget.files[0];
            let that = this;
            this.path = getObjectURL(file)
            lrz(file,{width:600}).then(function(rst){
                that.dataUrl=rst.base64;
               axios.post(that.url+"/center/upload",{baseImage:that.dataUrl,scenario:1}).then(res=>{
                    if(res.data.status=="1000"){
                        that.imgName = res.data.data.filedir;
                    }else{
                        Toast.fail(res.data.msg)
                        that.imgName =this.imgHeader+'static/user/img1.png';
                    }
                })
            }).catch((error)=>{
                if(error){
                  Toast.fail("未知错误,请重试")
                    that.imgName =this.imgHeader+'static/user/img1.png';
                }
            })
        },
        check(){                                                   //检查输入
           this.worn1 = !this.account?false:true;
           this.worn2 = !this.level?false:true;
           this.worn3 = !this.path?false:true;
           if(!this.worn1){
               Toast.fail("买号不得为空")
           }else if(!this.worn2){
               Toast.fail("等级不得为空")
           }else if(!this.worn3){
               Toast.fail("请上传截图")
           }else{
               this.goSubmit()
           }
        },
        goSubmit(){                                                 //提交申请
            axios.post(this.url+"/bind_info/bindTao",{tao_name:this.account,bind_level:this.level,leave_image:this.imgName}).then(res=>{
                if(res.data.status=="1000"){
                    this.$router.go(-1)
                    Toast.success(res.data.msg)
                }else{
                    Toast.fail(res.data.msg)
                }
            })
        }
      
    },
  
    computed: {
      ...mapState(["imgHeader","url","userSecure","isBind"])  
    },
    updated(){
        
    }
    
}
</script>
<style lang="scss">
    .bindTaoBao{
        margin-top: .88rem;
        .top-tip{
            padding: .1rem .2rem .5rem .32rem;
            p{
                margin-top: .1rem;
                font-size: .24rem;
            }
        }
        .jietu{
            display: flex;
            justify-content: center;
            flex-direction: column;
            text-align: center;
            align-items: center;
            img{
                width: 2.1rem;
                height: 2.1rem;
            }
            p{
                margin-top: .3rem;
                font-size: .24rem;
            }
            ul{
                margin-top: .4rem;
                li{
                    text-align: left;
                    padding: .04rem .2rem;
                    color: #666;
                }
            }
            
        }
        .van-cell-group{
            .tip{
                padding: .2rem;
                text-align: center;
                display: block;
                color: rgb(160, 160, 241);
            }
            .van-button--danger{
                width: 90%;
                margin: auto;
                display: block;
                margin-top: 1rem;
            }
            
        }
       
        
    }
</style>
