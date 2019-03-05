<template>
    <div class="user">
        <Top/>
        <div class="top-box">
            <div class="main-info">
                <div class="user-head" v-if="userinfo.user_name">
                    <img :src="userinfo.avatar==''?require('../assets/images/user/wang.png'):userinfo.avatar" alt="">
                    <p>{{userinfo.user_name}}</p>
                    <p v-show="2<1">会员到期时间:</p>   
                    <p v-show="2<1">会员续费</p>
                </div>
                <div class="user-head" v-if="!userinfo.user_name">
                    <van-button round type="danger" @click="$router.push('login')">登录/注册</van-button>
                </div>
                <div class="left-bg side">
                </div>
                <div class="right-bg side">
                </div>
            </div>
        </div>
        <div class="notice">
            <div class="horn">
                <img :src="require('../assets/images/user/news.png')" alt="">
            </div>
            <div class="notice-txt">

                <van-swipe :autoplay="5000" vertical :show-indicators="false" :touchable="false">
                    <van-swipe-item  v-for="(item,index) in userState.msgnums" :key="index">{{item.title}}</van-swipe-item>
                </van-swipe>
            </div>
        </div>
        <div class="my-event">
            <div class="my-order">
                <router-link tag="p" to="allgoods">
                    <van-cell title="我的订单" is-link value="全部订单"/>
                </router-link>
                <div class="order-list">
                    <ul>
                        <li v-for="(item,index) in orderList" :key="index">
                            <i>
                                <img :src="item.img" alt="">
                            </i>
                            <p>{{item.txt}}<i class="badge" v-if="userState.pro[index]!=0">{{userState.pro[index]}}</i></p>
                        </li>
                    </ul>
                </div>
            </div>
             <div class="my-gold">
                <van-cell title="我的金币" is-link value="资金详情" @click="$router.push('/userCenter/moneyDetail')"/>
                <div class="gold-list">
                    <ul>
                        <li v-for="(item,index) in goldList" :key="index">
                            <p><span>{{userState[item.name]}}</span>元</p>
                            <p>{{item.txt}}</p>
                        </li>
                    </ul>
                </div>
            </div>
            <van-cell title="我的邀请" is-link value="邀请明细" @click="$router.push('/userCenter/invite')" />
            <div class="my-invi">
                <div class="invi-list">
                    <ul>
                        <li v-for="(item,index) in inviList" :key="index">
                            <p><span>{{userState?userState.invite_statis[item.name]:0}}</span>{{index>2?"元":"人"}}</p>
                            <p>{{item.txt}}</p>
                        </li>
                    </ul>
                </div>
                <button class="goInvi" @click="$router.push({name:'invitation'})">前去邀请</button>
            </div>
            <div class="menuList">
                <ul>
                    <li tag="li" v-for="(item,index) in menuList" :key="index" @click="index==5?contact=true:''">
                        <router-link tag="span" :to="item.path">
                            <i>
                                <img :src="item.img" alt="">
                            </i>
                        <p>{{item.name}}</p>
                       </router-link>
                    </li>
                </ul>
            </div>
        </div>
        <Footer/>
       
        <Contact @close="closeAlert" v-if="contact"/>
    </div>
</template>
<script>
 /* eslint-disable */
import "../style/User.scss"
import Footer from '../components/footer.vue'
import Top from "../components/top/userTop.vue"
import {mapActions,mapState} from "vuex"
import axios from "axios"
import Contact from "../components/contact/contact.vue"
export default {
    data() {
        return {
            notice:[{title:"请各位试客加强网络安全防范意识"},{title:"请各位试客加强网络安全防范意识"},{title:"请各位试客加强网络安全防范意识"}],
            orderList:[
                {txt:"待下单",img:require("../assets/images/user/order1.png")},
                {txt:"待确定",img:require("../assets/images/user/order2.png")},
                {txt:"待评价",img:require("../assets/images/user/order3.png")},
                {txt:"待返款",img:require("../assets/images/user/order4.png")},
                {txt:"已完成",img:require("../assets/images/user/order5.png")},
            ],
            goldList:[{txt:"已返金币",name:"returned"},
                    {txt:"待返利金币",name:"wait_return"},
                    {txt:"提现中金币",name:"w_money"},
                    {txt:"已提现金币",name:"had_wit"}
                    ],
            inviList:[  
                {txt:"累积邀请人数",name:"all_invite"},
                {txt:"本月邀请人数",name:"this_month_invite"},
                {txt:"今日邀请人数",name:"today_invite"},
                {txt:"累积奖励金币",name:"all_reward"},
                {txt:"本月奖励金币",name:"this_month_reward"},
                {txt:"今日奖励金币",name:"today_gold"}
                ],
            menuList:[
                {name:"邀请有礼",img:require("../assets/images/user/menu1.png"),path:"/invitation"},
                {name:"金币提现",img:require("../assets/images/user/menu2.png"),path:"/userCenter/payback"},
                {name:"账号设置",img:require("../assets/images/user/menu3.png"),path:"/userCenter/userinfo"},
                {name:"绑定银行卡",img:require("../assets/images/user/menu4.png"),path:"/userCenter/bind/bindCard"},
                {name:"帮助中心",img:require("../assets/images/user/menu5.png"),path:"/userCenter/help"},
                {name:"联系客服",img:require("../assets/images/user/menu6.png"),path:""},
            ],
            contact:false,
        }
    },
    components:{
        Footer,
        Top,
        Contact
    },
 
    mounted() {
        document.documentElement.scrollTop = 0 ;
        document.body.scrollTop = 0;
        this.getUserinfo();
        this.getUserCenter();
        this.isLogin();
    },
    methods: {
      ...mapActions(["getUserinfo","getUserCenter",'isLogin']),
      closeAlert(val){
          this.contact=val;
      }
    },
    computed:{
        ...mapState(["userinfo","url","userState"])
    }
}
</script>
<style lang="scss" scoped>
 /* eslint-disable */

</style>
