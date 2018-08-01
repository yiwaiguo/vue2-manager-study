<template>
  <div>
    <head-top></head-top>
    <el-row :gutter="20" style="margin-top:20px">
      <el-col :span="12" :offset="6">
        <el-form ref="form" :model="form" label-width="80px" :rules="rules" :ref="form2">
          <el-form-item label="店铺名称" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="店铺地址" prop="address">
            <el-autocomplete
  v-model="form.address"
  :fetch-suggestions="querySearchAsync"
  placeholder="请输入内容"
  @select="addressSelect"
></el-autocomplete>
            <span>当前城市：{{city.name}}</span>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model.number="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="店铺介绍">
            <el-input v-model="form.description"></el-input>
          </el-form-item>
          <el-form-item label="店铺标语">
            <el-input v-model="form.promotion_info"></el-input>
          </el-form-item>
          <el-form-item label="店铺分类">
            <el-cascader :options="categoryOptions" v-model="selectedOptions" change-on-select></el-cascader>
          </el-form-item>
          <el-form-item label="店铺特点">
            <span>品牌保证</span>
            <el-switch v-model="form.pinpai"></el-switch>
            <span>蜂鸟专送</span>
            <el-switch v-model="form.delivery"></el-switch>
            <span>新开店铺</span>
            <el-switch v-model="form.new"></el-switch>
          </el-form-item>
          <el-form-item>
            <span>外卖保</span>
            <el-switch v-model="form.bao"></el-switch>
            <span>准时达</span>
            <el-switch v-model="form.zhun"></el-switch>
            <span>开发票</span>
            <el-switch v-model="form.piao"></el-switch>
          </el-form-item>
          <el-form-item label="配送费">
            <el-input-number v-model="form.float_delivery_fee" :min="0" :max="20"></el-input-number>
          </el-form-item>
          <el-form-item label="起送价">
            <el-input-number v-model="form.float_minimum_order_amount" :min="0" :max="100"></el-input-number>
          </el-form-item>
          <el-form-item label="营业时间">
            <el-time-select v-model="form.startTime" :picker-options="{
    start: '05:30',
    step: '00:15',
    end: '23:30'
  }" placeholder="起始时间">
            </el-time-select>
            <el-time-select v-model="form.endTime" :picker-options="{
    start: '05:30',
    step: '00:15',
    end: '23:30'
  }" placeholder="结束时间">
            </el-time-select>
          </el-form-item>
          <el-form-item label="上传店铺头像">
            <el-upload class="avatar-uploader"
            :action="baseUrl+'/v1/addimg/shop'"
            :show-file-list="false"
            :on-success="handleShopAvatarScucess"
            :before-upload="beforeAvatarUpload">
              <img
              v-if="form.image_path"
              :src="baseImgPath+form.image_path"
              class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="上传营业执照">
            <el-upload
            class="avatar-uploader"
            :action="baseUrl+'/v1/addimg/shop'"
            :show-file-list="false"
            :on-success="handleBusinessAvatarScucess"
            :before-upload="beforeAvatarUpload">
              <img
              v-if="form.business_license_image"
              :src="baseImgPath+form.business_license_image"
              class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="上传餐饮服务许可证">
            <el-upload
            class="avatar-uploader"
            :action="baseUrl+'/v1/addimg/shop'"
            :show-file-list="false"
            :on-success="handleServiceAvatarScucess"
            :before-upload="beforeAvatarUpload">
              <img
              v-if="form.catering_service_license_image"
              :src="baseImgPath+form.catering_service_license_image" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="优惠活动">
            <el-select v-model="activityValue" placeholder="activityValue" @change="selectActivity">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-table class="activityTable" :data="activityData" style="width: 100%">
            <el-table-column prop="icon_name" label="活动标题" width="120">
            </el-table-column>
            <el-table-column prop="name" label="活动名称" width="120">
            </el-table-column>
            <el-table-column prop="description" label="活动详情" width="120">
            </el-table-column>
            <el-table-column label="操作">
              <div slot-scope="scope">
                <el-button size="small" type="danger" @click="handleDelete(scope.$index)">
                删除
              </el-button>
              </div>
            </el-table-column>
          </el-table>

          <el-form-item class="button_submit">
            <el-button type="primary" @click="onSubmit('form2')">立即创建</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { cityGuess, searchplace, addShop, foodCategory } from "@/api/getData";
import { baseUrl, baseImgPath } from "@/config/env";
export default {
  data() {
    return {
      city: {},
      tableData: [],
      categoryOptions: [],
      selectedOptions: ["快餐便当", "简餐"],
      activityValue: "满减优惠",
      baseUrl,
      baseImgPath,
      form2:'form2',
      form: {
        name: "",
        address:'',
        region: "",
        date1: "",
        date2: "",
        delivery: true,
        pinpai: true,
        zhun: true,
        piao: true,
        type: [],
        resource: "",
        desc: "",
        description: "",
        promotion_info: "",
        float_delivery_fee: 5,
        float_minimum_order_amount: 20,
        startTime: "",
        endTime: "",
        imageUrl:'',
        latitude:'',
        longitude:'',
        image_path:'',
        business_license_image:'',
        catering_service_license_image:''

      },
      rules: {
        name: [{ required: true, message: "请输入店铺名称", trigger: "blur" }],
        address: [
          { required: true, message: "请输入店铺地址", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请输入联系电话" },
          { type: "number", message: "电话号码必须是数字" }
        ]
      },
      options:[
        {
          value:'满减优惠',
          label:'满减优惠'
        },
        {
          value:'优惠大酬宾',
          label:'优惠大酬宾'
        },
        {
          value:'新用户立减',
          label:'新用户立减'
        },
        {
          value:'进店领券',
          label:'进店领券'
        }

      ],
      activityData:[
        {
          icon_name:'减',
          name:'满减优惠',
          description:'满30减5，满60减8'
        }
      ]
    };
  },
  mounted(){
    this.initData()
  },
  methods: {
    async initData(){
      try{
        this.city = await cityGuess();
        const categories = await foodCategory();
        categories.forEach(item => {
          if(item.sub_categories.length){
            const addNew = {
              value:item.name,
              label:item.name,
              children:[]
            }
            item.sub_categories.forEach((subItem,index) =>{
              if(index == 0){
                return
              }
              addNew.children.push({
                value:subItem.name,
                label:subItem.name
              })
            })
            this.categoryOptions.push(addNew)
          }
        })
      }catch(err){
        console.log(err)
      }
    },
    async querySearchAsync(queryString,cb){
      if(queryString){
        try{
          const cityList = await searchplace(this.city.id,queryString);
          if(cityList instanceof Array){
            cityList.map(item =>{
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
    addressSelect(address){
      this.form.latitude = address.latitude
      this.form.longitude = address.longitude
    },
    onSubmit(formName) {
      this.$refs[formName].validate(async (valid)=>{
        if(valid){
          Object.assign(this.form,{activityData:this.activityData},{
            category:this.selectedOptions.join('/')
          })
          try{
            let result = await addShop(this.form);
            if(res.status == 1){
              this.$message({
                type:'success',
                message:'添加成功'
              });
              this.form = {
        name: "",
        address:'',
        region: "",
        date1: "",
        date2: "",
        delivery: true,
        type: [],
        resource: "",
        desc: "",
        description: "",
        promotion_info: "",
        float_delivery_fee: 5,
        float_minimum_order_amount: 20,
        startTime: "",
        endTime: "",
        imageUrl:'',
        latitude:'',
        longitude:'',
        image_path:'',
        business_license_image:'',
        catering_service_license_image:''

      };
      this.activityData=[
        {
          icon_name:'减',
          name:'满减优惠',
          description:'满30减5，满60减8'
        }
      ];
      this.selectedOptions=["快餐便当", "简餐"]

            }else{
              this.$message({
                type:'error',
                message:result.message
              })
            }
          }catch(err){
            console.log(err)
          }
        }else{
          this.notify.error({
            title:'错误',
            message:'请检查输入是否正确',
            offset:100
          })
          return false
        }
      })
    },
    handleShopAvatarScucess(res,flie){
      if(res.status == 1){
        this.form.image_path = res.image_path
      }else{
        this.$message.error('上传图片失败')
      }
    },
    handleBusinessAvatarScucess(res,file){
      if(res.status == 1){
        this.form.business_license_image = res.image_path
      }else{
        this.$message.error('上传图片失败')
      }
    },
    handleServiceAvatarScucess(res,file){
      if(res.status == 1){
        this.form.catering_service_license_image = res.image_path
      }else{
        this.$message.error('上传图片失败')
      }
    },
    beforeAvatarUpload(file){
      const isRightType = (file.type === 'image/jpeg') || (file.type === 'image/png');
      const isLt2M = file.size/1024/1024 < 2;
      if(!isRightType){
        this.$message.error('上传图片格式不对')
      };
      if(!isLt2M){
        this.$message.error('上传图片不能大于2M')
      }
      return isRightType && isLt2M
    },
    selectActivity(){
      this.$prompt('请输入活动详情','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消'
      }).then(({value})=>{
        if(value == null){
          this.$message({
            type:'info',
            message:'请输入活动详情'
          })
          return
        }
        let newObj = {}
        switch(this.activityValue){
          case '满减优惠':
          newObj = {
            icon_name: '减',
					        	name: '满减优惠',
					        	description: value,
          }
          break;
          case '优惠大酬宾':
          newObj = {
            icon_name: '特',
					        	name: '优惠大酬宾',
					        	description: value,
          }
          break;
          case '新用户立减':
          newObj = {
            icon_name: '新',
					        	name: '新用户立减',
					        	description: value,
          }
          break;
          case '进店领券':
          newObj = {
            icon_name: '领',
					        	name: '进店领券',
					        	description: value,
          }
          break;
        }
        this.activityData.push(newObj)
      }).catch(()=>{
        this.$message({
          type:'info',
          message:'取消输入'
        })
      })
    },
    handleDelete(index){
      this.activityData.splice(index,1)
    }
  }
};
</script>

<style lang="less" scoped>
@import "../style/base";
.button_submit {
  text-align: center;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
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
.activityTable {
  border: 1px solid #eee;
  margin-bottom: 20px;
  color: #000;
}
</style>
