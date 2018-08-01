<template>
  <div>
    <head-top></head-top>
    <div class="table_container">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="店铺名称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="店铺地址">
                <span>{{ props.row.address }}</span>
              </el-form-item>
              <el-form-item label="店铺介绍">
                <span>{{ props.row.description }}</span>
              </el-form-item>
              <el-form-item label="店铺 ID">
                <span>{{ props.row.id }}</span>
              </el-form-item>
              <el-form-item label="联系电话">
                <span>{{ props.row.phone }}</span>
              </el-form-item>
              <el-form-item label="评分">
                <span>{{ props.row.rating }}</span>
              </el-form-item>
              <el-form-item label="销售量">
                <span>{{ props.row.recent_order_num }}</span>
              </el-form-item>
              <el-form-item label="分类">
                <span>{{ props.row.category }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="店铺名称" prop="name">
        </el-table-column>
        <el-table-column label="店铺地址" prop="address">
        </el-table-column>
        <el-table-column label="店铺介绍" prop="description">
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index,scope.row)">
              编辑
            </el-button>
            <el-button size="mini" type="success" @click="addFood(scope.$index,scope.row)">
              添加食品
            </el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index,scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="block right">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 40, 80, 100]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog title="修改店铺信息" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="店铺名称" label-width="100px">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="详细地址" label-width="100px">
          <el-autocomplete class="inline-input"
          v-model="address.address"
          :fetch-suggestions="querySearchAsync"
          placeholder="请输入内容"
          @select="addressSelect"
          style="width:100%"></el-autocomplete>
          <span>{{city.name}}</span>
        </el-form-item>
        <el-form-item label="店铺介绍" label-width="100px">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" label-width="100px">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="店铺分类" label-width="100px">
          <el-cascader
          expand-trigger="hover"
          :options="categoryOptions"
          v-model="selectedCategory"
          @change="handleChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label="商铺图片" label-width="100px">
          <el-upload
          class="upload-demo"
          :action="baseUrl+'/v1/addimg/shop'"
          :on-success="handleSuccess"
          :before-upload="beforeUpload"
          :show-file-list="false">
            <img :src="baseImgPath+form.image_path" class="avatar">
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateShop">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { baseUrl, baseImgPath } from "@/config/env";
import {
  cityGuess,
  searchplace,
  getResturants,
  getResturantDetail,
  getResturantsCount,
  updateResturant,
  deleteResturant,
  foodCategory
} from "@/api/getData";
export default {
  data() {
    return {
      tableData: [],
      baseUrl,
      baseImgPath,
      city: {},
      offset: 0,
      limit: 20,
      total: 0,
      currentPage: 1,
      dialogFormVisible: false,
      address: {},
      form: {},
      categoryOptions:[],
      selectedCategory:[]
    };
  },
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      try {
        this.city = await cityGuess();
        const countData = await getResturantsCount();
        if (countData.status == 1) {
          this.total = countData.count;
        } else {
          throw new Error(获取数据失败);
        }
        this.getResturants();
      } catch (err) {
        console.log(err);
      }
    },
    async getCategory() {
      try{
        const categories = await foodCategory();
        categories.forEach(item =>{
          if(item.sub_categories.length){
            const addnew = {
              value:item.name,
              label:item.name,
              children:[]
            };
            item.sub_categories.forEach((subItem,index) => {
              if(index == 0){
                return
              }
              addnew.children.push({
                value:subItem.name,
                label:subItem.name
              })
            });
            this.categoryOptions.push(addnew)
          }
        })
      }catch(err){
        console.log(err)
      }
    },
    async getResturants() {
      const { latitude, longitude } = this.city;
      const restaurants = await getResturants({
        latitude,
        longitude,
        offset: this.offset,
        limit: this.limit
      });
      restaurants.forEach(item => {
        const tableData = {};
        tableData.name = item.name;
        tableData.address = item.address;
        tableData.description = item.description;
        tableData.id = item.id;
        tableData.phone = item.phone;
        tableData.rating = item.rating;
        tableData.recent_order_num = item.recent_order_num;
        tableData.category = item.category;
        tableData.image_path = item.image_path;
        this.tableData.push(tableData);
      });
    },
    handleEdit(index,row) {
      this.form = row;
      this.address.address = row.address;
      this.selectedCategory = row.category.split('/');
      this.dialogFormVisible = true;
      if(!this.categoryOptions.length){
        this.getCategory()
      }
    },
    addFood(index,row) {
      this.$router.push({
        path:'addFoods',
        query:{
          restaurant_id:row.id
        }
      })
    },
    async handleDelete(index,row) {
      try{
        const res = await deleteResturant(row.id);
        if(res.status == 1){
          this.$message({
            type:'success',
            message:'删除成功'
          })
          this.tableData.splice(index,1)
        }else{
          throw new Error(res.message)
        }
      }catch(err){
        this.$message({
          type:'error',
          message:err.message
        })
        console.log('操作失败')
      }
    },
    async querySearchAsync(queryString,cb) {
      if(queryString){
        try{
          const cityList = await searchplace(this.city.id,queryString);
        if(cityList instanceof Array){
          cityList.map(item => {
            item.value = item.address
            return item
          })
          cb(cityList)
        }
        }catch(err){
          console.log(err)
        }
      }
    },
    addressSelect(value) {
      console.log(value)
      const {address,latitude,longitude} = value;
      this.address = {address,latitude,longitude}
    },
    handleChange() {},
    handleSuccess(res,file){
      if(res.status == 1){
        this.form.image_path = res.image_path
      }else {
        this.$message.error('上传图片失败')
      }
    },
    beforeUpload(file){
      const isRightType = (file.type === 'image/jpeg') || (file.type === 'image/png');
      const isLt2M = file.size /1024/1024 < 2;
      if(!isRightType){
        this.$message.error('图片格式不对')
      }else if(!isLt2M){
        this.$message.error('图片不要大于2M')
      }
    },
    async updateShop(){
      this.dialogFormVisible = false;
      try {
        Object.assign(this.form,this.address);
        this.form.category = this.selectedCategory.join('/')
        const res = await updateResturant(this.form)
        if(res.status == 1){
          this.$message({
            type:'success',
            message:'更新店铺信息成功'
          })
          this.getResturants()
        }else {
          this.$message({
            type:'error',
            message:res.message
          })
        }
      }catch(err){
        console.log(err)
      }

    },
    handleSizeChange(val) {
      this.limit = val;
      this.offset = (val-1)*this.limit;
      this.getResturants()
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.offset = (val-1)*this.limit;
      this.getResturants()
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
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.avatar{
  width: 120px;
  height: 120px;
  display:block;
}
</style>
