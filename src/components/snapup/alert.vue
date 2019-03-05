<template>
    <div class="alert-box">
        <div class="success" v-if="done==1">
            <div class="successbox box">
                <img :src="require('../../assets/images/shoppingStep/reward.png')" alt="">
                <div class="abs tip2">
                    <p>获奖商品只有<span>1</span>小时下单时间</p>
                    <p>请及时下单</p>
                </div>
                <ul class="abs time">
                    <li>
                        <span>HOURS</span>
                        <div class="time-box">
                        <p>0</p>
                        <p>0</p>
                        </div>
                    </li>
                    <li>
                        <span>MINUITES</span>
                        <div class="time-box">
                        <p>{{Math.floor(this.min/10)}}</p>
                        <p>{{this.min%10}}</p>
                        </div>
                    </li>
                    <li>
                        <span>SECONDS</span>
                        <div class="time-box">
                        <p>{{Math.floor(this.sec/10)}}</p>
                        <p>{{this.sec%10}}</p>
                        </div>
                    </li>
                </ul>
                <img @click="order" class="abs btn" :src="require('../../assets/images/shoppingStep/order.png')" alt="">
            </div>
        </div>
        <div class="fail" v-if="done==2">
            <div class="failbox box">
                <img :src="require('../../assets/images/shoppingStep/noReward.png')" alt="">
               
                <img @click="$router.go(-1)" class="abs btn" :src="require('../../assets/images/shoppingStep/continue.png')" alt="">
            </div>
        </div>
         <div class="success" v-if="done==3">
            <div class="successbox box">
                <img :src="require('../../assets/images/shoppingStep/pending.png')" alt="">
                <div class="abs backTime">
                   <p>距离活动结束仅剩</p>
                </div>
                <ul class="abs time">
                    <li>
                        <span>HOURS</span>
                        <div class="time-box">
                        <p>0</p>
                        <p>0</p>
                        </div>
                    </li>
                    <li>
                        <span>MINUITES</span>
                        <div class="time-box">
                        <p>{{Math.floor(this.min/10)}}</p>
                        <p>{{this.min%10}}</p>
                        </div>
                    </li>
                    <li>
                        <span>SECONDS</span>
                        <div class="time-box">
                        <p>{{Math.floor(this.sec/10)}}</p>
                        <p>{{this.sec%10}}</p>
                        </div>
                    </li>
                </ul>
                <img @click="order" class="abs btn" :src="require('../../assets/images/shoppingStep/order.png')" alt="">
            </div>
        </div>
    </div>
</template>
<script>
import "./alert.scss"
export default {
    props:["done","order_id","trade_id","mins","secs"],
    data(){
        return{
            isShow:false,
            min:59,
            sec:59,
            timer:null,
        }
    },
    methods:{
        order(){
            this.$router.push({name:"going",query:{order_id:this.order_id,trade_id:this.trade_id}})
        },
        countTime(){
            this.min = this.mins;
            this.sec = this.secs;
            clearInterval(this.timer)
            this.timer=setInterval(()=>{
                this.sec--
                if(this.sec==0){
                    this.min--
                    this.sec=59
                }else if(this.sec== 0 && this.min == 0){

                    clearInterval(this.timer)
                }
            },1000)
        }
    },
    mounted(){
        this.countTime();
    },
    watch:{
        done(val){
            if(val){
                this.min = this.mins;
                this.sec = this.secs;
            }
        }
    }
 
        
    
}
</script>

