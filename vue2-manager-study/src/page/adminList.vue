<template>
  <div>
    <head-top></head-top>
    <div class="table_container">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="user_name" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="create_time" label="注册时间" width="180">
        </el-table-column>
        <el-table-column prop="city" label="地址">
        </el-table-column>
        <el-table-column prop="admin" label="权限">
        </el-table-column>
      </el-table>
    </div>
    <div class="block right">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 40, 80, 100]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { adminList, adminCount } from "@/api/getData";
export default {
  data() {
    return {
      tableData: [],
      currentPage: 1,
      offset: 0,
      limit: 20,
      total: 0
    };
  },
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      try {
        const countData = await adminCount();
        if (countData.status == 1) {
          this.total = countData.count;
          this.$message({
            type: "success",
            message: "获取数据成功"
          });
          this.adminList()
        } else {
          throw new Error("获取数据失败");
        }
      } catch (err) {
        console.log(err);
      }
    },
    async adminList(){
      try{
        const res = await adminList({offset:this.offset,limit:this.limit});
        if(res.status == 1){
          res.data.forEach(item => {
            const tableData = {};
            tableData.create_time = item.create_time;
            tableData.user_name = item.user_name;
            tableData.admin = item.admin;
            tableData.city = item.city;
            this.tableData.push(tableData)
          })
        }
      }catch(err){
        console.log(err)
      }
    },
    handleSizeChange() {
      this.limit = val;
      this.offset = (val-1)*this.limit;
      this.adminList()
    },
    handleCurrentChange() {
      this.currentPage = val;
      this.offset = (val-1)*this.limit;
      this.adminList()
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
