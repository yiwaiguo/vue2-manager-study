<template>
  <div>
    <headTop></headTop>
    <div class="table_container">
      <el-table :data="tableData" highlight-current-row style="width: 100%">
        <el-table-column type="index"  width="100">
        </el-table-column>
        <el-table-column prop="date" label="日期" width="180">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="address" label="地址">
        </el-table-column>
      </el-table>
    </div>
    <div class="block right">
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[20, 40, 80, 100]"
      :page-size="limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import {getUserList,getUserCount} from '@/api/getData'
export default {
  data() {
    return {
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ],
        offset:0,
        limit:40,
        total:500,
        currentPage:2
    };
  },
  created(){
    this.initData()
  },
  methods:{
    async initData(){
      try {
        const countData = await getUserCount();
        if(countData.status == 1){
          this.total = countData.count
        }else {
          throw new Error('获取数据失败')
        };
        this.getUsers()
      } catch(err) {
        console.log('获取数据失败',err);
      }
    },
    handleSizeChange(val){
      this.limit = val;
      this.offset = (val-1)*this.limit;
      this.getUsers()
    },
    handleCurrentChange(val){
      this.currentPage = val;
      this.offset = (val-1)*this.limit;
      this.getUsers()
    },
    async getUsers(){
      const Users = await getUserList({offset:this.offset,limit:this.limit});
      this.tableData = [];
      Users.forEach(item => {
        const tableData = {};
        tableData.name = item.username;
        tableData.date = item.registe_time;
        tableData.address = item.city;
        this.tableData.push(tableData)
      })
    }
  }
};
</script>

<style lang="less" scoped>
@import "../style/base";
.table_container {
  margin: 20px;
  border: 1px solid #ccc;
}
.block {
  margin-right: 20px;
}
</style>
