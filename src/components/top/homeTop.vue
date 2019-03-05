<template>
    <div class="top">
        <ul>
            <li>
                
            </li>
            <li>
                <p v-if="!isShow">{{title}}</p>
                <form class="search-box" onsubmit="return false" v-if="isShow">
                    <input type="text" placeholder="搜索功能暂时无法试用" v-model="txt">
                </form>
            </li>
            <li>
                <img id="search-btn" @click="showSearch" src="../../assets/images/home/search.png" />
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    props:["title"],
    data() {
        return {
            isShow:false,
            txt:""
        }
    },
    methods: {
        showSearch(){
            this.isShow=!this.isShow
        }
    },
    
}
</script>
<style lang="scss" scope>
.top{
    position: fixed;
    top: 0;
    left: 0;
    height: .88rem;
    width: 100%;
    background: #2b3840;
    color: white;
    font-size: .32rem;
    z-index: 999;
    ul{
        display: flex;
        li{
            height: .88rem;
            text-align: center;
            line-height: .88rem;
            width: 10%;
            &:nth-child(2){
                width: 80% !important;
                display: flex;
                align-items: center;
                justify-content: center;
            }
         
            &:last-child{
                display: flex;
                align-items: center;
                justify-content: center;
            }
            #search-btn{
                cursor: pointer;
                width: .4rem !important;
            }
            .search-box{
                width: 80%;
                background: #fff;
                height: .5rem;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: .5rem;
                input{
                    border: none;
                    height: .5rem;
                    font-size: .24rem;
                    color: #2b3840;
                }
            }

        }
    }
}

</style>
