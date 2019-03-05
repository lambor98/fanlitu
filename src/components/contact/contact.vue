<template>
    <div class="contactqq">
        <div class="alert">
            <p class="title">前往客服QQ：800839930？</p>
            <div class="bottom">
                <p class="btn cancel" @click="close">取消</p>
                <p class="btn confirm" id="goToQQ" @click="closed">确认</p>
            </div>

        </div>
    </div>
</template>
<script>
import "../../tool/wpa.php"
export default {
    data(){
        // eslint-disable-next-line
         BizQQWPA.addCustom({
            aty: '0', //指定工号类型,0-自动分流，1-指定工号，2-指定分组
            nameAccount: '800839930', //指定的聊天 QQ 号码
            selector: 'goToQQ' //触发聊天的标签id
        })
    },
    methods:{
        close(){
            this.$emit("close",false);
            setTimeout(() => {
                this.$router.go(0)
            }, 1000);
        },
        closed(){
            this.$emit("close",false);
            setTimeout(() => {
                this.$router.go(0)
            }, 1000);
        }
    }
}
</script>
<style lang="scss">
 .contactqq{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba($color: #000000, $alpha: .5);
    z-index: 9999;
    .alert{
        width: 80%;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        text-align: center;
        background: #fff;
        .title{
            font-size: .3rem;
            padding: .4rem 0;
        }
        .bottom{
            display: flex;
            justify-content: space-around;
            padding: .4rem 0;
            .btn{
                padding: .12rem .4rem;
                color: #000;
                border-radius: .1rem;
                font-size: .3rem;
                &.confirm{
                    background: orange;
                    color: white;
                }
               
            }
        }
    }

 }
</style>
