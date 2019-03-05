<template>
    <div class="comment box">
        <Top title="评价商品"/>
        <div class="goods">
            <img :src="good.master_pic_id?imgHeader+good.master_pic_id:'http://iph.href.lu/109x114'" alt="">
            <div class="goods-right">
                <p>商品名：{{good.goods_name}}</p>
                <p>店铺名：{{good.store_name}}</p>
                <p>到手价：￥{{good.get_price}}</p>
                <!-- <p>规格：任意规格</p> -->
                <p>下单数量:{{good.nun?good.num:1}}份</p>
            </div>
        </div>
        <div class="ban_reason">

        </div>
        <router-view :info="other_info"></router-view>
    </div>
</template>
<script>
import Top from "../../components/top/normalTop"
import "./common.scss"
import axios from "axios"
import {mapState,mapActions} from "vuex"
import {Toast} from "vant"
export default {
    components:{
        Top
    },
    data(){
        return{
            good:{},
            oId:null,
            typeList:["getFiveStar","getPicTxtEval","getKeyEval"],
            wornList:["getReFiveStar","getRePicEval","getReKeyEval"],
            copyList:["getFiveStarCopy","getCopypicEval","getCopyKeyEval"],
            other_info:{   //默认传入子组件的info
                comment:null,
                rejected_mark:null,
                reject:true,     //自己加的状态，如果评价被驳回则该属性消失.
            },
        }
    },
    computed:{
        ...mapState(["url","imgHeader"])
    },
    mounted(){
        this.isLogin();
        this.oId = this.$route.query.oId;
        let type = this.$route.query.type;
        axios.post(this.url+"/comment/"+this.copyList[type],{order_id:this.oId}).then(res=>{   //判断是否是复制评价
            if(res.data.status=="1000"){
                this.other_info = res.data.data
                this.good = res.data.data.goods_info;
            }else{
                 axios.post(this.url+"/comment/"+this.wornList[type],{order_id:this.oId}).then(res=>{ //判断是否是驳回评价
                    if(res.data.status=="1000"){
                        this.other_info = res.data.data
                        this.good = res.data.data.goods_info;
                    }else{
                        axios.post(this.url+"/comment/"+this.typeList[type],{order_id:this.oId}).then((res)=>{
                            if(res.data.status=="1000"){
                                this.good = res.data.data.goods_info
                                this.other_info = res.data.data
                            }else{
                                Toast.fail(res.data.msg)
                            }    
                        }).catch(err=>{
                            Toast.fail(err+"加载出错，请刷新或者联系管理员")
                        })
                    }
                }).catch(err=>{
                    Toast.fail(err+"加载出错，请刷新或者联系管理员")
                })
            }
        }).catch(err=>{
            Toast.fail(err+"加载出错，请刷新或者联系管理员")
        })
       
        
    },
    methods:{
        ...mapActions(["isLogin"])
    }
}
</script>