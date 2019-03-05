<template>
    <div class="payAlert">
        <div class="alert-box">
            <img :src="require('../../assets/images/user/payback.png')" alt="">
            <p class="title">申请提现</p>
            <input v-model="pwd" readonly type="password" placeholder="输入提现密码" autocomplete="off" @focus="show=true" @click="show=true">
            <p class="btn" @click="confirm">确定提现</p>
        </div>
        <van-number-keyboard
        :show="show"
        extra-key="."
        theme="custom"
        close-button-text="完成"
        @blur="show = false"
        @input="onInput"
        @delete="onDelete"
        />
        
    </div>
</template>
<script>
import {Toast,Dialog} from "vant";
import {mapState} from "vuex";
import axios from 'axios';   
export default {
    props:["cardId","money"],
    data(){
        return{
            pwd:"",
            show:false,
        }
    },
    methods:{
        confirm(){
            axios.post(this.url+'/withdrawal/cash',{money:this.money,cardId:this.cardId,pass:this.pwd}).then(res=>{
                if(res.data.status=="1000"){
                    this.$emit("closeAlert",false);
                    Toast.success(res.data.msg)
                }else{
                    if(res.data.msg=='请设置提现密码'){
                        Dialog.confirm({
                        title: '警告',
                        message: '未设置提现密码，是否前去绑定？'
                        }).then(() => {
                            this.$router.push({name:'setCashPwd'})
                        }).catch(() => {
                            this.$emit("closeAlert",false);
                        });
                    }else{
                        Toast.fail(res.data.msg)
                    }
                    this.$emit("closeAlert",false);
                }
            }).catch(err=>{
              Toast.fail("加载错误:"+err)
          })
        },
        onInput(val){
            this.pwd+=`${val}`;
        },
        onDelete() {
        let pwd =this.pwd
        let pwd1 = pwd.slice(0,pwd.length-1)
        this.pwd = pwd1;
        }
    },
    computed:{
        ...mapState(['url'])
    }
    
}
</script>
<style lang="scss">
 .payAlert{
     background: rgba($color: #000000, $alpha: .2);
     position: fixed;
     top: 0;
     left: 0;
     right: 0;
     bottom: 0;
     .alert-box{
         border-radius: .1rem;
         background: #fff;
         width:4.5rem;
         height: 5.22rem;
         position: fixed;
         top: 0;
         left: 0;
         right: 0;
         bottom: 0;
         margin: auto;
         display: flex;
         flex-direction: column;
         align-items: center;
         justify-content: center;
         img{
             width: 4rem;
         }
         .title{
             font-size: .3rem;
             font-weight: bolder;
         }
         input{
             border: 1px solid #ddd;
             width: 80%;
             padding: .1rem;
             margin-top: .2rem;
             font-size: .28rem;
         }
         .btn{
             width: 2.4rem;
             height: .5rem;
             background: red;
             color: white;
             text-align: center;
             line-height: .5rem;
             border-radius: 15px;
             margin-top: .5rem;
         }
     }
 }
</style>
