<template>
    <div class="invia box">
        <Top title="邀请"/>
        <img class="banner" :src="imgHeader+'static/invitation/banner.png'" alt="">
        <div class="main">
            <div class="tip">
                <p>
                    <span>今日邀请好友数量:<span class="red">{{invInfo.today_invite}}</span>人</span>
                    <span>今日好友下单数量:<span class="red">{{invInfo.friends_ordered}}</span>单</span>
                </p>
                <p>
                    <span>累积邀请好友数量:<span class="red">{{invInfo.all_invite}}</span>人</span>
                    <span>累积好友下单数量:<span class="red">{{invInfo.frinds_order_all}}</span>单</span>
                </p>
                <p>今日赚取金币数量:<span class="red">{{invInfo.today_gold}}</span>金币</p>
                <p>当前返利额度{{invInfo.fanli}}，还差{{invInfo.need_people}}人获得{{invInfo.next_fanli}}的返利额度</p>
            </div>
            <div class="rules">
                 <img :src="imgHeader+'static/invitation/inv.png'" alt="">
                 <ul>
                     <li>邀请1名好友注册并下单即可获得2%返利资格，可获得好友返利金额2%返利额度 </li>
                     <li>邀请3名好友注册并下单即可获得3%返利资格，可获得好友返利金额3%返利额度 </li>
                     <li>邀请5名以上好友注册并下单即可获得5%返利资格，可获得好友返利金额5%返利额度</li>
                 </ul>
            </div>
            <div class="share">
                <img :src="imgHeader+'static/invitation/inv3.png'" alt="">
                <p class="share_tip">点击下方按钮，前去邀请好友</p>
                    <share v-if="inv" :config="config"></share>
            </div>
            <div class="rank">  
                <img :src="imgHeader+'static/invitation/inv1.png'" alt="">
                <table>
                    <tr>
                        <td>排名</td>
                        <td>邀请人账号</td>
                        <td>邀请数量</td>
                        <td>赚取金币数量</td>
                    </tr>
                    <tr v-for="(item,index) in rankList" :key="index">
                        <td>{{index+1}}</td>
                        <td>{{item.mobile | phone}}</td>
                        <td>{{item.invita_nums}}</td>
                        <td>{{item.gold}}</td>
                    </tr>
                </table>
            </div>
            <div class="ques">
                <img :src="imgHeader+'static/invitation/inv2.png'" alt="">
                <ul>
                    <li>1.好友的购物的邀请奖励什么时候可以到账呢</li>
                    <li>答：您的好友确认收货并拿到自己的返利金币后，您的邀请奖励也会在24小时内到账哦</li>
                    <li>2.我已经邀请了5个人，为什么没有那么多奖励呢？</li>
                    <li>答：邀请注册了不算哦，必须是注册并且有在平台下单，且返利成功才算哦</li>
                </ul>
            </div>
        </div>
        <Footer/>
    </div>
</template>
<script type="text/javascript" src="https://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
<script>
import Footer from '../components/footer.vue'
import Top from '../components/top/homeTop.vue'
import {mapState,mapActions} from "vuex"
import axios from "axios"
import {Toast} from "vant"
export default {
    components:{
        Footer,
        Top
    },
    data(){
        return{
            config:{
                url                 : '', // 网址，默认使用 
                source              : '', // 来源（QQ空间会用到）, 默认读取head标签：<meta name="site" content="http://overtrue" />
                title               : '返利兔', // 标题，默认读取 document.title 或者 <meta name="title" content="share.js" />
                description         : '来和我一起返利吧', // 描述, 默认读取head标签：<meta name="description" content="PHP弱类型的实现原理分析" />
                // image               : '', // 图片, 默认取网页中第一个img标签
                sites               : [ 'qq', 'wechat','weibo','qzone'], // 启用的站点
                wechatQrcodeTitle   : '微信扫一扫：分享', // 微信二维码提示文字
                wechatQrcodeHelper  : '<p>微信里点“发现”，扫一下</p><p>二维码便可将本文分享至朋友圈。</p>'
            },
            inv:false,//是否生成邀请码
            invInfo:[],//邀请信息
            rankList:[],//邀请排行榜
        }
    },
    computed:{
        ...mapState(["url","http","imgHeader"])
    },
    created(){
        this.isLogin()
        Toast.loading("拼命加载")
         axios.post(this.url+"/activity/invitation").then(res=>{
             if(res.data.status=="1000"){
                this.invInfo = res.data.data.invite
                this.rankList = res.data.data.list.slice(0,9)
                let inv = window.location.host+"/#/register?in="+res.data.data.invent_code //附上邀请码
                this.config.url = inv
                this.inv= true; 
                Toast.clear();
             }
            
        }).catch(err=>{
           Toast.fail("加载错误:"+err)
        })
    },
    mounted(){
        document.documentElement.scrollTop = 0 ;
        document.body.scrollTop = 0;
    },
    methods:{
        ...mapActions(["isLogin"]),
    },
    filters:{
        phone:(val)=>{ //电话号码隐藏
            let tel = val.substring(0,3)+"****"+val.substring(7,11)
            return tel
        }
    }
   
    
}
</script>
<style lang="scss">
.invia{
    background: #ffe029;
    margin-bottom: 1rem !important;
    .banner{
        width: 100%;
    }
    .main{
        padding-bottom: .3rem;
        .tip{
            padding: .12rem;
            background: white;
            margin: .12rem;
            border-radius: .2rem;
            p{
                display: flex;
                justify-content: space-between;
                padding-bottom: .1rem;
                &:nth-child(3){
                    display: block;
                }
                .red{
                    color: red;
                }
            }

        }
         img{
            margin: auto;
            width: 96%;
            margin-top: .1rem;
        }  
        .share{
            position: relative;
            .social-share{
                position: absolute;
                width: 100%;
                top: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                
            }
            .share_tip{
                position: absolute;
                top: 30%;
                left: .4rem;
            }
            // ul{
            //     position: absolute;
            //     width: 100%;
            //     top: 46%;
            //     display: flex;
            //     img{
            //         width: .9rem;
            //     }
            //     li{
            //         width: 25%;
            //         text-align: center;
            //         p{
            //             padding: .2rem 0;
            //         }
            //     }
            // }
        }
        .rules{
            position: relative;
            ul{
                position: absolute;
                top: 1rem;
                padding: .1rem .4rem;
                li{
                    line-height: .42rem;
                    background: url('../assets/images/invitation/num_03.png') no-repeat;
                    background-size: .28rem;
                    background-position: 0rem 0.05rem;
                    padding-left: .35rem;
                }
              
            }
        }
        .rank{
            position: relative;
            table{
                position: absolute;
                width: 90%;
                top: 1rem;
                left: .34rem;
                tr{
                    td{
                        width: 25%;
                        text-align: center;
                        height: .48rem;
                        line-height: .48rem;
                        font-size: .22rem;
                        border-top: 1px solid #ddd;
                       
                    }
                     &:first-child{
                         td{
                            border-bottom: 1px solid yellowgreen;
                            border-top: none;
                         }
                        
                    }
                    
                }
            }
        } 
        .ques{
            position: relative;
            ul{
                position:absolute;
                top: 1rem;
                left: .2rem;
                li{
                    padding: 0 .2rem;
                    line-height: .4rem;
                }
            }
        }
    }
   
}

</style>
