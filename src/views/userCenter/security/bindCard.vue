<template>
    <div class="bindCard box">
        <van-notice-bar mode="link">
        请仔细核对绑定银行卡的户名、开服支行、卡号信息、是否正确，信息错误会影响您的到账时间
        </van-notice-bar>
        <div v-if="!isCardBind">
            <van-cell-group>
                <van-field v-model="trueName" placeholder="须和银行卡姓名一致" label="姓名：" :error-message="nameError"/>
                <van-cell title="开户行" :value="bankName?bankName:'请选择'" is-link  @click="bankShow=true"/>
                <van-cell title="开户省份" :value="bankProv?bankProv:'请选择'" is-link @click="provShow=true"/>
                <van-cell title="开户城市" :value="bankCity?bankCity:'请选择'" is-link  @click="bankProv?cityShow=true:''"/>
                <van-cell title="开户支行" :value="bankBranch?bankBranch:'请选择'" is-link @click="(bankCity && bankName)?branchShow=true:''"/>
                <van-field v-model="cardNum" placeholder="请填写" label="银行卡号：" :error-message="cardError"/>
                <van-cell title="上传身份证照片" />
                <div class="jietu">
                    <span class="tip">查看示例截图></span>
                    <img :src="path?path:require('../../../assets/images/user/img1.png')" alt="" @click="openFile">
                    <p>身份证照片</p>
                    <input accept="image/*" name="img" id="imgFile" type="file" v-show="2>3" @change="upload">
                </div>
                <van-button type="danger" size="large" @click="submit">提交审核</van-button>
            </van-cell-group>
            <van-popup v-model="bankShow" position="bottom" :overlay="true">
                <van-picker 
                show-toolbar
                :columns="bankList" 
                title="银行"
                @cancel="bankShow=false"
                @confirm="bankConfirm"
                />
            </van-popup>
            <van-popup v-model="provShow" position="bottom" :overlay="true">
                <van-picker 
                show-toolbar
                :columns="bankProvList" 
                title="开户省份"
                @cancel="provShow=false"
                @confirm="provConfirm"
                />
            </van-popup>
            <van-popup v-model="cityShow" position="bottom" :overlay="true">
                <van-picker 
                show-toolbar
                :columns="bankCityList" 
                title="开户地点"
                @cancel="cityShow=false"
                @confirm="cityConfirm"
                />
            </van-popup>
            <van-popup v-model="branchShow" position="bottom" :overlay="true">
                <van-picker 
                show-toolbar
                :columns="bankBranchList" 
                title="开户支行"
                @cancel="branchShow=false"
                @confirm="(val,index)=>{bankBranch=val;branchShow=false}"
                />
            </van-popup>
        </div>
        <div class="isOk" v-if="isCardBind">
            <van-button type="warning" size="large" >正在审核</van-button>
        </div>
    </div>
</template>
<script>
import {getObjectURL} from "../../../tool/upload.js"
import {mapState,mapActions} from "vuex"
import axios from "axios"
import lrz from "lrz"
import {Toast,Dialog} from "vant"
export default {
    data() {
        return {
            trueName:null,
            cardNum:null,
            path:null,
            bankList:[],          //当前所有银行
            bankProvList:[],      //当前所有省份
            bankCityList:[],      //当前所有城市
            bankBranchList:[],    //当前所有支行
            bankId:[],            //当前多有银行的id
            provId:[],            //当前所有省份的id
            bankShow:false,       //显示银行？
            provShow:false,       //显示省份?
            cityShow:false,       //显示城市?
            branchShow:false,     //显示分支？
            bankName:null,        //银行名
            bankProv:null,        //省份
            bankCity:null,        //城市
            bankBranch:null,      //银行支行
            id:null,              //银行id
            imgName:"",           //身份证截图
            dataUrl:"",           //截图base64码
            nameError:null,       //持卡人姓名错误
            cardError:null,       //银行卡错误

        }
    },
    methods: {
        ...mapActions(["getSecure"]),
        openFile(){ //打开文件选择器
            document.getElementById("imgFile").click();
        }, 
        upload(e){  //上传图片
            let file = e.currentTarget.files[0];
            let that = this;
            this.path = getObjectURL(file)
            lrz(file,{width:600}).then(function(rst){
                that.dataUrl=rst.base64;
                axios.post(that.url+"/center/upload",{baseImage:that.dataUrl,scenario:1}).then(res=>{
                        if(res.data.status=="1000"){
                            that.imgName = res.data.data.filedir;
                        }else{
                            Toast.fail(res.data.msg)
                            that.imgName =require('../../../assets/images/user/img1.png');
                        }
                })
            }).catch((error)=>{
                if(error){
                    alert("上传失败，请重试")
                    that.imgName = require('../../../assets/images/user/img1.png');
                }
            })
           
        },
        bankConfirm(val,index){ //确定选择银行后
            this.bankName = val;
            this.id = this.bankId[index];
            this.bankShow = false;
            this.bankBranch=null;  //清空支行
            this.bankBranchList=[]; //清空
            this.getOtherBank();   //尝试获取支行
        }, 
        provConfirm(val,index){ //确定选择省份后
            this.bankProv=val;
            this.provShow = false;
            this.bankCity=this.bankBranch=null;
            this.bankCityList=this.bankBranchList=[];
            axios.post(this.url+"/bind_info/getCity",{province_id:this.provId[index]}).then(res=>{
                for(let i =0;i<res.data.data.city.length;i++){
                this.bankCityList.push(res.data.data.city[i].name)
                }
            })
        },
        cityConfirm(val){ //确定选择城市后
            this.bankCity =val
            this.cityShow = false;
            this.bankBranch=null;
            this.bankBranchList=[];
            this.getOtherBank();
        },
        getOtherBank(){ //获取支行
            if(this.bankName && this.bankProv && this.bankCity ){
                axios.post(this.url+"/bind_info/getOtherBank",{sheng:this.bankProv,bank_name:this.id,city:this.bankCity}).then(res=>{
                    for(let i =0;i<res.data.data.list.length;i++){
                    this.bankBranchList.push(res.data.data.list[i].sub_branch)
                    }   
                })
            }
        },
        submit(){ //提交审核
            let nameReg =/^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/;
            if(nameReg.test(this.trueName)){ //名字是否正确
                this.nameError=null
                if(!this.bankName || !this.bankProv || !this.bankCity ||!this.bankBranch){ //有没有填银行卡类型
                    Toast.fail("请定位您的开户地点与支行")
                }else{
                    if(this.cardNum.length<10){  //卡号对不对
                        this.cardError="输入正确银行卡号"
                        Toast.fail("输入正确银行卡号")
                    }else{
                        this.cardError=null
                        if(!this.imgName){ //是否上传了图片
                                Dialog.alert({
                                message: '请上传身份证截图'
                                }).then(() => {
                                // on close
                                });
                        }else{
                            axios.post(this.url+"/bind_info/bindBankCar",{truename:this.trueName,bankname:this.id,sheng:this.bankProv,shi:this.bankCity,other_bank:this.bankBranch,id_card_number:this.cardNum,id_card_dir:this.imgName}).then(res=>{
                                if(res.data.status=="1000"){
                                    Toast.success("绑定成功,正在审核")
                                    this.$router.go(-1)
                                }else{
                                    Toast.fail(res.data.msg)
                                }
                            })
                        }
                    }
                }
            }else{
                this.nameError="请输入正确姓名"
                Toast.fail("请输入正确姓名")
            }
        },
    },
    created(){
        this.getSecure();
    },
    mounted(){
        axios.post(this.url+"/bind_info/getSupportBank").then(res=>{
            for(let i =0;i<res.data.data.list.length;i++){
                this.bankList.push(res.data.data.list[i].name)
                this.bankId.push(res.data.data.list[i].id)
            }
        })
        axios.post(this.url+"/bind_info/getProvince").then(res=>{
           for(let i =0;i<res.data.data.province.length;i++){
                this.bankProvList.push(res.data.data.province[i].name)
                this.provId.push(res.data.data.province[i].id)
            }
        })

    },
    computed:{
        ...mapState(["url","userSecure","isCardBind"])
    }
    
    
}
</script>
<style lang="scss">
  .bindCard{
      .jietu{
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
          padding: .3rem 0;
          .tip{
              color: blue;
          }
          img{
                width: 2.1rem;
                height: 2.1rem;
                margin: .2rem 0;
          }
      }
      .van-button--large{
          width: 90%;
          display: block;
          margin: auto;
      }
      .isOk{
          margin-top: 2rem;
      }
  }
</style>
