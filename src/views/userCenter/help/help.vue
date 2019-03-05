<template>
    <div class="help box">
        <Top title="帮助中心"/>
        <ul class="help_top">
            <li v-for="(item,index) in tip" :key="index">
                <img :src="require('../../../assets/images/help/help'+(index+1)+'.png')" alt="">
                <p>{{item}}</p>
            </li>
        </ul>
        <div class="ques" v-for="(item,index) in question" :key="index">
            <span class="title">
                {{item.name}}
            </span>
            <van-collapse v-model="activeName" accordion>
                <van-collapse-item v-for="(val,i) in item.question" :key="i" :title="val.title" :name="(i+1)*(index+1)">
                    <p v-html="val.text"></p>
                </van-collapse-item>
            </van-collapse>
        </div>        
    </div>
</template>

<script>
import Top from "../../../components/top/normalTop.vue"
import {mapState} from "vuex"
import axios from "axios"
export default {
    components:{
        Top,
    },
    data(){
        return{
            tip:['新手问题','试用问题','下单领取问题','资金问题','收获评价问题','其他问题'],
             activeName: ["0"],
             question:[],
        }
    },
    mounted(){
        axios.post(this.url+"/center/help").then(res=>{
            this.question = res.data.data.help
        }).catch(err=>{
            alert(err)
        })
    },
    computed:{
        ...mapState(["url"])
    }
    
}
</script>
<style lang="scss">
    .help{
        background: #fff;
        .help_top{
            display: flex;
            flex-wrap: wrap;
            li{
                width: 33%;
                text-align: center;
                padding-top: .2rem;
                font-size: .24rem;
                img{
                    margin: auto;
                    width: .6rem;
                    padding-bottom: .1rem;
                }

            }
        }
        .ques{
            margin-top: .2rem;
             .van-cell{
                font-size: .26rem !important;
                padding: .1rem .3rem;
                color: rgb(102, 102, 102)
            }
            .van-collapse-item__content{
                font-size: .26rem !important;
                padding: .1rem .3rem;
            }
            .title{
                margin-left: .3rem;
                font-size: .3rem;
                display: block;
                padding: .2rem 0;
            }
        }

       
    }
</style>
