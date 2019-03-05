<template>
    <div class="payback box">
        <Top title="提现"/>
        <div class="card" v-if="status=='1000'">
            <p>{{card.bank_name}}（{{card.sn}}）</p>
            <p>{{card.account_name}}</p>
        </div>
        <div class="money">
            <div v-if="status=='1000'">
                <p>可提现的金币：<span class="red">{{card.gold_amount}}</span>金币</p>
                <p>提现金币数量</p>
                <input v-model="num" type="text" placeholder="满200金币起提" autocomplete="off">
            </div>
            <van-button size="large" v-if="status=='1007'" type="danger" @click="$router.push({name:'bindCard'})">绑定银行卡</van-button>
            <van-button size="large" v-if="status=='1008'" type="warning">正在审核</van-button>
            <van-button size="large" v-if="status=='1000'" type="danger" @click="submit">提交申请</van-button>
            <span class="red" style="margin-top:.2rem">单次提现手续费10%，且不低于200元/笔</span>
        </div>
        <dl class="tip">
            <dt>
                提现须知： 
            </dt>
            <dd>1.提现金额必须为10元的整数倍且不少于200元，如200元、210元、220元等；</dd>
            <dd>2.提现余额可累计到下次提现，不会扣除不给提现！余额可购买赞助费、金币、抽奖、特卖商品等功能正在开发中即将上线！</dd>
            <dd>3.提现申请成功后，提现金额将在3-5个工作日到达您绑定的银行卡中（周六日提现申请顺延至周一处理，周五提现申请处理时间截止到中午12:00，12:00之后提现同样延迟至周一处理）</dd>
            <dd>4.提现需要扣除手续费10%，且单次提现最低手续费2元。</dd>
        </dl>
        <Alert v-if="isShow" @closeAlert="gaga" :cardId='card.cardId' :money='num'/>
    </div>
</template>
<script>
import Top from "../../../components/top/normalTop.vue"
import Alert from "../../../components/payback/payAlert.vue"
import axios from "axios"
import {mapState,mapActions} from "vuex"
import {Toast} from "vant"
export default {
    components:{
        Top,
        Alert
    },
    data(){
        return{
            isShow:false,//提现窗口显隐
            num:null,    //提现数量
            status:null, //用户当前状态
            card:null, //用户提现信息
        }
    },
    methods:{
        ...mapActions(["resizeWindow"]),
        gaga(value){
            this.isShow = value;
            setTimeout(() => {
                this.$router.go(0)
            }, 1000);
        },
         submit(){
           if(this.num%10==0){
               if(this.num>=200){
                   this.isShow = true
               }else{
                    Toast.fail("提现金额必须大于等于200")
               }
           }else{
               Toast.fail("提现数额必须是10的倍数")
           }
       }
    },
   created(){
        axios.post(this.url+'/withdrawal/getCashInfo').then(res=>{
            this.status = res.data.status
            if(res.data.status=="1000"){
                this.card = res.data.data.info
            }else{
                Toast.fail(res.data.msg)
            }
        }).catch(err=>{
            Toast.fail("错误："+err)
            setTimeout(() => {
                this.$router.go(-1)
            }, 2000);
        })
        this.resizeWindow()
    },
    computed:{
        ...mapState(["url"])
    },

    
}
</script>
<style lang="scss" scoped>
.payback{
    .card{
        display: flex;
        justify-content: space-between;
        margin:  0 .3rem;
        padding: .2rem 0;
        border-bottom: 1px solid #ddd;
    }
    .money{
        padding: .2rem;
        p{
            padding-bottom: .1rem;
            span{
                font-weight: bold;
                display: inline;
            }
        }
        input{
            border:  1px solid #ddd;
            padding: .1rem;
        }
        .van-button{
            margin-top: .4rem;
        }
        .red{
            color: red;
        }
        span{
          text-align: center;
          display: block;
        }
    }
    .tip{
        padding: 0 .25rem;
        line-height: .4rem;
        dd{
        color: #666;
        }
    }
}
</style>
