<template>
    <div class="address box">
        <Top title="收货地址"/>
        <div class="tip">
            <p>注意</p>
            <p>1.请填写淘宝常用收货地址，中奖试用下单必须与该地址一致！网站会定期核查，如若发现不一致将封号处理，永不中奖！</p>
            <p>2.该地址将作为后期所有品牌活动寄送的收货地址，无需垫付直接寄送。</p>
        </div>
        <div class="address-detail" v-show="!show">
            <van-address-list
                v-model="chosenAddressId"
                :list="list"
                :add-button-text="list[0].name?'修改地址':'新增地址'"
                @add="onEdit"
                @edit="onEdit"
            />
        </div>
        <div class="add-address" v-if="show">
            <van-cell-group> 
                <van-field v-model="address.consignee" required placeholder="请输入收货人" label="收货人" icon="question-o" clearable/>
                <van-field v-model="address.mobile" required placeholder="请输入手机号" label="手机号" icon="question-o" clearable/>
                <van-cell title="收获地址" :value="addressDetail==''?'请选择地址':addressDetail" required is-link @click="bottomShow=true" />
                <van-field v-model="address.address" required placeholder="请填写详情地址" label="详情地址" icon="question-o" clearable/>
                <van-button size="large" type="danger" @click="updateAddress">保存</van-button>
                <van-button size="large" plain type="primary" @click="show=false">取消</van-button>
            </van-cell-group>
            <van-popup v-model="bottomShow" 
            position="bottom" 
            overlay
            close-on-click-overlay>
                <div class="liandong">
                    <p>
                        <span @click="bottomShow=false">取消</span>
                        <span @click="addressCheck">确认</span>
                    </p>
                    <div class="map-box">
                        <select v-model="address.province" @change="getCity" id="prov">
                            <option value="0">请选择</option>
                            <option v-for="(item,index) in province" :key="index" :value="item.id">{{item.name}}</option>
                        </select>
                         <select v-model="address.city" @change="getCounty" id="city">
                            <option value="0">请选择</option>
                            <option v-for="(item,index) in city" :key="index" :value="item.id">{{item.name}}</option>
                        </select>
                         <select v-model="address.county" id="county">
                            <option value="0">请选择</option>
                            <option v-for="(item,index) in county" :key="index" :value="item.id">{{item.name}}</option>
                        </select>
                    </div>
                </div>
            </van-popup>
        </div>
    </div>
</template>
<script>
import Top from "../../../components/top/normalTop.vue"
import axios from "axios"
import {Toast} from "vant"
import {mapState} from "vuex"
// import async from 'async';
export default {
    computed: {
        ...mapState(["url"])
    },
    data(){
        return{
            sel:"1",
            province:{}, //省份列表
            city:{},     //城市列表
            county:{},   //区县列表
            chosenAddressId: '1',
            list:[{}],  //地址信息
            show:false,
            bottomShow:false,
            addressDetail:"",
            address:{   //修改&新增地址信息
                consignee:null,
                province:0,
                city:0,
                county:0,
                address:"",
                mobile:null
                }
           
        }
    },
    mounted(){
        document.getElementsByClassName("van-address-item")[0].style.display = "none"
        this.getAddress();
        axios.post(this.url+"/bind_info/getProvince").then(res=>{
            this.province=res.data.data.province
        }).catch(err=>{
            if(err){
                Toast.fail("省市获取失败，请刷新")
            }
        })
        // axios.post(this.url+"/bind_info/getCity",{province_id:1}).then(res=>{
        //     this.city=res.data.data.city
        // }).catch(err=>{
        //     Toast.fail("省市获取失败，请刷新")
        // })
        // axios.post(this.url+"/bind_info/getCounty",{city_id:1}).then(res=>{
        //     this.county=res.data.data.county
        // }).catch(err=>{
        //     Toast.fail("省市获取失败，请刷新")
        // })

        
         
         
        
    },
    methods:{
        getAddress(){ //获取用户地址信息
            axios.post(this.url+"/bind_info/getBindAddress").then(res=>{
                if(res.data.status=="1000" && res.data.data.bindInfo){
                    document.getElementsByClassName("van-address-item")[0].style.display = "block"
                        this.list=[{
                            id:"1",
                            name:res.data.data.bindInfo.consignee,
                            tel:res.data.data.bindInfo.mobile,
                            address:res.data.data.show_address
                        }]
                    if(res.data.data.bindInfo.consignee==""){
                        document.getElementsByClassName("van-address-item")[0].style.display = "none"
                    }
                }else {
                    document.getElementsByClassName("van-address-item")[0].style.display = "none"
                }
            })
        },  
        onEdit(){
            this.show=true
        },
        getCity(){ //省份选择后获取城市
            this.address.city=0;
            this.address.country=0;
            this.county={};
            this.city={};
             axios.post(this.url+"/bind_info/getCity",{province_id:this.address.province}).then(res=>{
                this.city=res.data.data.city
             }).catch(err=>{
                 if(err){
                     Toast.fail("省市获取失败，请重试")
                 }
             })
        },
        getCounty(){//城市选择后获取县区
             axios.post(this.url+"/bind_info/getCounty",{city_id:this.address.city}).then(res=>{
                this.county=res.data.data.county
             }).catch(err=>{
                 if(err){
                    Toast.fail("省市获取失败，请重试")
                 }
             })
        },
        addressCheck(){
            let prov =document.getElementById("prov").selectedIndex
            let city =document.getElementById("city").selectedIndex
            let county =document.getElementById("county").selectedIndex
            if(city==0 || county ==0 || city==-1 || county==-1){
                Toast.fail("请选择地址")
            }else{
                this.addressDetail=this.province[prov-1].name+(this.city[city-1]?this.city[city-1].name:"")+(this.county[county-1]?this.county[county-1].name:"");
                this.bottomShow=false;
            }
           
        },
        updateAddress(){
            let nameReg=/^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/;
            let telReg=/(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/;
            if(this.address.consignee=="" || this.address.address=="" || this.address.mobile==null || this.addressDetail==""){
                    Toast.fail('请填写必填项');
            }else{
                let flag1 = nameReg.test(this.address.consignee);
                let flag2 = telReg.test(this.address.mobile);
                if(!flag1){
                    Toast.fail('用户名不合法');
                }else{
                    if(!flag2){
                         Toast.fail('手机号不合法');
                    }else{
                        axios.post(this.url+"/bind_info/bind_changeaddr",this.address).then(res=>{
                            if(res.data.status=="1000"){
                                this.show = false;
                                Toast.success(res.data.msg);
                                this.getAddress();
                            }else{
                                Toast.fail(res.data.msg);
                            }
                        })
                    }
                }
            }
        }
    },
    components:{
        Top
    }
}
</script>
<style lang="scss" scoped>
    .address{
        // background: rgb(231, 230, 230);
        min-height: 80vh;
        .tip{
            padding: .2rem 0;
            background: #fff;
            margin-top: .2rem;
            p{
                padding: .05rem .26rem;
                &:first-child{
                    color: red;
                    font-size: .26rem;
                }
            }
        }
        .address-detail{
            margin-top: .3rem;
        }
        .add-address{
            background: #fff;
            margin-top: .3rem;
            padding-bottom: .5rem;
            .van-button{
                width: 90%;
                margin: .2rem auto;
                display: block;
            }
            .liandong{
                width: 100%;
                height: 30vh;
                p{
                    display: flex;
                    justify-content:space-around;
                    span{
                        font-size: .3rem;
                        display: block;
                        padding: .1rem;
                        color: rgb(94, 94, 204);
                    }
                }
                .map-box{
                    margin-top: .8rem;
                    display: flex;
                    justify-content: space-around;
                    select{
                        width:2.1rem;
                        display: block;
                        height: .6rem;
                        background: #fff;
                        border: 1px solid #000;
                    }
                }

            }
        }
    }
</style>
