<template>
  <div class="login_page fillcontain">
    <transition name="form-fade" mode="in-out">
      <section class="form">
        <h1>elm后台管理系统</h1>
        <div class="form_container">
          <el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" class="demo-ruleForm">
            <el-form-item prop="username">
              <el-input type="text" v-model="ruleForm2.username" auto-complete="off" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" v-model="ruleForm2.password" auto-complete="off" placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="submit_btn" @click="submitForm('ruleForm2')">登录</el-button>
            </el-form-item>
          </el-form>
          <div class="tip">
            <p>温馨提示：</p>
            <p>未登录过的新用户，自动注册</p>
            <p>注册过的用户可凭账号密码登录</p>
          </div>
        </div>
      </section>
    </transition>
  </div>
</template>

<script>
import {mapActions,mapState} from 'vuex'
import {login,getAdminInfo} from '@/api/getData'
export default {
  data() {
    return {
      ruleForm2: {
        username: "",
        password: ""
      },
      rules2: {
        username: [{ required:true,message: '请输入用户名', trigger: "blur" }],
        password: [{ required:true,message: '请输入密码', trigger: "blur" }]
      }
    };
  },
  mounted(){
    if(!this.adminInfo.id){
      this.getAdminData()
    }
  },
  computed:{
    ...mapState(['adminInfo'])
  },
  methods: {
    ...mapActions(['getAdminData']),
    async submitForm(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          const res = await login({
            user_name:this.ruleForm2.username,
            password:this.ruleForm2.password
          })
          if(res.status == 1){
            this.$message({
              type:'success',
              message:'登录成功'
            })
            this.$router.push('manage')
          } else {
            this.$message({
              type:'error',
              message:res.message
            })
          }
        } else {
          this.$notify({
            title:'错误',
            message:'请输入正确的用户名和密码',
            offset:200
          });
          return false
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  watch:{
    adminInfo(newValue){
      if(newValue.id){
        this.$message({
          type:'success',
          message:'自动登录'
        });
        this.$router.push('/manage')
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "../style/base.less";
.login_page {
  background-color: #324057;
  .form {
    h1 {
      font-size: 34px;
      color: #fff;
      position:absolute;
      top:100px;
      left:50%;
      transform:translateX(-50%)
    }
    .form_container {
      .wh(320px,210px);
      .ctp(320px,210px);
      background-color: #fff;
      border-radius: 5px;
      padding: 25px;
      .submit_btn {
        width: 100%;
      }
    }
    .tip {
      text-align:center;
      font-size: 12px;
      color: red;
      line-height: 12px;
    }
  }
}
</style>
