<template>
    <div class="qq box">
        <Top title="联系QQ"/>
        <van-notice-bar
        text="填写QQ有助于提高中奖率，方便中奖后即使联系你"
        scrollable
        mode="closeable"
        />
        <van-cell-group>
            <van-field
                v-model="qq"
                clearable
                label="QQ"
                icon="question-o"
                placeholder="请输入QQ"
            />
        </van-cell-group>
        <van-button type="danger" size="large" @click="updateQQ">提交</van-button>
        
    </div>
</template>
<script>
import Top from "../../../components/top/normalTop.vue"
import { Toast } from 'vant';
import axios from "axios"
import {mapState} from "vuex"
export default {
    data(){
        return{
            qq:null
        }
    },
    components:{
        Top
    },
    methods:{
        updateQQ(){
            let qqReg = /^[1-9][0-9]{4,10}$/;
            if(qqReg.test(this.qq)){
                axios.post(this.url+"/bind_info/bindqq",{new_qq:this.qq}).then(res=>{
                    if(res.data.status=="1000"){
                        this.$router.go(-1)
                        Toast.success("修改成功")
                    }else{
                        Toast.fail(res.data.msg)
                    }
                })
            }else{
                Toast.fail("非法的QQ号")
            }
        }
    },
    computed: {
        ...mapState(["url"])
    },
    
}
</script>

<style lang="scss" scoped>
.qq{
    // background: #e7e6e6;
    .van-button{
        width: 90%;
        display: block;
        margin:.5rem auto;
    }
}
</style>
