<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
import { eventBus } from "@/main";

export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    }
  },
  data(){
    return {
      timer:false,
    }
  },
  mounted(){
    window.onresize = () => {
      if (!this.timer) {
        this.timer = true;
        setTimeout(() => {
          eventBus.$emit("resize");
          this.timer = false;
        }, 1000);
      }
    };
  }
}
</script>

<style scoped>
.app-main {
  min-height: calc(100vh - 240px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header+.app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
