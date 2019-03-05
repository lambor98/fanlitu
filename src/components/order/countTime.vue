<template>
    <div class="countTime">
        <p>
            下单剩余时间
            <span>{{this.fen | time}}</span>分
            <span>{{this.miao | time}}</span>秒
        </p>
        <p @click="goSnap">前去购买</p>
    </div>
</template>
<script>
export default {
    props:["min","sec","id","tId"],
    data(){
        return{
            fen:60,
            miao:60,
            timer:null,
        }
    },
    mounted(){
        this.reduce();
        this.fen= this.min;
        this.miao = this.sec;
    },
    updated(){
    },
    methods:{
        reduce(){
            this.timer = setInterval(()=>{
                this.miao--
                if(this.miao==0){
                    this.miao=59
                    this.fen--
                    if(this.fen==0 && this.miao){
                        clearInterval(this.timer)
                    }
                }
            },1000)
        },
        goSnap(){
            this.$router.push({name:"going",query:{order_id:this.id,trade_id:this.tId}})
        }
    },
    filters:{
        time(val){
            if(val<10){
                return '0'+val
            }else{
                return val
            }
        }
    }
    
}
</script>
<style lang="scss" scoped>
    .countTime{
        padding: .1rem .2rem;
        display: flex;
        justify-content: space-between;
        p{
            line-height: .4rem;
            span{
                padding: .04rem .08rem;
                border-radius: .1rem;
                margin: 0 .1rem;
                background: red;
                color: white;
            }
            &:last-child{
                width: 1.36rem;
                height: .4rem;
                background: rgb(246,208,8);
                text-align: center;
                line-height: .4rem;
                border-radius: .1rem;
                color: rgb(154, 99, 1)
            }
        }
    }
</style>
