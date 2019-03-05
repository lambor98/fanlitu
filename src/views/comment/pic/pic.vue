<template>
    <div class="pic sonBox">
        <ul>
            <li v-if="info.is_bohui">  <!--自定义属性，若请求被驳回则不存在-->
                <p class="title">评价驳回理由</p>
                <p class="reason">{{info.rejected_mark}}</p>
            </li>
            <li>
                <p class="title">第一步:该返利商品为图文好评活动</p>
                <textarea v-model="txt" placeholder="亲，请撰写返利商品的评价，评价内容要求至少15个字以上，商家会对评价进行评分，优质评价将提升您今后的中奖率"></textarea>
            </li>
            <li>
                <p class="title">第二步:请上传{{tu_num}}张返利图片</p>
                <div class="worn">
                    <p>提醒:</p>
                    <p>
                        <span>1.此为图文好评活动，收到商品需晒图，无需真人出镜，严禁盗图，违者封号</span>
                        <span>2.需要上传{{tu_num}}张图片，可以包含精致的商品正面图、背面图、细节图等</span>
                    </p>
                </div>
                <ul class="pic_list">
                    <li  v-for="(item,index) in path" :key="index">
                        <img :src="path[index]" alt="" @click="open(index)">
                        <input accept="image/*" name="img" :id="'imgFile'+index" type="file" v-show="2>3" @change="upload" :data-id="index">
                    </li>
                </ul>
            </li>
        </ul>
        <dl>
            <dt>温馨提示</dt>
            <dd>1.请按照好评要求进行评价，<span class="red">请勿直接前去淘宝评价</span>，好评必须商家审核通过后才可以复制到淘宝/天猫，否则将拉低中奖率</dd>
            <dd>2.收到好评之后，商家将在<span class="red">48</span>小时内确认评价，之后系统返款，请耐性等待，<span class="red">严禁到旺旺上催促商家审核评价</span>，否则将导致账号被封</dd>
        </dl>
        <p class="btn" @click="submit">提交评价</p>
    </div>
</template>
<script>
import {getObjectURL} from "../../../tool/upload.js"
import axios from "axios"
import lrz from "lrz"
import {mapState} from "vuex"
import {Toast} from "vant"
export default {
    props:["info"],
    data(){
        return{
            path:[],        //初始图片集合
            imgName:[],     //上传后图片集合
            txt:null,       //评论
            tu_num:null,    //图片数量
            flag:false,     //验证输入
        }
    },
    methods:{
        check(){  //检验输入
           if(this.txt){
               if(this.txt.length>=15){
                   if(this.imgName.length==this.tu_num){
                       this.flag = true
                   }else{
                       this.flag = false;
                       Toast.fail("请上传制定数量的图片")
                   }
               }else{
                    this.flag=false;
                    Toast.fail("评论至少15字")
               }
           }else{
               this.flag=false;
               Toast.fail("评论不可为空")
           }
        },
        open(i){
            document.getElementById("imgFile"+i).click();
        }, 
        upload(e){   //上传图片
            let index = e.currentTarget.getAttribute("data-id");
            let file = e.currentTarget.files[0];
            let picpath=getObjectURL(file);
            lrz(file,{width:600}).then(res=>{
                let picBase = res.base64;
                axios.post(this.url+"/center/upload",{baseImage:picBase,scenario:2}).then(res=>{
                    if(res.data.status=="1000"){
                        this.$set(this.path,index,picpath)
                        this.imgName[index]=(res.data.data.filedir)
                    }else{
                        Toast.fail("上传失败")
                        this.$set(this.path,index,require("../../../assets/images/user/img1.png"))
                    }
                }).catch(err=>{
                    if(err){
                        Toast.fail("上传失败,请重新上传")
                        this.$set(this.path,index,require("../../../assets/images/user/img1.png"))
                        
                    }
                })
            })
        },
        submit(){  //提交审核
            this.check();
            if(this.flag){  
                let path = !this.info.is_bohui?"submitPicEval":"submitRePicEval"
                axios.post(this.url+"/comment/"+path,{order_id:this.info.order_id,content:this.txt,goods:this.imgName}).then(res=>{
                    if(res.data.status=="1000"){
                        Toast.success("提交成功")
                        this.$router.replace({name:'commentdone'})
                    }else{
                        Toast.fail(res.data.msg)
                    }
                }).catch(err=>{
                    Toast.fail("加载错误:"+err)
                })
            }
        }
        
    },
    computed:{
        ...mapState(["url","imgHeader"])
    },
    watch:{
        info(val){
            this.tu_num = val.tu_num
            if(this.info.comment_pic){  //如果是驳回操作
                for(let i=0;i<this.info.comment_pic.length;i++){
                    this.imgName.push(this.info.comment_pic[i])
                    this.path.push(this.imgHeader+this.info.comment_pic[i])
                }
                this.txt = this.info.comment;
            }else{   //如果是第一次图文评价
                for(let i=0;i<this.tu_num;i++){
                    this.path.push(require("../../../assets/images/user/img1.png"))
                }
            }
        }
    },

    
}
</script>