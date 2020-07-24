
<template>
  <div class='chartBox' :ref='uuid' ></div>
</template>

<script>
import {eventBus} from '@/main';
import uuidv1 from 'uuid/v1';
import "echarts-wordcloud/dist/echarts-wordcloud";
import "echarts-wordcloud/dist/echarts-wordcloud.min";

const echarts = require("echarts");

let chart = {};

  export default {
    props:['title','option'],
    watch:{
      option(nval,oval){
        chart[this.uuid].setOption(nval);
      }
    },
    data() {
      return {
        uuid:uuidv1(),
      }
    },
    beforeMount(){
      eventBus.$on('resize',()=>{
        chart[this.uuid].resize();
      });
    },
    
    mounted(){
      if( !chart[this.uuid] ){
        chart[this.uuid] = echarts.init(this.$refs[this.uuid]);
        chart[this.uuid].setOption(this.option);
      }
    }
  }
</script>

<style scoped>
.chartBox{
  width: 100%;
  height: 100%;
}
</style>

