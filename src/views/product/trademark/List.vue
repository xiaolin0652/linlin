<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="addTrademark"
      >添加</el-button
    >
    <!-- 表格 -->
    <el-table border :data="trademarkList" style="width: 100%;margin:20px 0px">
      <el-table-column align="center" type="index" label="序号" width="80">
      </el-table-column>
      <el-table-column label="品牌名称" prop="tmName"></el-table-column>
      <el-table-column label="品牌LOGO" prop="logoUrl">
        <!-- 只要数据的结构发生变化 就需要用到插槽  表格内部自带插槽 
        在父组件中只需要写 template slot-scope="{row, $index} 默认接收的参数  不能改-->
        <template slot-scope="{ row, $index }">
          <!-- row代表获取的数据列表  即 trademarkList  每一列都会对数据数组进行遍历 -->
          <img
            :src="row.logoUrl"
            alt=""
            srcset=""
            style="width:80px;height:60px"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="UpdateTrademark(row)"
            >修改</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
           @click="deletetrademark(row)" >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <!-- @size-change="handleSizeChange"
      @current-change="handleCurrentChange" -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="getTrademarkList"
      :current-page="page"
      :page-size="limit"
      :page-sizes="[3, 5, 7, 9]"
      layout=" prev, pager, next, jumper,->,sizes,total"
      :total="total"
      style="text-align:center"
    >
    </el-pagination>

    <!-- 点击添加按钮  弹出对话框 -->
    <el-dialog :title="trademark.id?'修改品牌':'添加品牌'" :visible.sync="dialogFormVisible">
      <el-form
        :model="trademark"
        :rules="rules"
        ref="trademark"
        style="width:80%"
      >
        <el-form-item label="活动名称" label-width="100px" prop="tmName">
          <el-input v-model="trademark.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="trademark.logoUrl"
              :src="trademark.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__text" >
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Trademark",
  data() {
    //单个单表数据的自定义验证
    var validatePass = (rule, value, callback) => {
      if (value.length <2 || value.length>10) {
        callback(new Error('长度必须为2-10个字符'));
      } else {
        callback();
      }
    }
    return {
      page: 1,
      limit: 3,
      trademarkList: [],
      total: 0,
      trademark: {
        tmName: "",
        logoUrl:''
      },
      dialogFormVisible: false,
      rules:{//单独对每一个表单信息校验  最后提交时  还需要整体校验
        tmName: [
          { required: true, message: '品牌名称为必填项', trigger: 'blur' },
          // { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }//element的检验
           //还可以自定义验证规则
           { validator: validatePass, trigger: 'blur' }
        ],
        logoUrl: [
          { required: true, message: '请上传品牌图片', trigger: 'blur' },

        ]
     }
    }

  },
  mounted() {
    this.getTrademarkList();
  },
  methods: {
    //获取商品列表
    async getTrademarkList(page = 1) {
      this.page = page;
      const result = await this.$API.trademark.getTrademarkList(
        this.page,
        this.limit
      );
      if (result.code === 200) {
        this.trademarkList = result.data.records;
        this.total = result.data.total;
      }
    },
    //更改分页器显示页数
    handleSizeChange(size) {
      this.limit = size;
      this.getTrademarkList();
    },
    //对话框中上传图片成功
    handleAvatarSuccess(res, file) {
      // console.log(res);为返回地址的数据
      // console.log(file);file为返回的图片相关整体信息  其中也包含图片地址

      this.trademark.logoUrl = res.data
    },
    //上传图片至数据库前对图片格式大小的检验
    beforeAvatarUpload(file) {
      let typeImgList=['image/jpeg','image/png']
      // const isJPGOrPNG = typeImg.indexOf(file.type) !== -1
      const isType=typeImgList.indexOf(file.type) !== -1
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isType) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isType && isLt2M;
    },
    //点击新增按钮
    async addTrademark(){
      this.dialogFormVisible=true,
      this.trademark.tmName=''
      this.trademark.logoUrl=''

    },
    //点击新增按钮中的确认
     addOrUpdate(){
      //整体检验所有的表单是否符合  符合的才走下面的步骤
      this.$refs.trademark.validate(async(valid) => {
          if (valid) {
            //如果有值
            //收集表单数据 并整理 根据判断收集到trademark中是否有id  判断是新增还是修改
            let trademark=this.trademark
            const result = await this.$API.trademark.addOrUpdataTrade(trademark)
              if(result.code===200){
                //先进行提示添加成功
                  this.$message.success(this.trademark.id?'修改品牌成功':'添加品牌成功')
                //退出对话框
                this.dialogFormVisible= false
                //添加成功之后默认返回第一页  如果是修改默认返回当前页  重新请求数据
                this.getTrademarkList(this.trademark.id?this.page:1);

              } else {
                  this.$message.info('检验失败');
                  return false;
                }
            }});
    },
    //点击修改按钮
    UpdateTrademark(row){
      this.dialogFormVisible=true,
      this.trademark={
        ...row//复制出来一个trademark  更改复制出来的对象 对原来没有影响

      }

    },
    deletetrademark(row) {
        this.$confirm(`此操作将删除${row.tmName}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          try {
             //点击确定的回调  发请求删除数据
          await this.$API.trademark.deleteTrade(row.id)
          this.$message.success('删除成功');
          // 重新发请求获取数据  如果获取的数据小于1  则跳转到前一页 如果获取的列表大于1  则请求当前页
          this.getTrademarkList(this.trademarkList.length>1?this.page:this.page-1);
          } catch (error) {
            this.$message.error('删除失败');
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  }
};
</script>

<style>
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
</style>
