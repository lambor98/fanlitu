import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios"
import { Dialog, Toast } from "vant"
import router from '../router'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    randomCode: "", //验证码初始图片
    userinfo: {},  //用户信息
    url: "/h5",   //请求匹配
    imgHeader: "http://image.fl.cn/",  //图片开头
    userState: { //首页用户所有状态
      had_wit: null,
      invite_statis: {
        all_invite: 0,
        all_reward: 0,
        fanli: 0,
        friends_ordered: 0,
        frinds_order_all: 0,
        this_month_invite: 0,
        this_month_reward: 0,
        today_gold: 0,
        today_invite: 0,
      },
      minfo: null,
      msgnums: null,
      pro: {},
      returned: null,
      w_money: null,
      wait_return: null,
    },
    userSecure: {},  //用户安全页面状态
    isBind: false,  //是否绑定淘宝号
    isCardBind: false, //是否绑定银行卡
    cancelReason: [], //取消原因
    http: "", //当前地址

  },
  mutations: {
    randomCode(state, data) {     //获取随即验证码
      let id = Math.ceil(Math.random() * 1000)
      // let path =data.split("/")[3]
      // let img = this.state.url+"/"+path
      state.randomCode = data + "?rand=" + id
    },
    userinfo(state, data) {       //用户个人信息
      if (data) {
        data.avatar = state.imgHeader + data.avatar
      }
      state.userinfo = data
    },
    userCenter(state, data) {      //用户个人中心
      state.userState = data
    },
    userSecure(state, data) {     //用户安全状态
      state.userSecure = data
      if (data.buyer_status == "审核中") {
        state.isBind = true;
      }
      if (data.card_status == "审核中") {
        state.isCardBind = true
      }
    },
    cancelReason(state, data) {    //获取取消原因
      state.cancelReason = data
    },
    resize(state, data) {
      state.Height = data;
      window.onresize = (() => {
        let nowHeigth = document.documentElement.clientHeight;
        let footer = document.getElementsByClassName("submit_btn")[0];
        if (nowHeigth < state.Height) {
          footer.style.position = "static"
        } else {
          footer.style.position = "fixed"
        }
      })
    }


  },
  actions: {
    getRandomCode({ commit }) {
      Toast.loading({
        message: "加载中..."
      })
      axios.post(this.state.url + "/general/getImgCode").then(res => {
        Toast.clear()
        commit("randomCode", res.data.data.url)
      }).catch(err => {
        Toast.fail("图形验证加载错误:" + err)
      })
    },
    getUserinfo({ commit }) {            //用户个人信息
      Toast.loading({
        message: "加载中..."
      })
      axios.post(this.state.url + "/bind_info/myinfo").then((res) => {
        Toast.clear()
        if (res.data.status == "1000") {
          commit("userinfo", res.data.data)
        } else {
          Toast.fail(res.data.msg)
        }
      }).catch(err => {
        Toast.fail("加载错误:" + err)
      })
    },
    isLogin() { //判断是否登录
      Toast.loading({
        message: "加载中..."
      })
      axios.post(this.state.url + "/base/checkIsLogin").then(res => {
        if (res.data.status == "1002") {
          Dialog.confirm({
            title: '提示',
            message: '您还未登录,是否前去登录？'
          }).then(() => {
            router.replace({ name: "login" })
          }).catch(() => {
            router.go(-1)
          });
        }
        Toast.clear();
      }).catch(err => {
        Toast.fail("加载错误" + err)
      })
    },
    getUserCenter({ commit }) {    //用户个人中心信息
      axios.post(this.state.url + "/center/index").then(res => {
        if (res.data.status == "1000") {
          commit("userCenter", res.data.data)
        }
      }).catch(err => {
        Toast.fail("加载失败:" + err)
      })
    },
    getSecure({ commit }) {        //用户安全状态
      axios.post(this.state.url + "/bind_info/secure").then(res => {
        if (res.data.status == "1000") {
          commit("userSecure", res.data.data)
        }
      }).catch(err => {
        Toast.fail("加载失败:" + err)
      })
    },
    getReason({ commit }) {      //获取取消原因
      axios.post(this.state.url + "/order/get_reason").then(res => {
        if (res.data.status == "1000") {
          commit("cancelReason", res.data.data.cancel_reason)
        }
      }).catch(err => {
        Toast.fail("加载失败:" + err)
      })
    },
    resizeWindow({ commit }) {
      commit("resize", document.documentElement.clientHeight)
    }



  }
})
