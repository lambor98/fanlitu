<template>
    <div class="allgoods box">
        <Top title="全部订单"/>
        <div class="main-box">
            <van-tabs v-model="active" swipeable :line-width="0" @change="changeTab">
                <van-tab v-for="(item,index) in tag" :key="index" :title="item" >
                <!-- <ul>
                        <li v-for="(item,index) in goodsinfo" :key="index">
                            <mt-cell :title="item.shop">
                                <span>{{item.shopId}}</span>
                                <img slot="icon" :src="require('../assets/images/home/taobao.png')" width="24" height="24">
                            </mt-cell>
                            <div class="each-good">
                                <div class="left-box orderInfo">
                                    <img :src="require('../assets/images/order/test.jpg')" alt="">
                                </div>
                                <div class="mid-box orderInfo">
                                    <p>商品名：{{item.name}}</p>
                                    <p>规格：{{item.size}}</p>
                                    <p>下单数量：{{item.num}}</p>
                                    <p>到手价：<span>￥{{item.price}}</span></p>
                                </div>
                                <div class="right-box orderInfo">
                                    <p class="orderState">
                                        订单处理中
                                    </p>
                                    <p class="toEva">前去评价</p>
                                    <p class="cancelOrder">取消订单</p>
                                </div>
                            </div>
                        </li>
                     </ul> -->
                     <component :is="partView[index]" :goodsinfo="goodsinfo" :cancelReason="cancelReason" :active="active" @cancelOrder="showDialog"></component>
                     <!-- <All :goodsinfo="goodsinfo"/> -->
                </van-tab>
            </van-tabs>
        </div>
        <van-dialog  
        v-model="show"
        show-cancel-button
        @confirm="giveUp"
        title="放弃原因">
            <span class="tip">告诉我们您的放弃原因，我们将继续改进与提升</span>
            <van-radio-group v-model="radio">
                <van-radio :name="item.id" v-for="(item,index) in cancelReason" :key="index">{{item.reason_name}}</van-radio>
            </van-radio-group>
            <input type="text" v-model="otherReason" class="dialog-input">
        </van-dialog>
        <Footer/>
        <div class="nogoods" v-if="goodsinfo.length==0">
            <img :src="require('../assets/images/user/none.png')" alt="">
            <p>暂时没有商品呢</p>
        </div>
    </div>
</template>
<script>
 /* eslint-disable */

import Footer from '../components/footer.vue'
import Top from "../components/top/homeTop.vue"
import "../style/AllGoods.scss"
import All from "../components/order/all.vue"
import Process from "../components/order/process.vue"
import Payback from "../components/order/payback.vue"
import Done from "../components/order/done.vue"
import {mapState,mapActions} from "vuex"
import axios from "axios"
import {Toast} from "vant"
export default {
    data(){
        return{
            active:0,     //当前tab
            tag:["全部商品","订单进程","待返利","已完成"],
            tag2:["待下单任务","订单已提交等待商家确认","等待收获评价","评价待审核","评价已审核待商家缺人","已取消订单"],
            goodsinfo:{},
            activeName:'1',
            partView:["All","Process","Payback","Done"],
            show:false,         //放弃订单窗口显示
            radio:null,         //放弃单选框值
            otherReason:null,   //取消原因
            cancelId:null,      //取消订单商品ID

        }
    },
    created(){
        this.isLogin()
    },
    mounted() {
        this.changeTab()
        this.getReason();
        document.documentElement.scrollTop = 0 ;
        document.body.scrollTop = 0;
      
    },
    components:{
        Footer,
        Top,
        All,
        Process,
        Payback,
        Done,
    },
    computed:{
        ...mapState(["url","cancelReason"])
    },
    methods:{
        ...mapActions(["isLogin","getReason"]),
        changeTab(type){ //切换Tab
            type = type?type:this.active
            axios.post(this.url+"/order/pro",{val:(type*1+1)}).then(res=>{
                if(res.data.status == "1000"){
                    this.goodsinfo = res.data.data.list
                }else{
                    Toast.fail(res.data.msg)
                }
                if(this.$route.query.type){  //是否是从个人中心页面跳转
                    this.active = this.$route.query.type
                }
             }).catch(err=>{
                 Toast.fail(err+"错误，请刷新或者联系管理员")
             })
        },
        giveUp(){  //放弃订单
            if(!this.otherReason){
                this.otherReason="无"
            }
            axios.post(this.url+"/order/cancel_order",{order_id:this.cancelId,reason:this.radio,content:this.otherReason}).then(res=>{
                if(res.data.status=="1000"){
                    Toast.success("取消成功")
                    this.changeTab();
                }else{
                    Toast.fail("取消失败")
                }
            }).catch(err=>{
                Toast.fail("错误:"+err)
            })
        },
        showDialog({id}){   //点击取消订单后显示放弃原因窗口
            this.show = true;
            this.cancelId = id
        },
        confirm(){
            this.giveUp()
        }
    }
}
</script>