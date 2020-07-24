<template>
  <div class="span-list">
    <span :class="isAll ? 'active':''" @click="checkAll">全部</span>
    <span
      @click="toggleCheck(item)"
      :class="item.checked ? 'active':''"
      v-for="(item,i) in list"
      :key="i"
    >{{ item.name }}</span>
  </div>
</template>

<script>
export default {
  name: "business",
  props: {
    list: {
      type: Array,
      default: []
    }
  },
  data() {
    var _self = this;
    return {
      isAll:false,
    };
  },
  mounted() {
    
  },
  
  watch:{
    list:{
      handler(nval){
        let isAll = nval.every((item)=>{
          return item.checked;
        })
        this.isAll = isAll;
      },
      deep:true,
    },
  },
  methods: {
    toggleCheck(item) {
      item.checked = !item.checked;
    },
    checkAll() {
      if (this.list && this.list.length > 0) {
        this.list.forEach(element => {
            element.checked = !this.isAll;
        });
      };

    }
  }
};
</script>
  
<style scoped lang='scss'>
.span-list {
  span {
    margin-right: 20px;
    color: #8aa5c6;
    cursor: pointer;
    &.active {
      color: white;
    }
  }
}
</style>