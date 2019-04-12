<template>
    <div class="moneyDetail box">
        <Top title="资金明细"/>
        <van-tabs v-model="active" :line-width="0">
            <van-tab title="全部记录">
                <ul>
                    <li v-for="(item,index) in allList" :key="index" class="animated flipInX">
                        <div class="title">
                            <div class="title-left">
                                <img :src="imgHeader+'static/home/taobao.png'" v-if="item.paltform==100" alt="">
                                <img :src="imgHeader+'static/home/mall.png'" v-if="item.paltform==101">
                                <p>{{item.store_name}}</p>
                            </div>
                            <div class="title-right">
                               {{item.order_sn}}
                            </div>
                        </div>
                        <div class="detail">
                           <div class="detail-left">
                               <img :src="imgHeader+item.master_pic_id" alt="">
                           </div>
                           <div class="detail-mid">
                               <p>商品名：{{item.goods_name}}</p>
                               <p>返利金币：<span class="red">￥{{item.fanli_gold}}</span></p>
                           </div>
                           <div class="detail-right">
                                <p class="red" v-if="item.type==4">{{item.type_msg}}</p>
                               <p v-if="item.type==1" class="red">{{item.type_msg}}</p>
                               <p v-if="item.type==3" class="gray">{{item.type_msg}}</p>
                               <p v-if="item.type==2" class="gray">{{item.type_msg}}</p>
                           </div>
                        </div>
                    </li>
                </ul>
            </van-tab>
            <van-tab title="返利金币记录">
                 <ul>
                    <li v-for="(item,index) in allList" :key="index" class="animated flipInX">
                        <div class="title">
                            <div class="title-left">
                                <img :src="imgHeader+'static/home/taobao.png'" v-if="item.paltform==100" alt="">
                                <img :src="imgHeader+'static/home/mall.png'" v-if="item.paltform==101">
                                <p>{{item.store_name}}</p>
                            </div>
                            <div class="title-right">
                               {{item.order_sn}}
                            </div>
                        </div>
                        <div class="detail">
                           <div class="detail-left">
                               <img :src="imgHeader+item.master_pic_id" alt="">
                           </div>
                           <div class="detail-mid">
                               <p>商品名：{{item.goods_name}}</p>
                               <p>返利金币：<span class="red">￥{{item.fanli_gold}}</span></p>
                           </div>
                           <div class="detail-right">
                               <p class="red" v-if="item.type==4">{{item.type_msg}}</p>
                               <p v-if="item.type==1" class="red">{{item.type_msg}}</p>
                               <p v-if="item.type==3" class="gray">{{item.type_msg}}</p>
                               <p v-if="item.type==2" class="gray">{{item.type_msg}}</p>
                           </div>
                        </div>
                    </li>
                </ul>
            </van-tab>
            <van-tab title="提现金币记录">
                 <ul>
                     <li v-for="(item,index) in allList" :key="index" class="animated flipInX">
                        <div class="title">
                            <div class="title-left">
                                <img :src="imgHeader+'static/home/taobao.png'" v-if="item.paltform==100" alt="">
                                <img :src="imgHeader+'static/home/mall.png'" v-if="item.paltform==101">
                                <p>{{item.store_name}}</p>
                            </div>
                            <div class="title-right">
                               {{item.order_sn}}
                            </div>
                        </div>
                        <div class="detail">
                           <div class="detail-left">
                               <img :src="imgHeader+item.master_pic_id" alt="">
                           </div>
                           <div class="detail-mid">
                               <p>商品名：{{item.goods_name}}</p>
                               <p>返利金币：<span class="red">￥{{item.fanli_gold}}</span></p>
                           </div>
                           <div class="detail-right">
                               <p class="red" v-if="item.type==4">{{item.type_msg}}</p>
                               <p v-if="item.type==1" class="red">{{item.type_msg}}</p>
                               <p v-if="item.type==3" class="gray">{{item.type_msg}}</p>
                               <p v-if="item.type==2" class="gray">{{item.type_msg}}</p>
                           </div>
                        </div>
                    </li>
                </ul>
            </van-tab>
            <div class="nogoods" v-if="allList.length==0">
                 <img :src="imgHeader+'static/user/none.png'" alt="">
                 <p class="gray">暂无明细</p>
            </div>
        </van-tabs>
        
    </div>
</template>
<script>
import Top from "../../../components/top/normalTop.vue"
import axios from "axios";
import {mapState} from "vuex"
import { Toast } from 'vant';
export default {
    components:{
        Top
    },
    data() {
        return {
            active:0, //选项卡
            allList:[], //所有返利信息
        }
    },
    mounted(){
        this.getInfo();
    },
    computed:{
        ...mapState(["url","imgHeader"])
    },
    methods:{
        getInfo(){
            axios.post(this.url+"/center/funds_record",{val:(this.active+1)}).then(res=>{
                if(res.data.status=="1000"){
                    this.allList = res.data.data.list;
                }else{
                    Toast.fail(res.data.msg)
                }
            }).catch(err=>{
               alert("错误："+err)
            })
        }
    },
    watch:{
        active(){
            this.getInfo()
        }
    }
    
    
}
</script>
<style lang="scss">
.moneyDetail{
    .red{
        color: red;
    }
    .gray{
        color: #999;
    }
    .van-tab{
        font-size: .26rem !important;
    }
    .van-tab--active{
        background: red;
        color: white;
        font-size: .26rem !important;
    }
    ul{
        li{
            .title{
                display: flex;
                padding: .1rem;
                .title-left{
                    width: 50%;
                    display: flex;
                    align-items: center;
                    img{
                        width: .3rem;
                        height: .3rem;
                    }
                    p{
                        font-weight: bold;
                        padding-left: .1rem;
                    }
                }
                .title-right{
                    width: 50%;
                    text-align: right;
                    color: #999;
                }
            }
            .detail{
                display: flex;

                .detail-left{
                    width: 20%;
                    padding: .15rem .1rem;
                    img{
                        width:.82rem;
                        height: .82rem;
                    }
                }
                .detail-mid{
                    width: 60%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    span{
                        font-size: .26rem;
                    }
                }
                .detail-right{
                    width: 20%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }
            }
        }
    }


}
</style>
