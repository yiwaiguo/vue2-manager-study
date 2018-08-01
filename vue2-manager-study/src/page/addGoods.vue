<template>
  <div>
    <head-top></head-top>
    <el-row :gutter="20" style="margin-top:20px">
  <el-col :span="14" :offset="6">
    <header class="header">选择食品种类</header>
    <el-form  label-width="110px" :model="form" class="form" ref="form">
      <el-row class="category_select">
        <el-form-item label="食品种类">
      <el-select v-model="form.categorySelect" :placeholder="selectValue.label">
    <el-option
      v-for="item in form.categoryList"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
  </el-form-item>
      </el-row>
    <el-row class="add_category_row" :class="showAddCategory?'showEdit':''">
      <div class="add_category">
        <el-form-item label="食品种类" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="种类描述" prop="description">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item >
          <el-button type="primary" @click="submitForm('form')">提交</el-button>
        </el-form-item>
      </div>
    </el-row>
    <div class="add_category_button" @click="addCategoryFun">
      <i class="el-icon-caret-top edit_icon" v-if="showAddCategory"></i>
      <i class="el-icon-caret-bottom edit_icon" v-else ></i>
      <span>添加食品种类</span>
    </div>
</el-form>
  </el-col>
</el-row>

    <el-row :gutter="20" style="margin-top:20px">
  <el-col :span="12" :offset="6">
    <header class="header">添加食品</header>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="ruleForm">
  <el-form-item label="食品名称" prop="name">
    <el-input v-model="ruleForm.name"></el-input>
  </el-form-item>
  <el-form-item label="食品活动" prop="region">
    <el-input v-model="ruleForm.name"></el-input>
  </el-form-item>
  <el-form-item label="食品详情" prop="region">
    <el-input v-model="ruleForm.name"></el-input>
  </el-form-item>
  <el-form-item label="上传食品图片">
    <el-upload
  class="avatar-uploader"
  action="baseUrl+'/v1/addimg/food'"
  :show-file-list="false"
  :on-success="handleAvatarSuccess"
  :before-upload="beforeAvatarUpload">
  <img v-if="imageUrl" :src="imageUrl" class="avatar">
  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
</el-upload>
  </el-form-item>
  <el-form-item label="食品特点" prop="region">
    <el-select v-model="ruleForm.attributes" placeholder="请选择" mutiple>
    <el-option
      v-for="item in ruleForm.attributes"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
  </el-form-item>
  <el-form-item label="食品规格" >
    <el-radio v-model="foodSpecs" label="one">单规格</el-radio>
  <el-radio v-model="foodSpecs" label="more">多规格</el-radio>
  </el-form-item>

  <el-row v-if="foodSpecs == 'one'">
    <el-form-item label="包装费" prop="region">
    <el-input-number v-model="ruleForm.specs[0].packing_fee"  :min="0" :max="100"></el-input-number>
  </el-form-item>
  <el-form-item label="价格" prop="region">
    <el-input-number v-model="ruleForm.specs[0].price" :min="0" :max="10000"></el-input-number>
  </el-form-item>
  </el-row>
  <el-row v-else style="text-align:center">
    <el-form-item>
    <el-button type="primary" @click="dialogVisible = true">添加规格</el-button>
    <el-table
      :data="ruleForm.specs"
      style="width: 100%">
      <el-table-column
        prop="specs"
        label="规格">
      </el-table-column>
      <el-table-column
        prop="packing_fee"
        label="包装费">
      </el-table-column>
      <el-table-column
        prop="price"
        label="价格">
      </el-table-column>
       <el-table-column
        label="操作">
        <div slot-scope="scope">
          <el-button
          type="danger"
          size="small"
          @click="handleDelete(scope.$index)"
          >删除</el-button>
        </div>
      </el-table-column>
    </el-table>
  </el-form-item>
  </el-row>

  <el-form-item>
    <el-button type="primary" @click="submitRuleForm('ruleForm')">确认添加食品</el-button>
  </el-form-item>
</el-form>
<el-dialog
  title="添加规格"
  :visible.sync="dialogVisible">
  <el-form :model="specsForm" :rules="specsFormrules">
  <el-form-item label="规格" prop="specs">
    <el-input v-model="specsForm.specs"></el-input>
  </el-form-item>
  <el-form-item label="包装费">
    <el-input-number v-model="specsForm.packing_fee"  :min="0" :max="100"></el-input-number>
  </el-form-item>
  <el-form-item label="价格">
    <el-input-number v-model="specsForm.price" :min="0" :max="10000"></el-input-number>
  </el-form-item>
  <el-form-item>
    <el-button type="primary" @click="addSpecs">立即创建</el-button>
    <el-button @click="dialogVisible = false">取消</el-button>
  </el-form-item>
</el-form>
</el-dialog>
  </el-col>
</el-row>
  </div>
</template>

<script>
import {baseUrl,baseImgPath} from '@/config/env';
import {getCategory,addCategory,addFood} from '@/api/getData'
  export default {
    data() {
      return {
        form:{
          name:'',
          categorySelect:'',
          description:'',
          categoryList:[]
        },
        ruleForm: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
          attributes:[],
          image_path:'',
          specs:[{
            specs:'默认',
            packing_fee:0,
            price:20
          }]
        },
        specsForm:{
          specs:'',
          packing_fee:0,
          price:20
        },
        baseUrl,
        baseImgPath,
        restaurant_id:1,
        showAddCategory:false,
        imageUrl:'',
        foodSpecs:'one',
        dialogVisible:false,
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' }
          ],
        },
        specsFormrules:{}
      };
    },
    created(){
      if(this.$route.query.restaurant_id){
        this.restaurant_id = this.$route.query.restaurant_id
      }else{
        this.restaurant_id = Math.ceil(Math.random()*10);
        this.$msgbox({
          title:'提示',
          message:'添加食品需要选择一个商铺，先去就去选择商铺吗？',
          showCancelButton: true,
		          confirmButtonText: '确定',
              cancelButtonText: '取消',
              beforeClose:(action, instance, done)=>{
                if(action == 'confirm'){
                  this.$router.push('/shopList');
                  done()
                }else{
                  this.$message({
                    type:'info',
                    message:'取消'
                  });
                  done()
                }
              }
        })
      }
      this.initData()
    },
    computed:{
      selectValue(){
        return this.form.categoryList[this.form.categorySelect] || {}
      }
    },
    methods: {
      async initData(){
        try{
          const result = await getCategory(this.restaurant_id);
          if(result.status == 1){
            result.category_list.map((item,index) => {
              item.value = index;
              item.label = item.name
            })
            this.form.categoryList = result.category_list
          }else{
            console.log(result)
          }
        }catch(err){
          console.log(err)
        }
      },
      addCategoryFun(){
        this.showAddCategory = !this.showAddCategory;
      },
      submitForm(form) {
        this.$refs[form].validate(async (valid) => {
          if (valid) {
            const params = {
              name:this.form.name,
              description:this.form.description,
              restaurant_id:this.restaurant_id,
            };
            try{
              const result = await addCategory(params);
              if(result.status == 1){
                this.initData();
                this.form.name = '';
                this.form.description = '';
                this.showAddCategory = false;
                this.$message({
                  type:'success',
                  message:'添加成功'
                })
              }
            }catch(err){
              console.log(err)
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      submitRuleForm(ruleForm) {
        this.$refs[ruleForm].validate(async (valid) => {
          if (valid) {
            const params = {
              ...this.ruleForm,
							category_id: this.selectValue.id,
							restaurant_id: this.restaurant_id,
            }
            try{
              const result = await addFood(params);
              if(result.staus == 1){
                this.$message({
                  type:'success',
                  message:'添加成功'
                });
                this.ruleForm = {
				    				name: '',
				    				description: '',
				    				image_path: '',
				    				activity: '',
				    				attributes: [],
				    				specs: [{
				    					specs: '默认',
							          	packing_fee: 0,
							          	price: 20,
				    				}],
				    			}
              }else{
                this.$message({
                  type:'error',
                  message:result.message
                })
              }
            }catch(err){
              console.log(err)
            }
          } else {
            this.$notify.error({
              title:'错误',
              message:'请检查输入是否正确',
              offset:100
            });
            return false
          }
        });
      },
      addSpecs(){
        this.ruleForm.specs.push({...this.specsForm});
        this.specsForm.specs = '';
        this.specsForm.packing_fee = 0;
        this.specsForm.price = 20;
        this.dialogVisible = false
      },
      handleDelete(index){
        this.ruleForm.specs.splice(index,1)
      },
      handleAvatarSuccess(res, file) {
        if(res.status == 1){
          this.ruleForm.image_path = res.image_path
        }else{
          this.$message.error('上传图片失败')
        }
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      }
    }
  }
</script>

<style lang="less" scoped>
  @import '../style/base';
  .header{
    text-align: center;
    margin-bottom:10px;
  }
  .form,.ruleForm{
    min-width:400px;
    margin-bottom:10px;
    &:hover{
      box-shadow: 0 0 8px 0 rgba(232,237,250,.6),0 2px 4px 0 rgba(232,237,250,.5);
      border-radius:6px;
      transition:all 400ms;
    }
  }
  .ruleForm{
    border: 1px solid #eaeefb;
    padding: 10px 10px 0;
  }
  .category_select{
    border: 1px solid #eaeefb;
    padding:10px 30px 10px 10px;
    border-radius:6px 6px 0 0;
  }
  .add_category_row{
    height: 0;
    overflow: hidden;
    transition:all 400ms;
    background: #f9fafc;
  }
  .add_category{
    background: #f9fafc;
		padding: 10px 30px 0px 10px;
		border: 1px solid #eaeefb;
		border-top: none;
  }
  .showEdit{
    height: 185px;
  }
  .add_category_button{
    text-align: center;
    line-height: 40px;
    border-radius:0 0 6px 6px;
    border: 1px solid #eaeefb;
    border-top:none;
    transition:all 400ms;
    &:hover{
      background: #f9fafc;
      span, .edit_icon{
				color: #20a0ff;
      }
      span{
        font-size: 14px;
        color:#999;
        transition:all 400ms;
      }
      .edit_icon{
        color:#ccc;
        transition:all 400ms;
      }
    }
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
