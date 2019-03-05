<template>
    <div class="footer">
        <ul>
            <router-link tag="li" :to="item.path" v-for="(item,index) in footList" :key="index">
                <img :src="item.img" alt="">
                <p>{{item.name}}</p>
            </router-link>
        </ul> 
    </div>
</template> 
<script>
export default {
    data() {
        return {
            footList:[
                {name:"首页",img:require("../assets/images/home/home.png"),path:"/home"},
                {name:"全部订单",img:require("../assets/images/home/allOrder.png"),path:"/allgoods"},
                {name:"邀请有礼",img:require("../assets/images/home/invitation.png"),path:"/invitation"},
                {name:"个人中心",img:require("../assets/images/home/user.png"),path:"/user"}
            ]
        }
    },
    
}
</script>
<style lang="scss">
    .footer{
        background: #2b3840;
        color: white;
        position: fixed;
        width: 100%;
        bottom: 0;
        ul{
            display: flex;
            li{
                width: 25%;
                text-align: center;
                padding: .16rem 0 .1rem 0;
                img{
                    display: block;
                    margin:auto;
                    width: .4rem;
                    height: .4rem;
                    margin-bottom: .1rem;
                }
                p{
                    font-size: .26rem;
                }
                &.router-link-exact-active{
                    background: #ff0000;
                }
            }
        }
    }
    
</style>
