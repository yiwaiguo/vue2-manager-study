<template>
  <div class="header_container">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/manage' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-for="(item,index) in $route.meta" :key="index">{{item}}</el-breadcrumb-item>
    </el-breadcrumb>

    <el-dropdown @command="handleCommand">
      <img :src="baseImgPath+adminInfo.avatar" class="avatar">
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="home">首页</el-dropdown-item>
        <el-dropdown-item command="signout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
  import {baseImgPath} from "@/config/env"
  import {signout} from "@/api/getData"
  import {mapActions,mapState} from 'vuex'

  export default {
    data(){
      return {
        baseImgPath
      }
    },
    created(){
      if(!this.adminInfo.id){
        this.getAdminData()
      }
    },
    computed:{
      ...mapState(['adminInfo'])
    },
    methods:{
      ...mapActions(['getAdminData']),
      async handleCommand(command){
          if(command == 'home'){
            this.$router.push('./manage')
          }else if(command == 'signout'){
            const res = await signout()
            if(res.status == 1){
              this.$message({
                type:'success',
                message:'退出成功'
              });
              this.$router.push('/')
            }else{
              this.$message({
                type:'error',
                message:res.message
              })
            }
          }
      }

    }
  }

</script>

<style lang="less" scoped>
  @import '../style/base';
  .header_container{
    height: 60px;
    background-color: #EFF2F7;
    display:flex;
    justify-content: space-between;
    align-items:center;
    padding:0 20px;
  }
  .avatar{
    .wh(36px,36px);
    border-radius: 50%;
    margin-right:20px;
  }
</style>

