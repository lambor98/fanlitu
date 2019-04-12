<template>
    <div class="copywuxin sonBox">
        <ul>
            <li>
                <p class="title">第一步:该返利商品为五星文字好评活动</p>
                <textarea  id="txt" v-model="txt" placeholder="亲，请撰写返利商品的评价，评价内容要求至少15个字以上，商家会对评价进行评分，优质评价将提升您今后的中奖率"></textarea>
                <p class="red">此活动不需要晒图评价，淘宝评价禁止晒图</p>
                <p class="copyBtn" data-clipboard-target="#txt" @click="copy">复制评价内容</p>
                <p class="tip">若您的手机浏览器不支持一键复制，请动手点击  1.点击输入框  2.长按 3.全选  4.复制  5.打开淘宝APP</p>
            </li>
        </ul>
        <dl>
            <dt>温馨提示</dt>
            <dd>1.请按照好评要求进行评价，<span class="red">请勿直接前去淘宝评价</span>，好评必须商家审核通过后才可以复制到淘宝/天猫，否则将拉低中奖率</dd>
            <dd>2.收到好评之后，商家将在<span class="red">48</span>小时内确认评价，之后系统返款，请耐性等待，<span class="red">严禁到旺旺上催促商家审核评价</span>，否则将导致账号被封</dd>
        </dl>
        <van-cell title="上传评价截图" value="查看示例截图"  is-link/>
        <div class="pic_wuxin">
            <img :src="path" alt="" @click="open">
            <input accept="image/*" name="img" id="imgFile" type="file" v-show="2>3" @change="upload">
            <p>淘宝截图</p>
        </div>
        <p class="btn" @click="submit">提交评价</p>
    </div>
</template>
<script>
import {getObjectURL} from "../../../tool/upload.js"
import axios from "axios"
import lrz from "lrz"
import {Toast} from "vant"
import Clipboard from 'clipboard'
import {mapState} from "vuex"
export default {
    props:["info"],
    data(){
        return{
            path:require("../../../assets/images/user/img1.png"),
            txt:null,      //评论
            imgName:null,  //图片地址
        }
    },
    methods:{
        open(){
            document.getElementById("imgFile").click();
        },
        upload(e){
            let file = e.currentTarget.files[0];
            this.path = getObjectURL(file);
            lrz(file,{width:600}).then((rst)=>{
                let base64 = rst.base64;
                axios.post(this.url+"/center/upload",{baseImage:base64,scenario:2}).then(res=>{
                    if(res.data.status=="1000"){
                        this.imgName = res.data.data.filedir
                    }else{
                        Toast.faile("图片上传失败")
                         this.imgName = this.imgHeader+'static/user/img1.png'
                    }
                }).catch(err=>{
                    if(err){
                        Toast.fail("上传失败,请重新上传")
                         this.imgName = this.imgHeader+'static/user/img1.png'
                    }
                })
            })
        },
        copy(){
            let clipboard=new Clipboard('.copyBtn');
            clipboard.on('success', (e)=>{
                Toast.success("复制成功")
                e.clearSelection();
            });
            clipboard.on('error', ()=> {
               Toast.fail("复制失败，请手动或者重试")
            });
        },
        submit(){
            if(this.imgName){
                axios.post(this.url+"/comment/submitCopyFiveStar",{order_id:this.info.order_id,pic:this.imgName}).then(res=>{
                    if(res.data.status=="1000"){
                        Toast.success("提交成功")
                        this.$router.replace({name:"commentdone"})
                    }else{
                        Toast.fail(res.data.msg)
                    }
                }).catch(err=>{
                    Toast.fail("加载错误:"+err)
                })
            }else{
                Toast.fail("请上传截图")
            }
        },
    },
    watch:{
        info(val){
            this.txt = val.comment;
        },
    },
    computed:{
        ...mapState(["url"])
    }
    
}
</script>