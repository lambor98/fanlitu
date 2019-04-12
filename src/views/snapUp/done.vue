<template>
    <div class="done box">
        <Top title="抢购"/>
        <div class="success-tip">
            <img :src="imgHeader+'static/shoppingStep/success.png'" alt="">
            <p>您的抢购申请已提交，继续抢购吧！</p>
            <p @click="$router.replace({name:'home'})">继续抢购</p>
        </div>
        <div class="recommend">
            <div class="content-title">
                <p>
                  今日推荐
                  <span class="tab-line"></span>
                </p>
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
import Top from "../../components/top/normalTop.vue"
import axios from "axios"
import {mapState} from "vuex"
import {Toast} from "vant"
export default {
    data(){
        return{
            recommend:{}
        }
    },
    components:{
        Top
    }, 
    computed:{
        ...mapState(["url","imgHeader"])
    },
    mounted(){
        axios.post(this.url+"/order/complete").then(res=>{
            this.recommend = res.data.data.list
        }).catch(err=>{
            Toast.fail("错误"+err)
        })
    },
    methods:{
        buy(id,tId){
            this.$router.push({name:'gooddetail',query:{id,tId}})
        }
    }
    
}
</script>
<style lang="scss">
.done{
    .success-tip{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: .3rem 0;
        img{
            width: .8rem;
        }
        p{
            font-size: .28rem;
            margin-top:  .2rem;
            color: #666;
            &:last-child{
                width: 3rem;
                height: .6rem;
                background: red;
                border-radius: .1rem;
                color:white;
                text-align: center;
                line-height: .6rem;
            }
            
        }
    }
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
                           color: #fff !important;
                       }
                       &:last-child{
                           text-align: center;
                            width: 3.02rem;
                            height: .58rem;
                            display: block;
                            background: red;
                            color: white;
                            line-height: .58rem;
                            margin: .14rem auto;
                            border-radius: .05rem;
                            text-align: center;
                        }
                      
                   }
               }
           }
    }
}
</style>
