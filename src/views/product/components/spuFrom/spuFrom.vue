<template>
  <div>
    <el-form :model="spuForm" label-width="80px">
      <el-form-item label="SPU名称">
        <el-input v-model="spuForm.spuName" placeholder="SPU名称"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select v-model="spuForm.tmId" placeholder="请选择品牌">
          <!-- value='value' -->
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="tm in trademarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          v-model="spuForm.description"
          rows="4"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 如果使用照片墙 图片列表中格式必须包含[{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
        我们的图片列表数据中没有 -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :file-list="spuImageList"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleAvatarSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select :placeholder="unUsedSpuSaleAttrList.length>0?`还有${unUsedSpuSaleAttrList.length}个未选择`:'没有了!!'"
           v-model="spuSaleAttrIdName">
           <!-- 当未选中的某一项被选则时  需要收集id和name -->
          <el-option
            :label="saleAttr.name"
            :value="`${saleAttr.id}:${saleAttr.name}`"
            v-for="saleAttr in unUsedSpuSaleAttrList"
            :key="saleAttr.id"
          ></el-option>
          <!-- <el-option label="区域二" value="beijing"></el-option> -->
        </el-select>
        <el-button type="primary" icon="el-icon-plus" @click="addSaleAttr" :disabled='!spuSaleAttrIdName'
          >添加销售属性</el-button
        >
        <!-- :data="data" -->
        <el-table
          :data="spuForm.spuSaleAttrList"
          border
          style="width: 100%;margin:20px 0"
        >
          <el-table-column
            prop="prop"
            type="index"
            align="center"
            label="序号"
            width="80"
          >
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称">
            <template slot-scope="{ row, $index }">
              <!-- @close="handleClose(tag)" -->
              <el-tag
                closable
                :disable-transitions="false"
                v-for="(spuSaleAttr, index) in row.spuSaleAttrValueList" :key="spuSaleAttr.id"
              >
                {{ spuSaleAttr.saleAttrValueName }}
              </el-tag>
                <!-- @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm" -->
                <!-- inputVisible这个数据是判断是否是编辑模式  每个属性只有一个是编辑模式  
                所以我们将这个数据直接挂在row身上 品牌属性是因为每个属性值都有两种模式 所以在添加的时候给
                每个属性值都增加了编辑模式和查看模式 -->
                <!--  inputValue自动收集的数据也是  先放在row身上  等到失去焦点或者用户回车时  我们在从row身上拿-->
                <!--   -->
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                placeholder="名称"
                size="small"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(row)"
                >+ 新增</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <MyButton
                type="danger"
                icon="el-icon-delete"
                size="mini"
                title="删除"
              ></MyButton>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary">保存</el-button>
        <el-button @click="$emit('update:visible', false)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "spuFrom",
  data() {
    return {
      spuForm: {
        // 这个里面初始化的所有数据，都是为了添加的时候收集所需要的
        //如果修改spu,是将获取到的spu详情数据，直接覆盖这里面的所有
        category3Id: 0,
        spuName: "",
        description: "",
        tmId: "",
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   isChecked: "string",
          //   saleAttrName: "string",
          //   saleAttrValueName: "string",
          //   spuId: 0,
          // },
          //   ],
          // },
        ]
      },
      //上面两个是上传图片用的
      dialogImageUrl: "",
      dialogVisible: false,
      //准备用来收集销售属性id
      spuSaleAttrIdName: "",
      spuImageList: [], //根据id获取的图片列表
      trademarkList: [], //所有的品牌列表
      saleAttrList: [] //所有的spu销售属性列表
    };
  },
  methods: {
    //处理图片上传的函数  删除图片的回调
    //删除图片的回调
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.spuImageList = fileList;
    },
    //预览大图的回调
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;//控制的是图片墙下面的dialog  改为true会出来对话框  里面放的是大图
    },
    //上传图片成功的图片
    handleAvatarSuccess(response, file, fileList){
       this.spuImageList = fileList;
    },
    //发送请求  点击修改页面初始化请求
    async initUpdateSpuFormData(spu) {
      //在这里页面一上来就需要发送4个请求  根据已完结项目的network查看
      //http://localhost:9529/dev-api/admin/product/getSpuById/4  根据商品id获取spu的详情
      //http://localhost:9529/dev-api/admin/product/spuImageList/4 根据id获取商品的图片
      //http://localhost:9529/dev-api/admin/product/baseTrademark/getTrademarkList  获取所有的品牌列表
      //http://localhost:9529/dev-api/admin/product/baseSaleAttrList 获取spu的所有销售属性
      //根据商品id获取spu的详情
      const result = await this.$API.spu.get(spu.id);
      if (result.code === 200) {
        this.spuForm = result.data;
      }
      //获取id的图片列表
      const imgResult = await this.$API.sku.getSpuImageList(spu.id);
      if (imgResult.code === 200) {
        //在这里整理数据  因为图片墙要求内部必须含有name  url数据  而我们的数据内部没有
        //需要重新整理
        let spuImageList = imgResult.data;
        spuImageList.forEach(item => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });

        this.spuImageList = spuImageList;
      }
      //获取所有的品牌列表
      const trademarkresult = await this.$API.trademark.getList();
      if (trademarkresult.code === 200) {
        this.trademarkList = trademarkresult.data;
      }
      //获取所有的spu销售属性
      const spuAttrResult = await this.$API.spu.getSaleAttrList();
      if (spuAttrResult.code === 200) {
        this.saleAttrList = spuAttrResult.data;
      }
    },
    //发送请求  点击新增spu页面初始化请求
    async initAddSpuFormData() {
      //在这里页面一上来就需要发送2个请求  根据已完结项目的network查看
      //http://localhost:9529/dev-api/admin/product/baseTrademark/getTrademarkList  获取所有的品牌列表
      //http://localhost:9529/dev-api/admin/product/baseSaleAttrList 获取spu的所有销售属性
      //获取所有的品牌列表
      const trademarkresult = await this.$API.trademark.getList();
      if (trademarkresult.code === 200) {
        this.trademarkList = trademarkresult.data;
      }
      //获取所有的spu销售属性
      const spuAttrResult = await this.$API.spu.getSaleAttrList();
      if (spuAttrResult.code === 200) {
        this.saleAttrList = spuAttrResult.data;
      }
    },
    //点击添加销售属性
    addSaleAttr() {
      let [baseSaleAttrId,saleAttrName]=this.spuSaleAttrIdName.split(':')
      // console.log(id,name);
      //创建一个属性的对象  将属性对象放入已选择的属性列表中  
      // 对象结构从接口文档中找或者看已返回的数据结构
      // baseSaleAttrId:1
      // id:7
      // saleAttrName:"颜色"
      // spuId:4
      //spuSaleAttrList:[]//方便后期添加属性值
      let obj = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrList:[]
      }
      this.spuForm.spuSaleAttrList.push(obj)//添加属性值
      //清空属性名
      this.spuSaleAttrIdName=''
    },
    //点击属性值中的添加 切换为input模式  添加销售属性值
    showInput(row){
      //添加到哪? spuForm---spuSaleAttrValueList
      //添加的结构是? 对象
          //{
          //   baseSaleAttrId: 0,  添加的时候不需要
          //   id: 0,    添加的时候不需要
          //   isChecked: "string", 添加的时候不需要
          //   saleAttrName: "string",  在属性名称中已收集 不需要
          //   saleAttrValueName: "string",  最终只要这个就行
          //   spuId: 0,  添加的时候不需要
          // },
      //最终收集?  saleAttrValueName: "string",
      //因为点击是  需要将属性值变为input  input控制按钮收集是放在row身上了  row.inputVisible
      // 改变数据为响应式的  此时必须要用到$set
      this.$set(row,'inputVisible',true)
      //自动获取焦点
      this.$nextTick(()=>{
          this.$refs.saveTagInput.focus()
          //输入的属性值已经通过v-model收集到row.inputValue  
      })
    
    },
    //input失去焦点和回车事件回调
    handleInputConfirm(row){
      console.log(row);
      let saleAttrValueName=row.inputValue
      let baseSaleAttrId=row.baseSaleAttrId
      //判断用户输入合法性
      if(saleAttrValueName.trim()===''){
        //清除输入框
        row.inputValue=''
        return
      }
      //判断重复性
      let isRepeat=row.spuSaleAttrValueList.some(
        (item) => item.saleAttrValueName === saleAttrValueName
      );
      if(isRepeat){
        this.$message.info('输入属性值不能重复')
         row.inputValue=''
         return
      }
      //属性值也需要构造一个对象 
      // 结构为
       //添加的结构是? 对象
          //{
          //   saleAttrValueName: "string",  最终只要这个就行
          // },
      let obj={saleAttrValueName,baseSaleAttrId};
      //将对象放入到对应的属性值列表中
      row.spuSaleAttrValueList.push(obj);
      //需要把原来input内部输入的值清空
      row.inputValue='';
      //让input变为不可编辑状态
      row.inputVisible=false
    }
  },
  computed: {
    //计算销售属性中剩余未用的属性
    unUsedSpuSaleAttrList(){
     return this.saleAttrList.filter(baseAttr=>{
       return this.spuForm.spuSaleAttrList.every(spuAttr=>{
          return baseAttr.name !== spuAttr.saleAttrName
        })  
      })
    }
  }
};
</script>

<style  scoped>
.el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
