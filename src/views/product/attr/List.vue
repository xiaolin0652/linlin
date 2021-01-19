<template>
  <div>
    <el-card shadow="always">
      <CategorySelector @changeCategory="changeCategory" :idShowAttrList='idShowAttrList'></CategorySelector>
    </el-card>
    <el-card shadow="always" style="margin-top:20px">
      <div v-show="idShowAttrList">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <!-- :data="tableData" -->
        <el-table :data="attrList" border style="width: 100%">
          <el-table-column type="index" width="100" label="序号" align="center">
          </el-table-column>
          <el-table-column
            prop="attrName"
            property="date"
            label="属性名称"
            width="150"
          >
          </el-table-column>
          <el-table-column property="name" label="属性值列表">
            <!-- 写属性列表 -->
            <template slot-scope="{ row, $index }">
              <el-tag
                type="info"
                v-for="value in row.attrValueList"
                :key="value.id"
                >{{ value.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <!-- <el-button type="primary" icon="el-icon-edit" size="mini"></el-button> -->
            <!-- <el-button type="danger" icon="el-icon-delete" size="mini"></el-button> -->
            <template slot-scope="{ row, $index }">
              <MyButton
                type="primary"
                icon="el-icon-edit"
                size="mini"
                title="修改"
                @click="updataAttr(row)"
              ></MyButton>
              <el-popconfirm :title="`确认删除${row.attrName}吗`">
              <MyButton
                slot="reference"
                type="danger"
                icon="el-icon-delete"
                size="mini"
                title="删除"
                @click="deleteattr(row)"
              ></MyButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!idShowAttrList">
        <el-form :model="attrFrom" :inline="true">
          <el-form-item label="属性名">
            <el-input
              v-model="attrFrom.attrName"
              placeholder="请输入属性名称"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrFrom.attrName"
          @click="showAddAttrvalueDiv"
          >添加属性值</el-button
        >
        <el-button @click="idShowAttrList = true">取消</el-button>
        <el-table :data="attrFrom.attrValueList" border style="margin:20px 0">
          <el-table-column
            label="序号"
            type="index"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <template slot-scope="{ row, $index }">
              <el-input
                v-if="row.isEdit"
                :ref="$index"
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                @blur="tolook(row)"
                @keyup.enter.native="tolook(row)"
              ></el-input>
              <span
                @click="toEdit(row, $index)"
                v-else
                style="display:block;height:100%"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                :title="`确定删除${row.valueName}吗`"
                @onConfirm="attrFrom.attrValueList.splice($index,1)"
              >
                <MyButton
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除"
                ></MyButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrFrom.attrValueList.length"
          @click="save"
          >保存</el-button
        >
        <el-button @click="idShowAttrList = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrList: [],
      attrValueList: [],
      idShowAttrList: true,
      attrFrom: {
        attrName: "",
        attrValueList: [],
        categoryId: 0,
        categoryLevel: 3
      }
    };
  },
  methods: {
     changeCategory(attr) {
      //在这里接收CategorySelector传递过来的分类id  只有当3个id同时存在时  才会发送请求获取属性列表
      const { category, level } = attr;
      if (level === 1) {
        (this.category2Id = ""), (this.category3Id = ""), (this.attrList = []);
        this.category1Id = category;
      } else if (level === 2) {
        (this.category3Id = ""), (this.attrList = []);
        this.category2Id = category;
      } else {
        this.category3Id = category;
        this.getAttrList()
      }
      
    },
    //获取属性列表
    async getAttrList(){
      //只有3个同时存在  可以发送请求获取属性列表
      const { category1Id, category2Id, category3Id } = this;
      if (category1Id && category2Id && category3Id) {
        const result = await this.$API.attr.getAttrList(
          category1Id,
          category2Id,
          category3Id
        );
        if (result.code === 200) {
          this.attrList = result.data;
          this.attrValueList = result.data.attrValueList;
        }
      }
    },
    //点击属性列表中的添加属性按钮
    addAttr() {
      this.idShowAttrList = false;
      //清空添加的信息
      this.attrFrom = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id,
        categoryLevel: 3
      };
      
    },
    //点击新增属性中的添加属性值按钮
    showAddAttrvalueDiv() {
      this.attrFrom.attrValueList.push({
        attrId: this.attrFrom.id,
        valueName: "",
        //因为有两只默认 一种input框编辑模式  一种span不可编辑默认  故 添加属性的时候要打标识
        isEdit: true //新增的时候默认都是可编辑默认
      });
      //自动获取焦点逻辑
      //在新增属性值时  会使用input编辑默认 需要自动获取焦点
      this.$nextTick(() => {
        this.$refs[this.attrFrom.attrValueList.length - 1].focus();
      });
    },
    //点击属性列表中的修改按钮
    updataAttr(row) {
      this.idShowAttrList = false;
      //清空数据  此时需要深度拷贝出一个新的attrFrom 因为如果不使用深拷贝 会直接修改属性值内容
      this.attrFrom = cloneDeep(row); //使用ladash上的cloneDeep方法  可以实现深拷贝
      //给每个属性值都打一个标识
      this.attrFrom.attrValueList.forEach(item => {
        // item.isEdit=false//不能直接使用  因为data中的数据是响应式的  后面添加的属性不是响应式的
        //必须要使用vue.set或者this.$set设置的属性才是响应式的
        this.$set(item, "isEdit", false);
      });
    },
    //给属性值绑定失去焦点与回车事件  从input变为span
    tolook(row) {
      //相当于将isEdit  改为false  就是查看模式  将input变为span  但是要判断用户输入的合法性
      //判断用户是否输入为空
      let valueName = row.valueName;
      if (!valueName.trim()) {
        this.$message.info("输入的属性值不能为空");
        row.valueName = ""; //清空输入不合法数据
        return;
      }
      //判断用户输入是否重复  拿用户输入的属性值与属性列表中除了自身的属性值对比
      let isRepeat = this.attrFrom.attrValueList.some(item => {
        if (item !== row) {
          return item.valueName === valueName;
        }
      });
      if (isRepeat) {
        this.$message.info("输入的属性值不能重复");
        row.valueName = ""; //清空输入不合法数据
        return;
      }

      row.isEdit = false;
    },
    //从span变为input
    toEdit(row, index) {
      row.isEdit = true;
      //调用focus()可以让input自动获取焦点  但是直接这么写是不行的 因为去input是通过vif控制的
      //此时标签开始创建  然后直接去获取焦点  太快了  拿不到节点元素  故可以使用$nextTick方法
      //$nextTick方式是在页面最近一次更新后调用
      //  this.$nextTick(()=>{
      //    this.$refs[index].focus();
      //  })
      this.$nextTick(() => {
        //等待页面最近更新完成之后再去获取input进行获取焦点
        this.$refs[index].focus();
      });
    },
    //点击保存
    async save(){
      //获取参数
      let attr = this.attrFrom
      //整理参数
      //在提交之前判断用户输入属性值是否为空  如果有空的 需要剔除
      attr.attrValueList=attr.attrValueList.filter((item)=>{
        if(item.valueName !== ''){
          delete item.isEdit
          return true
        }
      })
      //判断用户提交的属性值列表是否为空
      if(attr.attrValueList.length === 0) return
      //发送请求
      try {
        //成功逻辑
        await this.$API.attr.addOrUpdataAttr(attr)
        this.$message.success('保存成功')
        //返回到列表页
        this.idShowAttrList=true
        //发送请求
         this.getAttrList()
      } catch (error) {
        //失败逻辑
         this.$message.error('保存失败')
      }
    },
    async deleteattr(row){
      try {
        await this.$API.attr.deleteAttr(row.id)
        this.$message.success('删除成功')
        this.getAttrList()
      } catch (error) {
        this.$message.error('删除成功')
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
