<template>
    <div class="invite">
        <Top title="邀请明细"/>
        <ul>
            <li v-for="(item,i) in list" :key="i" class="animated fadeIn">
                <p>
                    <span>{{item.mark}}</span>
                    <!-- <span v-if="1>2">邀请奖励</span> -->
                    <span>+{{item.gold}}金币</span>
                </p>
                <p>{{item.mobile | phone}}</p>
                <p>{{item.create_time}}</p>
            </li>
        </ul>
         <div class="nogoods" v-if="list.length==0">
            <img :src="require('../../../assets/images/user/none.png')" alt="">
            <p>暂时没有明细</p>
        </div>
 
    </div>
</template>
<script>
import Top from "../../../components/top/normalTop.vue"
import axios from "axios"
import {mapState} from "vuex"
import { Toast } from 'vant';
export default {
    components:{
        Top
    },
    computed:{
        ...mapState(['url'])
    },
    mounted(){
        axios.post(this.url+"/activity/invite_list").then(res=>{
            if(res.data.status=="1000"){
                this.list = res.data.data.list
            }else{
                Toast.fail(res.data.msg)
            }
        }).catch(err=>{
           alert(err)
        })
    },
    data(){
        return{
            list:[],
        }
    },
    filters:{
        date:(val)=>{ //解析时间戳
            let d = new Date(val)
            let year = d.getFullYear();
            let month = d.getMonth();
            let day = d.getDay();
            let hour = d.getHours();
            let min = d.getMinutes();
            return year+"月"+(month+1)+"日"+day+" "+hour+":"+min
        },
        phone:(val)=>{ //电话号码隐藏
            let tel = val.substring(0,3)+"****"+val.substring(7,11)
            return tel
        }
    }
    
}
</script>
<style lang="scss">
.invite{
    margin-top: .88rem;
    background: #fff;
    ul{
        li{
            font-size: .26rem;
            padding: .4rem 0;
            p{
                color: #666;
                display: flex;
                justify-content: space-between;
                padding:0 .2rem;
                margin-top: .05rem;
                span{
                    &:last-child{
                        color: red;
                    }
                }
                &:first-child{
                    color: #000;
                }
            }
        }
    }
}
</style>
