<template>
  <div class="home box">
    
    <Top title="返利兔"/>
    <div class="banner">
      <mt-swipe :auto="4000">
        <mt-swipe-item v-for="(item,index) in banner" :key="index">
            <img :src="item" alt="">
        </mt-swipe-item>
      </mt-swipe>
    </div>
   
     <div class="tab">
          <div class="nav">
          <van-tabs v-model="active" ref="nav">
              <van-tab v-for="(item,index) in navList" :title="item.time+'/'+item.desc" :key="index">
              </van-tab>
          </van-tabs>
          </div>
        <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :offset=offset
        @load="onLoad"
        >
          <div class="tab-content">
          <div class="today-tab tab-box" v-if="active<=nowTime" v-show="todayList.length>0" >   <!--今日推荐-->
              <div class="content-title">
                  <p>
                  今日推荐
                  <span class="tab-line"></span>
                  </p>
              </div>
              <ul class="content-main" v-for="(item,index) in todayList" :key="index">
                  <li class="animated flipInX">
                  <div class="content-left">
                      <img :src="imgHeader+item.master_pic_id" alt="">
                  </div>
                  <div class="content-right">
                      <div class="right-title">
                      <img  :src="require('../assets/images/home/taobao.png')" v-if="item.paltform==100" alt="">
                      <img :src="require('../assets/images/home/mall.png')" v-if="item.paltform==101">
                      <p>
                          {{item.goods_name }}
                      </p>
                      </div>
                      <div class="right-mid">
                          <div class="proess">                                                                     <!--返利名额进度条-->
                          <div class="tiao" :style="'width:'+(item.tou_num-item.used_num)/item.tou_num*100+'%'">
                          </div>
                          <p>还剩{{item.tou_num-item.used_num}}个返利名额</p> 
                          </div>
                      </div>
                      <div class="right-bottom">
                      <div class="right-bottom-left">
                          <del>￥{{item.goods_price}}</del>
                          <p>下单价：￥{{item.goods_price}}(可返{{item.fanli_gold}}金币)</p>
                          <p>到手价：<span class="red">￥{{item.goods_price-item.fanli_gold}}</span></p>
                      </div>
                      <div class="right-bottom-right">
                          <span class="btn no" v-if="(item.tou_num-item.used_num==0)">已抢完</span>
                          <span class="btn yes" v-if="(item.tou_num-item.used_num>0)" @click="goSnapUp" :data-id="item.id" :tp-id="item.trade_plan_id">马上抢</span>
                      </div>
                      </div>
                  </div>
                  </li>
              </ul>
              
          </div>
          <div class="now-tab tab-box"  v-if="active<=nowTime" v-show="nowList.length>0">   <!--正在进行-->
              <div class="content-title">
                  <p>
                  正在进行
                  <span class="tab-line"></span>
                  </p>
              </div>
              <ul class="content-main" v-for="(item,index) in nowList" :key="index">
                  <li class="animated flipInX">
                  <div class="content-left">
                      <img :src="imgHeader+item.master_pic_id" alt="">
                  </div>
                  <div class="content-right">
                      <div class="right-title">
                      <img :src="require('../assets/images/home/taobao.png')" v-if="item.paltform==100" alt="">
                      <img :src="require('../assets/images/home/mall.png')" v-if="item.paltform==101">
                      <p>
                          {{item.goods_name }}
                      </p>
                      </div>
                      <div class="right-mid">
                      <div class="proess">                                                                     <!--返利名额进度条-->
                          <div class="tiao" :style="'width:'+(item.tou_num-item.used_num)/item.tou_num*100+'%'">
                          </div>
                          <p>还剩{{item.tou_num-item.used_num}}个返利名额</p> 
                          </div>
                      </div>
                      <div class="right-bottom">
                      <div class="right-bottom-left">
                          <del>￥{{item.goods_price}}</del>
                          <p>下单价：￥{{item.goods_price}}(可返{{item.fanli_gold}}金币)</p>
                          <p>到手价：<span class="red">￥{{item.goods_price-item.fanli_gold}}</span></p>
                      </div>
                      <div class="right-bottom-right">
                          <span class="btn no" v-if="(item.tou_num-item.used_num==0)">已抢完</span>
                          <span class="btn yes" v-if="(item.tou_num-item.used_num>0)" @click="goSnapUp" :data-id="item.id" :tp-id="item.trade_plan_id">马上抢</span>
                      </div>
                      </div>
                  </div>
                  </li>
              </ul>
              
          </div>
          <div class="last-tab tab-box" v-if="active<=nowTime" v-show="beforeList.length>0">   <!--往期商品-->
              <div class="content-title">
                  <p>
                  往期商品
                  <span class="tab-line"></span>
                  </p>
              </div>
              <ul class="content-main" v-for="(item,index) in beforeList" :key="index">
                  <li class="animated flipInX">
                  <div class="content-left">
                      <img :src="imgHeader+item.master_pic_id" alt="">
                  </div>
                  <div class="content-right">
                      <div class="right-title">
                      <img :src="require('../assets/images/home/taobao.png')" v-if="item.paltform==100" alt="">
                      <img :src="require('../assets/images/home/mall.png')" v-if="item.paltform==101">
                      <p>
                          {{item.goods_name }}
                      </p>
                      </div>
                      <div class="right-mid">
                      <div class="proess">                                                                     <!--返利名额进度条-->
                          <div class="tiao" :style="'width:'+(item.tou_num-item.used_num)/item.tou_num*100+'%'">
                          </div>
                          <p>还剩{{item.tou_num-item.used_num}}个返利名额</p> 
                          </div>
                      </div>
                      <div class="right-bottom">
                      <div class="right-bottom-left">
                          <del>￥{{item.goods_price}}</del>
                          <p>下单价：￥{{item.goods_price}}(可返{{item.fanli_gold}}金币)</p>
                          <p>到手价：<span class="red">￥{{item.goods_price-item.fanli_gold}}</span></p>
                      </div>
                      <div class="right-bottom-right">
                          <span class="btn no">已结束</span>
                          <!-- <span class="btn yes" v-if="(item.tou_num-item.used_num>0)" @click="goSnapUp" :data-id="item.id" :tp-id="item.trade_plan_id">马上抢</span> -->
                      </div>
                      </div>
                  </div>
                  </li>
              </ul>
          </div>
          <div class="rightaway-tab tab-box" v-if="active>nowTime&&rightAway.length>0">   <!--即将开抢-->
              <div class="content-title">
                  <p>
                  即将开抢
                  <span class="tab-line"></span>
                  </p>
              </div>
              <ul class="content-main" v-for="(item,index) in rightAway" :key="index">
                  <li class="animated flipInX">
                  <div class="content-left">
                      <img :src="imgHeader+item.master_pic_id" alt="">
                  </div>
                  <div class="content-right">
                      <div class="right-title">
                      <img :src="require('../assets/images/home/taobao.png')" v-if="item.paltform==100" alt="">
                      <img :src="require('../assets/images/home/mall.png')" v-if="item.paltform==101">
                      <p>
                          {{item.goods_name }}
                      </p>
                      </div>
                      <div class="right-mid">
                          <div class="proess">                                                                     <!--返利名额进度条-->
                          <div class="tiao" :style="'width:'+(item.tou_num-item.used_num)/item.tou_num*100+'%'">
                          </div>
                          <p>还剩{{item.tou_num-item.used_num}}个返利名额</p> 
                          </div>
                      </div>
                      <div class="right-bottom">
                      <div class="right-bottom-left">
                          <del>￥{{item.goods_price}}</del>
                          <p>下单价：￥{{item.goods_price}}(可返{{item.fanli_gold}}金币)</p>
                          <p>到手价：<span class="red">￥{{item.goods_price-item.fanli_gold}}</span></p>
                      </div>
                      <div class="right-bottom-right">
                          <span class="btn no">即将开抢</span>
                      </div>
                      </div>
                  </div>
                  </li>
              </ul>
              
          </div>
          </div>
        </van-list>
      </div>
    
  
    <div class="nogoods" v-if="todayList.length==0&&nowList.length==0&&beforeList.length==0&&rightAway.length==0">
        <img :src="require('../assets/images/user/none.png')" alt="">
        <p>暂时没有商品呢</p>
    </div>
    <Footer/>
  </div>
</template>

<script>
 /* eslint-disable */
  import Footer from '../components/footer.vue'
  import Top from '../components/top/homeTop.vue'
  import {mapActions,mapState} from "vuex";
  import axios from "axios";
  import "../style/Home.scss"
  import {Toast,List,Notify} from "vant"
import { resolve, reject } from 'q';
//   import async from "async"
  export default {
    data(){
      return{
        banner:[],     //轮播图
        navList:null,  //导航栏状态
        active:"0",    //当前触发时段
        updateDom:0,   //改变dom次数，updateMenu（）
        todayList:[],  //今日推荐
        nowList:[],    //正在进行
        beforeList:[], //往期商品
        rightAway:[], //即将开抢列表
        nowTime:null, //当前时间
        timer:null,   //定时器
        page:1,       //当前页数
        good_place:1, //商品种类(今日推荐，正在进行，往期商品)
        loading: false, //是否处在加载中
        finished: true, //是否可以刷新，true不可，false可以
        offset:300, //刷新距离
      }
    },
    components: {
      Footer,
      Top,
    },
    methods:{
      ...mapActions(['getBanner']),
      onLoad() {
          if(!this.finished){
             this.shopping()
          }
        },
      getAlltime(){
        //获取当前抢购状态
          axios.post(this.url+"/index/AllTimes").then(res=>{ 
            if(res.data.status=="1000"){
               this.navList = res.data.data.list
              axios.post(this.url+"/general/getNowHour").then(res=>{ //获取当前时间
                      this.active = res.data.data.hour
                      this.nowTime = res.data.data.hour
               })
            }
          }).catch(err=>{
              Toast.fail("加载错误:"+err)
          })
      },
      setTime(){
        let p = new Promise((resolve,reject)=>{
             axios.post(this.url+"/general/getNowHour").then(res=>{ //获取当前时间
                      this.active = res.data.data.hour
                      this.nowTime = res.data.data.hour
            })
        })
      },
      getBanner(){
        //获取轮播图
       axios.post(this.url+"/index/banner").then(res=>{
            if(res.data.status=="1000"){
                let newList = res.data.data.list
                for(let i =0;i<newList.length;i++){
                    newList[i]= this.imgHeader + newList[i]
                } 
                this.banner = newList;
            }
        }).catch(err=>{
              Toast.fail("加载错误:"+err)
        })
      },
      updateMenu(){
          //修改首页选项卡，只执行一次
          if(this.updateDom==1){
          }else{
              this.updateDom = 1; //执行次数
              let nav = document.getElementsByClassName("van-ellipsis")
              for(let i =0 ;i<nav.length;i++){
              let newNav = nav[i].innerHTML.split("/") 
              nav[i].innerHTML=`<p>${newNav[0]}</p><p>${newNav[1]}</p>` 
              }
              //滚动条滚动至抢购中心
              // let dad = document.getElementsByClassName("van-tabs__nav")[0];
              // if(this.active<2){
              //     dad.scrollLeft = 0 ; 
              // }else if(this.active>22){
              //     dad.scrollLeft =1688
              // }else{
              //     dad.scrollLeft=79*(this.active-2)+19; 
              // }

          }
      },
      goSnapUp(e){ //
        let id=e.target.getAttribute("data-id")
        let tId=e.target.getAttribute("tp-id")
        this.$router.push({name:"gooddetail",query:{id,tId}})
      },
      shopping(){
          let type = {'1':"todayList",'0':'nowList','-1':'beforeList'}
          axios.post(this.url+"/index/task_list",{query_code:(this.active*1+1),Page:this.page,pageSize:4 ,good_place:this.good_place}).then(res=>{
              if(res.data.status=="1000"){
                let list =res.data.data.list;
                if(list.length==0 || list.length<4){ //如果请求到的列表等于0
                    if(this.active>this.nowTime){  //判断触发的tab是不是大于当前时间，如果大于，就成为“即将抢购”
                        this.rightAway = this.good_place!=-1?[...this.rightAway,...list]:this.rightAway
                    }else{
                        this[type[this.good_place]]=[...this[type[this.good_place]],...list];
                    }
                    this.finished = false; //可以开始刷新（主要为防止下拉刷新同时发出）
                    if(this.good_place==-1){ //判断是否是最后一类（往期商品）如果是就结束
                        Notify('没有更多了');
                        this.finished = true; //出现无更多提示
                    }else{
                        let num = this.good_place
                        this.page=1;
                        this.good_place=num-1;
                    }
                }else{
                    this.page++
                    if(this.active>this.nowTime){  //判断触发的tab是不是大于当前时间，如果大于，就成为“即将抢购”
                        this.rightAway = this.good_place!=-1?[...this.rightAway,...list]:this.rightAway
                    }else{
                        this[type[this.good_place]]=[...this[type[this.good_place]],...list];
                    }
                    this.finished = false;//可以开始刷新（主要为防止下拉刷新同时发出）
                }
                this.loading = false;  //刷新结束
              }
          }).catch(err=>{
              Toast.fail("加载错误:"+err)
          })
      },
    },
    created(){
      this.getBanner()
      this.getAlltime()
    },
    mounted(){
      this.updateDom = 0;
      if(sessionStorage.keep=='true' && sessionStorage.item){
        console.log("成功")
        let list = JSON.parse(sessionStorage.item)
        this.finished = list.finished;      
        this.todayList = list.today;
        this.nowList = list.now;
        this.beforeList = list.before;
        this.page = list.page;
        this.good_place = list.good_place;
        document.documentElement.scrollTop = list.scrollTop;
        document.body.scrollTop = list.scrollTop;
      }else if(sessionStorage.keep=='true' && !sessionStorage.item){
        this.shopping();  //解决详情分享出去后回主页无法刷新
      }
      
    },
    computed:{
      ...mapState(["url","imgHeader"])
    },
    updated(){
      let dom = document.getElementsByClassName("van-ellipsis")[1];
      if(dom){
        if(dom.childNodes.length!=2){
            this.updateMenu();
          }
      }
    },
    watch:{
        active(val,old){
          if(val!=old){
            if(sessionStorage.keep=="true"){
                sessionStorage.setItem('keep','false')
            }else{
                this.finished = true;
                this.todayList=[];
                this.rightAway=[];
                this.nowList=[];
                this.beforeList=[];
                this.page=1
                this.good_place=1
                this.shopping()
            }
          }
        },
    },
    beforeRouteLeave (to, from, next) { 
      sessionStorage.setItem("keep",false)
      if(to.name=="gooddetail"){
        let scrollTop =  document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop;
        let list = {scrollTop,'today':this.todayList,'now':this.nowList,'before':this.beforeList,'page':this.page,'good_place':this.good_place,finished:this.finished};
        let item = JSON.stringify(list)
        sessionStorage.setItem('item',item)
      }
      next();
    },
    beforeRouteEnter (to, from, next) {
      if(from.name=="gooddetail" || from.name == "done" || from.name == "going"){
        sessionStorage.setItem("keep",true)
      }else{
        sessionStorage.clear()
      }
      next()
    } 
  }
</script>


