<template>
  <div>
    <head-top></head-top>
    <visitor-pie :pieData="pieData"></visitor-pie>
  </div>
</template>

<script>
  import visitorPie from '@/components/visitorPie';
  import {getUserCity} from '@/api/getData'
  export default {
    data(){
      return {
        pieData:{}
      }
    },
    components:{
      visitorPie
    },
    mounted(){
      this.initData()
    },
    methods:{
      async initData(){
        try{
          const res = await getUserCity();
          if(res.status == 1){
            this.pieData = res.user_city
          }else{
            throw new Error(res)
          }
        }catch(err){
          console.log(err)
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../style/base';
</style>
