<template>
  <div>
    <el-card>
      <CategorySelector
        @changeCategory="changeCategory"
        :idShowAttrList="idShowAttrList"
      ></CategorySelector>
    </el-card>
    <!-- spu列表 -->
    
      <!-- 因为添加spu与修改sku  还有spu的列表页三者只能同时存在一个  故可以设置数据对这个控制 -->
      <el-card style="margin-top:20px">
        <div v-show="!isShowSpuFrom&& !isShowSkuForm">
          <el-button type="primary" icon="el-icon-plus" :disabled='!category3Id' @click="showSpuFrom">添加SPU</el-button>
        <el-table :data="spuList" border style="width: 100%">
          <el-table-column
            prop="prop"
            type="index"
            label="序号"
            align="center"
            width="80"
          >
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <myButton
                type="primary"
                icon="el-icon-plus"
                title="添加SKU"
                size="mini"
                @click="showSkuFrom"
              ></myButton>
              <myButton
                type="warning"
                icon="el-icon-edit"
                title="修改SPU"
                size="mini"
                @click="showUpdateSpuFrom(row)"
              ></myButton>
              <myButton
                type="info"
                icon="el-icon-info"
                title="查看SKU列表"
                size="mini"
              ></myButton>
              <myButton
                type="danger"
                icon="el-icon-delete"
                title="删除SPU"
                size="mini"
              ></myButton>
            </template>
          </el-table-column>
        </el-table>
        <!--   -->
        <el-pagination
          style="text-align:center"
          @size-change="handleSizeChange"
          @current-change="getSpuList"
          :current-page="limit"
          :page-sizes="[2, 3, 5]"
          :page-size="page"
          layout="prev, pager, next, jumper,->,sizes, total"
          :total="total"
        >
        </el-pagination>
        </div>
          <!-- 添加spu  为了后期好维护 一般会封装成单独的组件-->
        <SpuFrom v-show="isShowSpuFrom" ref="spu" :visible.sync='isShowSpuFrom'></SpuFrom>
        <!-- 修改sku -->
        <SkuFrom v-show="isShowSkuForm"></SkuFrom>
      </el-card>
  </div>
</template>

<script>
import SkuFrom from '@/views/product/components/skuFrom/skuFrom'
import SpuFrom from '@/views/product/components/spuFrom/spuFrom'
export default {
  name: "Spu",
  components:{
    SkuFrom,
    SpuFrom
  },
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      spuList: [],//spu的列表
      idShowAttrList: true,//控制3级联动按钮是否不可点击
      page: 1,
      limit: 3,
      total: 0,
      isShowSpuFrom:false,
      isShowSkuForm:false
    };
  },
  methods: {
    changeCategory(spu) {
      let { category, level } = spu;
      if (level === 1) {
        (this.category2Id = ""),
          (this.category3Id = ""),
          (this.spuList = []),
          (this.category1Id = category);
      } else if (level === 2) {
        this.category2Id = category;
        (this.category3Id = ""), (this.spuList = []);
      } else {
        this.category3Id = category;
        //获取3id之后 就可以发送请求获取数据列表了
        this.getSpuList();
      }
    },
    async getSpuList(pager = 1) {
      this.page = pager;
      let { page, limit, category3Id } = this;
      const result = await this.$API.spu.getSpuList(page, limit, category3Id);
      if (result.code === 200) {
        this.spuList = result.data.records;
        this.total = result.data.total;
      }
    },
    handleSizeChange(size) {
      this.limit = size;
      this.getSpuList();
    },
    //点击添加sku按钮
    showSkuFrom(){
       this.isShowSkuForm=true
       this.idShowAttrList=false
    },
    //点击新增spu按钮
    showSpuFrom(){
       this.isShowSpuFrom=true
       this.$refs.spu.initAddSpuFormData()
    },
      //点击修改spu按钮
    showUpdateSpuFrom(row){
       this.isShowSpuFrom=true
       this.$refs.spu.initUpdateSpuFormData(row)
    }
  }
};
</script>

<style lang="scss" scoped></style>
