<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="addTrademark"
      >添加</el-button
    >
    <el-table :data="trademarkList" border style="width: 100%;margin:20px 0px">
      <el-table-column prop="prop" label="序号" type="index" width="80">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <template slot-scope="{ row, $index }">
          <img
            :src="row.logoUrl"
            alt=""
            srcset=""
            style="width:80px;higth:60px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{row,$index}">
          <el-button type="warning" icon="el-icon-edit" size="mini"
         @click="updatedTrademark(row)" >修改</el-button
        >
        <el-button type="danger" icon="el-icon-delete" size="mini"
          >删除</el-button
        >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="getTrademarkList"
      :current-page="page"
      :page-sizes="[1, 3, 5]"
      :page-size="limit"
      layout=" prev, pager, next, jumper,->,sizes, total"
      :total="total"
      style="text-align:center"
    >
    </el-pagination>
    <!-- 点击添加 弹出对话框 -->
    <el-dialog title="添加品牌" :visible.sync="dialogFormVisible">
      <el-form :model="tmform" style="width:80%" :rules='rules'>
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmform.tmName" autocomplete="off" ></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
        <el-upload
          class="avatar-uploader"
          action="/dev-api/admin/product/fileUpload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="tmform.logoUrl" :src="tmform.logoUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate"
        >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    var validatePass = (rule, value, callback) => {
        if (value.length >2 &&value.length <10) {
          callback();
        } else {
          callback(new Error('品牌名称在2-10个字符'));
        }
      };
    return {
      page: 1,
      limit: 3,
      trademarkList: [],
      total: 0,
      tmform: {
        tmName: "",
        logoUrl: ""
      },
      dialogFormVisible: false,
       rules: {
          tmName: [
            { required: true, message: '请输入品牌名称', trigger: 'blur' },
            // { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
             { validator: validatePass, trigger: 'blur' }
          ],
          logoUrl:[
            { required: true, message: '请上传品牌logo', trigger: 'blur' },
          ]
       }
    };
  },
  mounted() {
    this.getTrademarkList();
  },
  methods: {
    async getTrademarkList(page = 1) {
      this.page = page;
      // const {page,limit}=this
      const result = await this.$API.trademark.getTrademarkList(
        this.page,
        this.limit
      );
      if (result.code === 200) {
        this.trademarkList = result.data.records;
        this.total = result.data.total;
      }
    },
    handleSizeChange(size) {
      this.limit = size;
      this.getTrademarkList();
    },
    handleAvatarSuccess(res, file) {
    this.tmform.logoUrl = res.data
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
    },
    addTrademark() {
      this.dialogFormVisible=true
      this.tmform.tmName= "",
      this.tmform.logoUrl= ""
    },
    updatedTrademark(row) {
      this.dialogFormVisible=true
      this.tmform={
        ...row
      }
    },
    addOrUpdate(){
      //点击对话框中的确定  代表可以往数据库发送请求了  ----*******
      const {tmform}=this
    }
  }
};
</script>

<style >
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
