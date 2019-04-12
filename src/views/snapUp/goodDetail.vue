<template>
    <div class="goodDetail box">
            <Top title="抢购"/>
            <div class="good-top">
                 <img :src="good.master_pic_id?imgHeader+good.master_pic_id:'http://iph.href.lu/109x114?text=返利兔'" alt="">
                <div class="money-bottom">
                    <p>到手价：￥{{good.get_price}}</p>
                    <p>
                        <span>返利金币</span>
                        <span>{{good.fanli_gold}}金币</span>
                    </p>
                </div>
            </div>
            <div class="good-main">
                <div class="good-detail">
                    <div class="detail-title">
                        <img :src="imgHeader+'static/home/taobao.png'" v-if="good.paltform==100">
                        <img :src="imgHeader+'static/home/mall.png'" v-if="good.paltform==101">
                        <p>{{good.goods_name}}</p>
                    </div>
                    <ul class="detail-price">
                        <li>
                            到手价：<span class="red">￥{{good.get_price}}</span>
                            <del>￥{{good.get_price*1+good.fanli_gold*1}}</del>
                        </li>
                        <li>
                            下单价：￥{{good.get_price*1+good.fanli_gold*1}}（可返现{{good.fanli_gold}}金币）
                        </li>
                    </ul>
                    <ul class="detail-num">
                        <li>
                            限量：<span class="red">{{good.task_nums}}</span>份
                        </li>
                        <li>
                            <span class="red">{{good.used_nums}}</span>人已申请
                        </li>
                        <li>
                            剩余：<span class="red">{{good.can_use_nums}}</span>件
                        </li>
                    </ul>
                   
                </div>
                <div class="buy-step">
                    <p>购买流程</p>
                    <ul>
                        <li v-for="(item,index) in step" :key="index">
                            <img  :src="imgHeader+'static/shoppingStep/step_03.png'" alt="">
                            <span>{{index+1}}</span>
                            <span>{{item}}</span>
                        </li>
                    </ul>
                </div>
                <van-tabs v-model="active" :line-width="0" class="tip">
                    <van-tab v-for="(item,index) in tip" :key="index" :title="item">
                        <p v-if="index==1">该功能还未上线哦~</p>  <!--商品评价页面-->
                        <div class="detail_pic" v-if="index==0">
                            <!-- <p v-for="(item,index) in picList" :key="index" v-html="picList[index]"></p>-->
                            <p v-if="picList.length==0">暂时没有详情呢~~</p><!--商品详情 -->
                            <img v-for="(img,index) in picList" v-lazy="img" :key="index" >
                        </div>
                        <Tuijian v-if="index==3"/><!--猜你喜欢-->
                    </van-tab>
                </van-tabs>
            </div>
            <ul class="good-bottom">
               <li @click="shareShow = true">
                   <img :src="imgHeader+'static/shoppingStep/share.png'" alt="">
               </li>
               <li @click="snapUp">
                   立即抢购
               </li>
            </ul>
            <Alert :done="isShow" :order_id="orderId" :trade_id="tradeId" :mins="min" :secs="sec"  @changeDone="showAlert"/>
            <!-- <van-actionsheet
            v-model="shareShow"
            :actions="share"
            @select="onSelect"
            /> -->
            <mt-popup
            v-model="shareShow"
            popup-transition="popup-fade">
                <share :config="config" v-if="config.url!=''"></share>
            </mt-popup>
    </div>
</template>
<script>
import Alert from "../../components/snapup/alert.vue"
import Top from "../../components/top/normalTop.vue"
import Tuijian from "../../components/snapup/tuijian.vue"
import "../../style/snapup/goodDetail.scss"
import {mapState,mapActions} from "vuex"
import axios from "axios"
import {Toast,Dialog} from "vant"
export default {

    data(){
        return{
            step:["抢购名额","抢购名额","确认收货并好评","确认收货并好评"],
            active:0,
            tip:["商品详情","购买评价","购买须知","猜你喜欢"],
            isShow:0,
            good:{},
            id:null, 
            orderId:null,  //订单id
            tradeId:null,   //主任务id
            min:59,      //剩余分钟
            sec:59,       //剩余秒
            shareShow:false, //分享窗口的显隐
            tId:null,  //时段id
            config:{
                url                 : '', // 网址，默认使用 window.location.href
                source              : 'wwwwww', // 来源（QQ空间会用到）, 默认读取head标签：<meta name="site" content="http://overtrue" />
                title               : '返利兔', // 标题，默认读取 document.title 或者 <meta name="title" content="share.js" />
                description         : '来和我一起返利吧', // 描述, 默认读取head标签：<meta name="description" content="PHP弱类型的实现原理分析" />
                image               : '', // 图片, 默认取网页中第一个img标签
                sites               : [ 'qq', 'wechat','weibo','qzone'], // 启用的站点
                wechatQrcodeTitle   : '微信扫一扫：分享', // 微信二维码提示文字
                wechatQrcodeHelper  : '<p>微信里点“发现”，扫一下</p><p>二维码便可将本文分享至朋友圈。</p>'
            },
            picList:[], //商品详情
        }
    },
    components:{
        Top,
        Alert,
        Tuijian
    },
    methods:{
        ...mapActions(['isLogin']),
        showAlert(val){
            this.isShow = val
        },
        snapUp(){  //开始抢购
            axios.post(this.url+"/order/rush_to_buy",{id:this.id,trade_plan_id:this.tId}).then(res=>{
                this.orderId= res.data.data.order_id
                this.tradeId= res.data.data.trade_id
                this.isShow = res.data.data.type
                if(res.data.status=="1007"){
                   Dialog.confirm({
                        title: '提示',
                        message: '您还未绑定淘宝买号是否前去绑定？'
                        }).then(() => {
                        // on confirm
                            this.$router.push({name:"bindTaobao"})
                        }).catch(() => {
                        // on cancel
                    });
                }else{
                    Toast(res.data.msg)
                }
                if(res.data.data.time){
                    this.min = res.data.data.time.min
                    this.sec = res.data.data.time.sec
                }else{
                    this.min=this.sec=59
                }
            }).catch(err=>{
               Toast.fail("错误："+err)
            })
              
        },

    },
    mounted(){
        
        this.isLogin()
        let {id,tId} = this.$route.query;
        if(!id && !tId){
            this.id = sessionStorage.id
            this.tId = sessionStorage.tId
        }else{
            this.id = id
            this.tId= tId
        }
        Toast.loading({
            message:"加载中"
        })
        axios.post(this.url+"/order/index",{id:this.id,trade_plan_id:this.tId}).then(res=>{ //获取商品详情
            Toast.clear()
            if(res.data.status=="1000"){
                this.good = res.data.data.goods_info
                this.tId = res.data.data.trade_plan_id;
                let imgList = res.data.data.goods_info.detail_pic;
                for(let i = 0;i<imgList.length;i++){  //分解获取的商品详情
                    let list = imgList[i];
                    let newList = list.split(" ");  //获取src
                    for(let j=0;j<newList.length;j++){ //提取图片地址
                        if(newList[j].indexOf("src")==0){
                            let src= newList[j].slice(5,newList[j].length-1);
                            src = src.replace(/[<>&"]/g,"")
                           this.picList.push(src); 
                        }
                    }
                }
                this.config.title ="[返利兔]"+this.good.goods_name; //改变分享标题
                this.config.url=location.href
            }
        }).catch(err=>{
            Toast.fail("错误:"+err)
        })
        
       
    },
    computed:{
        ...mapState(["url","imgHeader"])
    }, 
    beforeRouteLeave (to, from, next) {
        if(to.name=="login"){
            sessionStorage.setItem("id",this.id);
            sessionStorage.setItem("tId",this.tId);
        }
        next()
    } 
}
</script>
<style lang="scss">
    .goodDetail{
        .mint-popup{
            padding: .1rem;
            border-radius: 1rem;
        }
    }
</style>


