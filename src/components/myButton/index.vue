<template>
<!--   
    <el-tooltip
      class="item"
      :content="title"
      placement="top"
    >
      <el-button  v-bind="$attrs"
      v-on="$listeners"></el-button>
    </el-tooltip> -->
    <a href="javascript:;" :title="title" style="margin:0 5px;">
      <el-button  v-bind="$attrs" v-on="$listeners"></el-button>
    </a>
    <!-- <el-button type="primary" icon="el-icon-edit" circle></el-button>
  <el-button type="success" icon="el-icon-check" circle></el-button>
  <el-button type="info" icon="el-icon-message" circle></el-button>
  <el-button type="warning" icon="el-icon-star-off" circle></el-button>
  <el-button type="danger" icon="el-icon-delete" circle></el-button> -->

</template>

<script>
export default {
  name: "MyButton",
  props: ["title"]
};
</script>

<style lang="less" scoped></style>
