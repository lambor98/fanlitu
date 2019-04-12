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
                    <p>下单数量：{{item.num?item.num:1}}</p>
                    <p>到手价：<span>￥{{item.goods_price}}</span></p>
                </div>
                <div class="right-box orderInfo">
                    <p class="alreadyBack">已完成</p>
                </div>
            </div>
        </li>
        
    </ul>
</template>
<script>
import {mapState} from "vuex"
export default {
    props:["goodsinfo","active"],
    computed:{
        ...mapState(["imgHeader"])
    }
    
}
</script>