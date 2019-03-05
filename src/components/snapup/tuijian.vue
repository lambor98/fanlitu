<template>
    <div class="tuijian">
         <div class="recommend">
            <div class="content-title">
                <!-- <p>
                  猜你喜欢
                  <span class="tab-line"></span>
                </p> -->
            </div>
            <ul>
                <li v-for="(item,index) in recommend" :key="index">
                    <img :src="imgHeader+item.master_pic_id" alt="">
                    <p>
                        <span>{{item.goods_name}}</span>
                        <span>+{{item.fanli_gold}}</span>
                    </p>
                    <p>
                        <del>￥{{item.goods_price}}</del>
                        <span>限:{{item.task_nums}}份</span>
                    </p>
                    <p @click="buy(item.id,item.trade_plan_id)">
                        立即抢购
                    </p>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import axios from "axios"
import {mapState} from "vuex"
import {Toast} from "vant"
export default {
    data(){
        return{
            recommend:[]
        }
    },
    mounted(){
        axios.post(this.url+"/order/complete").then(res=>{
            this.recommend = res.data.data.list
        }).catch(err=>{
              Toast.fail("加载错误:"+err)
          })
    },
    computed:{
        ...mapState(["url","imgHeader"])
    }
    
}
</script>
<style lang="scss" scoped>
 .recommend{
        .content-title{
               font-size: .26rem;
               p{
                    text-align: center;
                    position: relative;
                    
                    .tab-line{
                        width: 1.62rem;
                        height:.05rem;
                        background: #f6cf08;
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: -.1rem;
                        margin: auto;
                        z-index:-1;
                    }
               }
           }
           ul{
               display: flex;
               flex-wrap: wrap;
               li{
                   width: 3.38rem;
                   border: 1px solid #ddd;
                   margin-left: .24rem;
                   margin-top: .24rem;
                   img{
                       width: 3.38rem;
                       height: 3.38rem;
                   }
                   p{
                       display: flex;
                       padding: 0 .1rem;
                       margin-top: .1rem;
                       color: #000 !important;
                       span{
                           overflow: hidden;
                           white-space: nowrap;
                           text-overflow: ellipsis;
                           width: 50%;
                           &:last-child{
                               text-align: right;
                           }
                       }
                       del{
                           width: 50%;
                           color: #999;
                       }
                       &:last-child{
                           text-align: center;
                            width: 3.02rem;
                            height: .58rem;
                            display: block;
                            background: red;
                            color: white !important;
                            line-height: .58rem;
                            margin: .14rem auto;
                            border-radius: .05rem;
                            text-align: center;
                        }
                      
                   }
               }
           }
    }
</style>
