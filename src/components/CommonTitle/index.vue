/* gg */
<template>
  <div class="card-title">
    <span>{{title[1]}}</span>
    <div>{{title[0]}}</div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: Array,
      default: ["中文标题", "YINWENBIAOTI"]
    }
  },
  data() {
    return {
      msg: "公共标题组件"
    };
  }
  // computed:{},
  // mounted(){}
};
</script>

<style scoped lang='scss'>
.card-title {
  text-align: left;
  span {
    font-size: 26px;
    color: rgba(255, 255, 255, 0.1);
  }
  div {
    font-size: 18px;
    line-height: 35px;
  }
}
</style>

