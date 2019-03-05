<template>
    <div class="snapUp">
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    mounted(){
        document.documentElement.scrollTop = 0 ;
        document.body.scrollTop = 0;
    }
    
}
</script>