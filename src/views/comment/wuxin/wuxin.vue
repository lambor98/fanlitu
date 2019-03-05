<template>
    <div class="wuxin sonBox">
        <ul> 
            <li v-if="info.is_bohui">  <!--自定义属性，若请求被驳回则不存在-->
                <p class="title">评价驳回理由</p>
                <p class="reason">{{info.rejected_mark}}</p>
            </li>
            <li>
                <p class="title">第一步:该返利商品为五星文字好评活动</p>
                <textarea v-model="txt" placeholder="亲，请撰写返利商品的评价，评价内容要求至少15个字以上，商家会对评价进行评分，优质评价将提升您今后的中奖率"></textarea>
                <p class="red">此活动不需要晒图评价，淘宝评价禁止晒图</p>
            </li>
        </ul>
        <dl>
            <dt>温馨提示</dt>
            <dd>1.请按照好评要求进行评价，<span class="red">请勿直接前去淘宝评价</span>，好评必须商家审核通过后才可以复制到淘宝/天猫，否则将拉低中奖率</dd>
            <dd>2.收到好评之后，商家将在<span class="red">48</span>小时内确认评价，之后系统返款，请耐性等待，<span class="red">严禁到旺旺上催促商家审核评价</span>，否则将导致账号被封</dd>
        </dl>
        <p class="btn" @click="submit">提交评价</p>
    </div>
</template>
<script>
import axios from "axios"
import {mapState} from "vuex"
import {Toast} from "vant"
export default {
    props:["info"],
    data(){
        return{
            txt:null, //评论
            oId:null, //订单Id
            flag:false, //验证输入
        }
    },
    methods:{
        check(){  //检验输入
            if(this.txt){
                if(this.txt.length<15){
                    this.flag=false
                }else{
                    this.flag = true
                }
            }else{
                this.flag=false
            }
        },
        submit(){ //提交审核
            this.check()
            let path = !this.info.is_bohui?"submitFiveStar":"submitReFiveStar";   //判断是第一次提交还是驳回提交
            if(this.flag){
                axios.post(this.url+"/comment/"+path,{order_id:this.oId,content:this.txt}).then(res=>{
                    if(res.data.status=="1000"){
                        Toast.success("评价成功")
                        this.$router.replace({name:'commentdone'})
                    }else{
                        Toast.fail(res.data.msg)
                    }
                }).catch(err=>{
                    Toast.fail("加载错误:"+err)
                })
            }else{
                Toast.fail("请输入至少15个字")
            }
           
        }
    },
    computed:{
        ...mapState(["url"])
    },
    mounted(){
        this.oId = this.$route.query.oId;
    },
    watch:{
        info(val){
            this.txt = val.comment;
        }
    }

  
    
}
</script>