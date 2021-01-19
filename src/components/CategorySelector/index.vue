<template>
  <div>
    <el-form :inline="true" :model="cForm" class="demo-form-inline" :disabled='!idShowAttrList'>
      <el-form-item label="一级分类">
        <el-select v-model="cForm.category1Id" placeholder="请选择" @change="changeCategory1Id">
          <el-option v-for="c1 in getCategory1List" :key="c1.id" :label="c1.name" :value="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="cForm.category2Id" placeholder="请选择" @change="changeCategory2Id">
          <el-option v-for="c2 in getCategory2List" :key='c2.id' :label="c2.name" :value="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="cForm.category3Id" placeholder="请选择" @change="changeCategory3Id" >
          <el-option v-for="c3 in getCategory3List" :key='c3.id' :label="c3.name" :value="c3.id"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelector",
  props:['idShowAttrList'],
   data() {
      return {
        cForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
      getCategory1List:[],
      getCategory2List:[],
      getCategory3List:[]
      }
    },
    mounted(){
        this.getCategory1()
    },
    methods: {
        async getCategory1(){
        const result=await this.$API.category.reqgetCategory1()
            if(result.code===200){
                this.getCategory1List=result.data
            }    
        },
      async changeCategory1Id(){
          //当1级分类变化时  后面的23级要清空随着1级变化而发送请求
          this.cForm.category2Id= ""
          this.cForm.category3Id= ""
          this.getCategory2List=[]
          this.getCategory3List=[]
          //只有获取了1Id  才会发送请求获取2Id
          const {category1Id} = this.cForm
        const result = await this.$API.category.reqgetCategory2(category1Id)
        if(result.code===200){
            this.getCategory2List=result.data
            //同时需要将id传递给父组件 
            this.$emit('changeCategory',{category:category1Id,level:1})
        } 

      },
      async changeCategory2Id(){
           //当2级分类变化时  后面的3级要清空随着1级变化而发送请求
          this.cForm.category3Id= ""
          this.getCategory3List=[]
            //只有获取了1Id  才会发送请求获取2Id
        const {category2Id} = this.cForm
        const result = await this.$API.category.reqgetCategory3(category2Id)
        if(result.code===200){
            this.getCategory3List=result.data
            this.$emit('changeCategory',{category:category2Id,level:2})
        } 
      },
      changeCategory3Id(){
          //如果3级分类也选中后 则需要展示下面的属性列表  此时需要用到组件间通信 因为在不同的组件 
          //相当于子给父传递数据  可以使用自定义或者prop函数
          const {category3Id}=this.cForm
          this.$emit('changeCategory',{category:category3Id,level:3})
      },
    }
  
};
</script>

<style lang="less" scoped></style>
