<template>
    <ul>
        <li v-for="(item,index) in goodsinfo" :key="index" class="animated fadeIn">
            <mt-cell :title="item.store_name">
                <span>{{item.third_orde_sn}}</span>
                <img slot="icon" v-if="item.paltform==100" :src="imgHeader+'static/home/taobao.png'" width="24" height="24">
                <img slot="icon" v-if="item.paltform==101" :src="imgHeader+'static/home/mall.png'" width="24" height="24">
            </mt-cell>
            <div class="each-good">
                <div class="left-box orderInfo">
                    <img :src="item.master_pic_id?imgHeader+item.master_pic_id:'http://iph.href.lu/109x114'" alt="">
                </div>
                <div class="mid-box orderInfo">
                    <p>商品名：{{item.goods_name}}</p>
                    <!-- <p>规格：{{item.size}}</p> -->
                    <p>下单数量：{{item.num?item.num:'1'}}</p>
                    <p>到手价：<span>￥{{item.goods_price}}</span></p>
                </div>
                <div class="right-box orderInfo">
                    <p :class="'orderState '+(item.order_status==10||item.order_status==21||item.order_status==51?'redp':'')">{{item.order_msg}}</p>
                    <p class="toEva" v-if="item.order_status==21" @click="$router.push({name:'going',query:{order_id:item.order_id,trade_id:item.trade_id,repay:true}})">重新支付</p>
                    <p class="toEva" v-if="item.hao_type==1&&(item.order_status==30||item.order_status==51)" @click="$router.push({name:'wuxin',query:{oId:item.order_id,type:0}})">{{item.order_status==51?'重新评价':'五星评价'}}</p>
                    <p class="toEva" v-if="item.hao_type==2&&(item.order_status==30||item.order_status==51)" @click="$router.push({name:'pic',query:{oId:item.order_id,type:1}})">{{item.order_status==51?'重新评价':'图文评价'}}</p>
                    <p class="toEva" v-if="item.hao_type==3&&(item.order_status==30||item.order_status==51)" @click="$router.push({name:'keywords',query:{oId:item.order_id,type:2}})">{{item.order_status==51?'重新评价':'关键词评价'}}</p>
                    <p class="cancelOrder" v-if="item.order_status==10" @click="cancel(item.order_id)">取消订单&nbsp;</p>
                    <p class="toEva" v-if="item.hao_type==1&&item.order_status==60" @click="$router.push({name:'copywuxin',query:{oId:item.order_id,type:0}})">复制评价</p>
                    <p class="toEva" v-if="item.hao_type==2&&item.order_status==60" @click="$router.push({name:'copypic',query:{oId:item.order_id,type:1}})">复制评价</p>
                    <p class="toEva" v-if="item.hao_type==3&&item.order_status==60" @click="$router.push({name:'copykey',query:{oId:item.order_id,type:2}})">复制评价</p>
                </div>
            </div>
            <div class="countTime" v-if="item.over_time">
                <CountTime :min="item.over_time.min" :sec="item.over_time.sec" :id="item.order_id" :tId="item.trade_id"/>
            </div>
        </li>
    </ul>
</template>
<script>
import {mapState} from "vuex"
import CountTime from "./countTime"

export default {
    props:["goodsinfo","active"],
    data() {
        return {
            orderList:[]
        }
    },
    computed:{
        ...mapState(["url","imgHeader"])
    },
    methods: {
        cancel(id){
            this.$emit("cancelOrder",{id})
        }
    },
    components:{
        CountTime
    }

}
</script>