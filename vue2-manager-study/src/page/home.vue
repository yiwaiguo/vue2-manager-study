<template>
  <div>
    <head-top></head-top>
    <section class="data_section">
      <header class="section_title">数据统计</header>
      <el-row :gutter="20">
        <el-col :span="4">
          <div class="data_list today_head">
            <span class="data_num head">当日数据：</span>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="data_list">
            <span class="data_num">{{userCount}}</span>新增用户
          </div>
        </el-col>
        <el-col :span="4">
          <div class="data_list">
            <span class="data_num">{{orderCount}}</span>新增订单
          </div>
        </el-col>
        <el-col :span="4">
          <div class="data_list">
            <span class="data_num">{{adminDayCount}}</span>新增管理员
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4">
          <div class="data_list all_head">
            <span class="data_num head">总数据：</span>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="data_list">
            <span class="data_num">{{allUserCount}}</span>注册用户
          </div>
        </el-col>
        <el-col :span="4">
          <div class="data_list">
            <span class="data_num">{{allOrderCount}}</span>订单
          </div>
        </el-col>
        <el-col :span="4">
          <div class="data_list">
            <span class="data_num">{{allAdminCount}}</span>管理员
          </div>
        </el-col>
      </el-row>
    </section>
    <tendency :sevenDay="sevenDay" :sevenData="sevenData"></tendency>
  </div>
</template>

<script>
import headTop from "@/components/headTop";
import tendency from "@/components/tendency";
import {userCount,orderCount,adminDayCount,adminCount,getUserCount,getOrderCount} from '@/api/getData'
import dtime from 'time-formater'

export default {
  data() {
    return {
      userCount:'',
      orderCount:'',
      adminDayCount:'',
      allAdminCount:'',
      allUserCount:'',
      allOrderCount:'',
      sevenDay:[],
      sevenData:[]
    };
  },
  mounted(){
    this.initData();
    for(let i = 6;i > -1;i--){
      const date = dtime(new Date().getTime()-86400000*i).format('YYYY-MM-DD');
      this.sevenDay.push(date)
    };
    this.getSevenData()
  },
  components: {
    headTop,
    tendency
  },
  methods:{
    async initData(){
      const today = dtime().format('YYYY-MM-DD');
      Promise.all([userCount(today),orderCount(today),adminDayCount(today),
      adminCount(),getUserCount(),getOrderCount()])
      .then(res => {
        this.userCount = res[0].count;
        this.orderCount = res[1].count;
        this.adminDayCount = res[2].count;
        this.allAdminCount = res[3].count;
        this.allUserCount = res[4].count;
        this.allOrderCount = res[5].count
      }).catch(err => {
        console.log(err);
      })
    },
    async getSevenData(){
      const apiArr = [[],[],[]];
      this.sevenDay.forEach(item => {
        apiArr[0].push(userCount(item));
        apiArr[1].push(orderCount(item));
        apiArr[2].push(adminDayCount(item));
      });
      const promiseArr = [...apiArr[0],...apiArr[1],...apiArr[2]];
      Promise.all(promiseArr).then(
        res => {
          const resArr = [[],[],[]];
          res.forEach((item,index) => {
            if(item.status == 1){
              resArr[Math.floor(index/7)].push(item.count)
            }
          });
          this.sevenData = resArr
        }
      ).catch(err => {
        console.log(err)
      })
    }
  }
};
</script>

<style lang="less" scoped>
.data_section {
  padding: 20px;
  .section_title {
    font-size: 30px;
    text-align: center;
    line-height: 50px;
  }
  .el-row {
    padding: 10px 20px;
  }
  .data_list {
    background: #e5e9f2;
    font-size: 14px;
    text-align: center;
    border-radius: 6px;
    .data_num{
      font-size: 26px;
      color:#333
    }
    .head {
      font-size:22px;
      padding:5px;
      color:#fff;
      display:inline-block;
    }
  }
  .today_head{
    background-color: #FF9800;
  }
  .all_head{
    background-color: #20A0FF;
  }
}
</style>

