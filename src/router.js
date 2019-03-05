import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import AllGoods from "./views/AllGoods.vue"
import Invitation from "./views/Invitation.vue"
import User from "./views/User.vue"
import Login from "./views/login&register/Login.vue"
import QucikLogin from "./views/login&register/QuickLogin.vue"
import Register from "./views/login&register/Register.vue"
import FindPwd from "./views/login&register/FindPwd.vue"
import userinfo from "./views/userCenter/userinfo/userinfo.vue"
import userAddress from "./views/userCenter/userinfo/userAddress.vue"
import changeQQ from "./views/userCenter/userinfo/changeQQ.vue"
import changeTel from "./views/userCenter/userinfo/changeTel.vue"
import security from "./views/userCenter/userinfo/security.vue"
import userCenter from "./views/userCenter/userCenter.vue"
import securityCenter from "./views/userCenter/security/main.vue"
import bindCard from "./views/userCenter/security/bindCard.vue"
import bindTaobao from "./views/userCenter/security/bindTaobao.vue"
import setCashPwd from "./views/userCenter/security/setCashPwd.vue"
import setLoginPwd from "./views/userCenter/security/setLoginPwd.vue"
import moneyDetail from "./views/userCenter/moneyDetail/moneyDetail.vue"
import snaUp from "./views/snapUp/main.vue"
import goodDetail from "./views/snapUp/goodDetail.vue"
import done from "./views/snapUp/done.vue"
import going from "./views/snapUp/going.vue"
import invite from "./views/userCenter/invitation/invite.vue"
import payback from "./views/userCenter/payback/payback.vue"
import wuxin from "./views/comment/wuxin/wuxin.vue"
import copyWuxin from "./views/comment/wuxin/copyWuxin.vue"
import pic from "./views/comment/pic/pic.vue"
import copyPic from "./views/comment/pic/copyPic.vue"
import keywords from "./views/comment/keywords/keywords.vue"
import copyKey from "./views/comment/keywords/copyKey.vue"
import comment from "./views/comment/index.vue"
import commentDone from "./views/comment/done.vue"
import help from "./views/userCenter/help/help.vue"
import contact from "./views/contact/index.vue"
Vue.use(Router)

const router = new Router({
  mode:"hash",
  routes: [
    {path:"/",redirect:"home"},
    {
      path: '/home',     //首页
      name: 'home',
      component: Home,

    },
    {
      path:"/AllGoods", //全部订单
      name:"allgoods",
      component:AllGoods
    },
    {
      path:"/Invitation", //邀请好友
      name:"invitation",
      component:Invitation
    },
    {
      path:"/user",
      name:"user",
      component:User,
    },
    {
      path:"/Login", //登录
      name:"login",
      component:Login,
    },
    {
      path:"/quicklogin", //快捷登录
      name:"quicklogin",
      component:QucikLogin
    },
    {
      path:"/register", //注册
      name:"register",
      component:Register
    },
    {
      path:"/findPwd",  //找回密码
      name:"findpwd",
      component:FindPwd
    },
    {
      path:"/userCenter", //个人信息
      name:"userCenter",
      component:userCenter,
      redirect:"userCenter/userinfo",
      children:[
        {
          path:"/userCenter/userinfo",
          name:"userinfo",
          component:userinfo
        },
        {
          path:"/userCenter/useraddress",
          name:"useraddress",
          component:userAddress
        },
        {
          path:"/userCenter/changeqq",
          name:"changeqq",
          component:changeQQ
        },
        {
          path:"/userCenter/changetel",
          name:"changetel",
          component:changeTel
        },
        {
          path:"/userCenter/security",
          name:"security",
          component:security,
        },
        {
          path:"/userCenter/bind", //账号安全
          name:"bind",
          component:securityCenter,
          children:[
            {path:"/userCenter/bind/bindCard",name:"bindCard",component:bindCard},
            {path:"/userCenter/bind/bindTaobao",name:"bindTaobao",component:bindTaobao},
            {path:"/userCenter/bind/setCashPwd",name:"setCashPwd",component:setCashPwd},
            {path:"/userCenter/bind/setLoginPwd",name:"setLoginPwd",component:setLoginPwd},
          ]
        },
        {
          path:"/userCenter/moneyDetail",   //资金详情
          name:"moneyDetail",
          component:moneyDetail
        },{
          path:"/userCenter/invite",    //邀请详情
          name:"invite",
          component:invite
        },{
          path:"/userCenter/payback",   //返利详情
          name:"payback",
          component:payback
        },
        {
          path:'/userCenter/help', //帮助中心
          name:'help',
          component:help
        }
      ]
    },
    {
      path:"/snapup",   //抢购页面
      name:"snapup",
      component:snaUp,
      redirect:"home",
      children:[
        {path:"/snapup/gooddetail",name:"gooddetail",component:goodDetail, //抢购页面物品详细
          meta:{
            keepAlive:true
          }}, 
        {path:"/snapup/done",name:"done",component:done},   //抢购成功
        {path:"/snapup/going",name:"going",component:going}, //抢购进行中
      ]
    },
    {
      path:"/comment",
      name:"comment",
      component:comment,
      children:[
        {path:"/comment/wuxin",name:"wuxin",component:wuxin},//五星评价
        {path:"/comment/copywuxin",name:"copywuxin",component:copyWuxin},//复制五星评价
        {path:"/comment/pic",name:"pic",component:pic}, //图文评价
        {path:"/comment/copypic",name:"copypic",component:copyPic},  //复制图文评价
        {path:"/comment/keywords",name:"keywords",component:keywords},//关键词好评
        {path:"/comment/copyKey",name:"copykey",component:copyKey},   //复制关键词好评
      ]
    },
    {path:"/commentDone",name:"commentdone",component:commentDone} , //评论完成后
    {path:"/contact",name:'contact',component:contact},
  ],

})


export default router
