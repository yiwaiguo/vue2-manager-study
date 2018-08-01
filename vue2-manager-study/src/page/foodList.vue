<template>
  <div>
    <head-top></head-top>
    <div class="table_container">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="食品名称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="餐馆名称">
                <span>{{ props.row.restaurant_name }}</span>
              </el-form-item>
              <el-form-item label="食品 ID">
                <span>{{ props.row.item_id }}</span>
              </el-form-item>
              <el-form-item label="餐馆 ID">
                <span>{{ props.row.restaurant_id }}</span>
              </el-form-item>
              <el-form-item label="食品介绍">
                <span>{{ props.row.description }}</span>
              </el-form-item>
              <el-form-item label="餐馆地址">
                <span>{{ props.row.restaurant_address }}</span>
              </el-form-item>
              <el-form-item label="食品评分">
                <span>{{ props.row.rating }}</span>
              </el-form-item>
              <el-form-item label="食品分類">
                <span>{{ props.row.category_name }}</span>
              </el-form-item>
              <el-form-item label="月销量">
                <span>{{ props.row.month_sales }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="食品名称" prop="name">
        </el-table-column>
        <el-table-column label="食品介绍" prop="description">
        </el-table-column>
        <el-table-column label="评分" prop="rating">
        </el-table-column>
        <el-table-column label="操作">
          <div slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger">删除</el-button>
          </div>
        </el-table-column>
      </el-table>
    </div>
    <div class="block right">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[20, 40, 80, 100]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog title="修改食品信息" :visible.sync="outerVisible">
      <el-dialog title="添加规格" :visible.sync="innerVisible" append-to-body>
        <el-form :rules="specsFormrules" :model="specsForm" prop="specs">
          <el-form-item label="食品名稱" label-width="100px">
            <el-input v-model="specsForm.specs" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="包裝費" label-width="100px">
            <el-input-number v-model="specsForm.packing_fee" :min="1" :max="100"></el-input-number>
          </el-form-item>
          <el-form-item label="價格" label-width="100px">
            <el-input-number v-model="specsForm.price" :min="1" :max="100"></el-input-number>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false">取 消</el-button>
          <el-button type="primary" @click="addSpecs">確定</el-button>
        </div>
      </el-dialog>
      <el-form :model="selectTable">
        <el-form-item label="食品名稱" label-width="100px">
          <el-input v-model="selectTable.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="食品介紹" label-width="100px">
          <el-input v-model="selectTable.description"></el-input>
        </el-form-item>
        <el-form-item label="食品分類" label-width="100px">
          <el-select v-model="selectIndex" :placeholder="selectMenu.label" @change="handleSelect">
            <el-option v-for="(item,index) in menuOptions" :key="index" :label="item.label" :value="item.index">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商铺图片" label-width="100px">
          <el-upload class="upload-demo" :action="baseUrl+'/v1/addimg/shop'" :on-success="handleSuccess" :before-upload="beforeUpload" :show-file-list="false">
            <img v-if="selectTable.image_path" :src="baseImgPath+selectTable.image_path" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <el-row style="overflow:auto,text-align:center">
        <el-table :data="specs" style="margin-bottom:20px">
          <el-table-column label="規格" prop="specs">
          </el-table-column>
          <el-table-column label="包裝費" prop="packing_fee">
          </el-table-column>
          <el-table-column label="價格" prop="price">
          </el-table-column>
          <el-table-column label="操作">
            <div slot-scope="scope">
              <el-button size="mini" type="danger" @click="deleteSpecs(scope.$index)">删除</el-button>
            </div>
          </el-table-column>
        </el-table>
        <el-button type="primary" @click="innerVisible=true" class="addSpecs">
          添加規格
        </el-button>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="outerVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateFood">確定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { baseUrl, baseImgPath } from "@/config/env";
import {
  getFoods,
  getFoodsCount,
  getMenu,
  getMenuById,
  updateFood,
  deleteFood,
  getResturantDetail
} from "@/api/getData";
export default {
  data() {
    return {
      baseUrl,
      baseImgPath,
      restaurant_id: "",
      city: {},
      tableData: [],
      selectTable: {},
      offset: 0,
      currentPage: 1,
      limit: 20,
      total: 0,
      outerVisible: false,
      innerVisible: false,
      selectIndex: "",
      menuOptions: [],
      selectMenu:{},
      expendRow:[],
      specsForm: {
        specs: "",
        packing_fee: 0,
        price: 20
      },
      specsFormrules:{
        specs:[
          {required:true,message:'請輸入規格',trigger:'blur'}
        ]
      }
    };
  },
  created() {
    this.restaurant_id = this.$route.query.restaurant_id;
    this.initData();
  },
  computed: {
    specs:function() {
      let specs = [];
      if(this.selectTable.specfoods){
        this.selectTable.specfoods.forEach(item => {
          specs.push({
            specs:item.specs_name,
            packing_fee:item.packing_fee,
            price:item.price
          })
        })
      }
      return specs
    }
  },
  methods: {
    async initData() {
      try {
        const countData = await getFoodsCount({
          restaurant_id: this.restaurant_id
        });
        if (countData.status == 1) {
          this.total = countData.count;
        } else {
          throw new Error("獲取數據失敗");
        }
        this.getFoods();
      } catch (err) {
        console.log(err);
      }
    },
    async getMenu(){
      try {
        const menu = await getMenu({restaurant_id:this.selectTable.restaurant_id,allMenu:true});
        menu.forEach((item,index) => {
          this.menuOptions.push({
            label:item.name,
            value:item.id,
            index
          })
        })
      } catch(err){
        console.log(err)
      }
    },
    async getFoods() {
      const foods = await getFoods({
        offset: this.offset,
        limit: this.limit,
        restaurant_id: this.restaurant_id
      });
      foods.forEach(item => {
        const tableData = {};
        tableData.name = item.name;
        tableData.item_id = item.id;
        tableData.description = item.description;
        tableData.rating = item.rating;
        tableData.month_sales = item.month_sales;
        tableData.restaurant_id = item.restaurant_id;
        tableData.category_id = item.category_id;
        tableData.image_path = item.image_path;
        tableData.specfoods = item.specfoods;
        tableData.index = item.index;
        this.tableData.push(tableData);
      });
    },
    handleEdit(row) {
      this.outerVisible = true;
      this.getSelectItemData(row,'edit')
    },
    expand(row,status){
      if(status){
        this.getSelectItemData(row)
      }else{
        const index = this.expendRow.indexOf(row.index);
        this.expendRow.splice(index,1)
      }
    },
    async getSelectItemData(row,type){
      const restaurant = await getResturantDetail(row.restaurant_id);
      const category = await getMenuById(row.category_id);
      this.selectTable = {...row,...{restaurant_name:restaurant.name,restaurant_address:restaurant.address,
      category_name:category.name}};
      this.selectMenu = {label:category.name,value:row.category_id}
      this.tableData.splice(row.index,1,{...this.selectTable});
      this.$nextTick(()=>{
        this.expendRow.push(row.index)
      });
      if(type == 'edit' && this.restaurant_id != row.restaurant_id){
        this.getMenu()
      }
    },
    handleSuccess(res,file) {
      if(res.status == 1){
        this.selectTable.image_path = res.image_path
      }else{
        this.$message.error('上传图片失败')
      }
    },
    beforeUpload(file) {
      const isRightType = (file.type === 'image/jpeg') || (file.type === 'image/png');
      const isLt2M = file.size/1024/1024 < 2;
      if(!isRightType){
        this.$message.error('上传图片格式错误')
      }
      if(!isLt2M){
        this.$message.error('图片不能大于2M')
      }
      return isRightType && isLt2M
    },
    async updateFood() {
      this.outerVisible = false;
      try {
        const subData = {new_category_id:this.selectMenu.value,specs:this.specs};
        const postData = {...this.selectTable,...subData};
        const res = await updateFood(postData);
        console.log(res)
        if(res.status == 1){
          this.$message({
            type:'success',
            message:'更新信息成功'
          });
          this.getFoods()
        }else{
          this.$message({
            type:'error',
            message:res.message
          })
        }
      } catch(err){
        console.log('更新餐馆信息失败',err)
      }
    },
    addSpecs() {
      this.specs.push({...this.specsForm});
      this.specsForm.specs = '';
      this.specsForm.packing_fee = 0;
      this.specsForm.price = 20;
      this.innerVisible = false;
    },
    deleteSpecs(index){
      this.specs.splice(index,1)
    },
    handleSelect(index){
      this.selectIndex = index;
      this.selectMenu = this.menuOptions[index]
    },
    handleSizeChange(val) {
      this.limit = val;
      this.offset = (val-1)*this.limit;
      this.getFoods()
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.offset = (val-1)*this.limit;
      this.getFoods()
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
.addSpecs {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 10px;
}
.avatar-uploader-icon{
  font-size: 32px;
  font-weight: bold;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align:center;
  display:block;
  border: 1px dashed #000;
}
.avatar,{
  width: 120px;
  height: 120px;
  display:block;
}
</style>
