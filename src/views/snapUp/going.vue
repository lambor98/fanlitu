<template>
    <div class="going box">
        <Top title="抢购"/>
        <van-notice-bar
        text="申请必中试用申请，100%获得中奖机会! 申请必中试用申请,100%获得中奖机会!"
        />
        <div class="goods">
            <img :src="good.master_pic_id?imgHeader+good.master_pic_id:'http://iph.href.lu/200x200'" alt="">
            <div class="goods-right">
                <p>商品名：{{good.goods_name}}</p>
                <p>店铺名：{{good.store_name}}</p>
                <p>到手价：￥{{good.get_price}}</p>
                <!-- <p>规格：任意规格</p> -->
                <p>下单数量:1份</p>
            </div>
            <div class="cancel" @click="show =true">
               放弃订单
            </div>
        </div>
        <div class="worn">
            <p>
                <span>警告：</span>
                严禁直接输入商品价格和店铺全称搜索商品，一经发现将永久取消中奖资格
            </p>
        </div>
        <div class="order-step">
            <div class="title">
                下单流程
            </div>
            <ul class="step">
                <li>
                   <p>打开手机淘宝APP，按照以下步骤操作</p> 
                    <span>
                        搜索试用商品：{{good.goods_name}}
                    </span>
                </li>
                <li>
                    筛选条件
                    <span>排序方式：{{goodType.sort}}</span>
                    <span>折扣和服务：{{goodType.service | service}}</span>
                    <span>价格区间:{{goodType.price}}</span>
                    <span>发货地：{{goodType.addr}}</span>
                    <span>商品类目：{{goodType.class}}</span>
                </li>
                <li>
                    <p>核对商品:请提交购买商品淘口令<span class="blue">如何复制淘宝口令</span></p>
                    <span>
                        <span>1.点击输入框</span>
                        <span>2.长按</span>
                        <span>3.粘贴</span>
                    </span>
                    <span class="red">
                        将手机淘宝升级至最新版，提交最新版本口令
                    </span>
                    <span class="blue">如何升级手机淘宝版本</span>
                </li>
            </ul>
            <van-cell-group>
                <van-field
                v-model="taoKey"
                center
                clearable
                label="输入淘口令"
                placeholder="请输入淘口令"
                >
                 <van-button slot="button" size="small" :type="btnType" @click="checkKey">{{btnTxt}}</van-button>   
                </van-field>
            
                <van-field label="输入订单号" v-model='orderNum' placeholder="请输入订单号" />
                <van-field label="输入付款价格" v-model="price" placeholder="请输入价格" />
                <van-cell title="上传截图信息" value="查看示例图" is-link />
                <div class="pic-box">
                    <img :src="path" alt="" @click="openFile">
                    <p>订单截图</p>
                    <input accept="image/*" name="img" id="imgFile" type="file" @change="upload" v-show="1>2">
                </div>
                <van-button  type="danger" size="large" class="btn submit_btn" @click="submit">提交订单</van-button>
            </van-cell-group>
        </div>
        <van-dialog  
        v-model="show"
        show-cancel-button
        @confirm="giveUp"
        title="放弃原因"
        >
            <span class="tip">告诉我们您的放弃原因，我们将继续改进与提升</span>
            <van-radio-group v-model="radio">
                <van-radio :name="item.id" v-for="(item,index) in cancelReason" :key="index">{{item.reason_name}}</van-radio>
            </van-radio-group>
            <input type="text" v-model="otherReason" class="dialog-input">
        </van-dialog>
        
    </div>
</template>
<script>
import Top from "../../components/top/normalTop.vue"
import "../../style/snapup/going.scss"
import { getObjectURL } from "../../tool/upload.js"
import axios from "axios"
import {mapState,mapActions} from "vuex"
import {Toast} from "vant"
import lrz from "lrz"
export default {
    data(){
        return{
            path:require('../../assets/images/user/img1.png'),  //截图路径
            dataUrl:null,  //base64图片
            imgName:null,  //返回的图片地址
            show:false,    //放弃列表
            result:[],  //放弃原因
            good:{},    //商品信息
            goodType:{}, //商品种类
            taoKey:null, //淘宝口令
            orderId:null,     //订单id
            tradeId:null,      //主任务id
            btnType:"warning", //淘宝口令按钮颜色
            btnTxt:"点击验证",  //淘宝口令按钮文字
            orderNum:null,     //订单号
            price:null,        //订单价格
            radio:null,        //放弃单选框值
            otherReason:null, //取消原因
            repay:false,  //是否是重新支付,
            Height:0 //浏览器初始前高度
        }
    },
    components:{
        Top
    },
    methods:{
        ...mapActions(["getReason","resizeWindow"]),
        openFile(){ //打开文件选择
            document.getElementById("imgFile").click();
        },
        upload(e){ //上传截图
            let file = e.currentTarget.files[0];
            this.path = getObjectURL(file)
            lrz(file,{width:600}).then(rts=>{
                this.dataUrl = rts.base64;
                 axios.post(this.url+"/center/upload",{baseImage:this.dataUrl,scenario:2}).then(res=>{
                        if(res.data.status=="1000"){
                            this.imgName = res.data.data.filedir;
                        }else{
                            Toast.fail(res.data.msg)
                        }
                }).catch(err=>{
                    Toast.fail("错误："+err)
                 })
            })
        },
        checkKey(){ //检查淘宝口令
            if(this.taoKey){
                axios.post(this.url+"/order/checkTaoLink",{trade_id:this.tradeId,url:this.taoKey}).then(res=>{
                    if(res.data.status=="1000"){
                        Toast.success("成功")
                        this.btnType="danger"
                        this.btnTxt="验证成功"
                    }else{
                        Toast.fail(res.data.msg)
                        this.btnType="warning"
                        this.btnTxt="验证失败"
                    }
                }).catch(err=>{
                    Toast.fail("错误："+err)
                })

            }else{
                Toast.fail("请填写淘口令")
            }
        },
        submit(){  //提交订单
            if(this.btnType=="danger"){
                if(this.orderNum && this.price && this.imgName){
                    let pay_type = this.repay?2:1;
                    axios.post(this.url+"/order/order_pay",{order_id:this.orderId,httpurl:this.taoKey,payment_pic:this.imgName,third_order_sn:this.orderNum,third_order_amount:this.price,pay_type}).then(res=>{
                        if(res.data.status=="1000"){
                            Toast.success(res.data.msg)
                            this.$router.replace({name:'done'})
                        }else{
                            Toast.fail(res.data.msg)
                        }
                    }).catch(err=>{
                        Toast.fail("请重试："+err)
                    })
                }else{
                    Toast.fail("请填写完整的订单信息")
                }
            }else{
                Toast.fail("请验证您的淘口令")
            }
            
        },
        giveUp(){  //放弃订单
            if(!this.otherReason){
                this.otherReason="无"
            }
         axios.post(this.url+"/order/cancel_order",{order_id:this.orderId,reason:this.radio,content:this.otherReason}).then(res=>{
             if(res.data.status=="1000"){
                 Toast.success("取消成功")
                 this.$router.replace({name:'home'})
             }else{
                 Toast.fail("取消失败")
             }
         }).catch(err=>{
                Toast.fail("错误："+err)
            })

        },
        resize(){
            this.Height = document.documentElement.clientHeight;
            window.onresize=(()=>{
                let nowHeigth = document.documentElement.clientHeight;
                let footer = document.getElementsByClassName("submit_btn")[0];
                if(nowHeigth<this.Height){
                    footer.style.position = "static"
                }else{
                    footer.style.position = "fixed"
                }
            
            })
        }
    },
    mounted(){
        // this.resize()
        this.resizeWindow();
        this.getReason()
        this.orderId = this.$route.query["order_id"]; //获取订单id
        this.tradeId = this.$route.query["trade_id"]; //获取主任务id
        this.repay = this.$route.query.repay
            axios.post(this.url+"/order/get_order_pay",{id:this.tradeId}).then(res=>{
                if(res.data.status=="1000"){
                    this.good = res.data.data.goods_info
                    this.goodType = res.data.data
                }else{
                    Toast.fail(res.data.msg)
                }
            }).catch(err=>{
                Toast.fail("错误："+err)
            })

    },
    computed:{
        ...mapState(["url","imgHeader","cancelReason"])
    },
    filters:{
        service(obj){     //分解折扣服务数据
            if(typeof obj == 'object'){
                 let str = "";
                obj.map((item,index)=>{
                    if(index == (obj.length-1)){
                    str+=item
                    }else{
                     str+=item+"、"
                    }
                })
                return str
            }
        }
    }
}
</script>

