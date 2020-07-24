import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/custom-theme/index.css'
import highcharts from 'highcharts'
import VueHighCharts from 'vue-highcharts'
import highcharts3d from 'highcharts/highcharts-3d'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */

/* if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
} */

Vue.use(VueHighCharts)
// VueHighCharts.setOptions('dark_blue')
// SandSignika(highcharts)
highcharts3d(highcharts)

const theme = {
  colors: ['#01AEE8','#6A6ED7','#14B984','#D89A1B','#1B79DE','#05B3D7','#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', 
           '#FF9655', '#FFF263', '#6AF9C4'],
  chart: {
      backgroundColor: 'transparent',
  },
  title: {
      style: {
          color: 'white',
          font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
      }
  },
  subtitle: {
      style: {
          color: '#666666',
          font: 'bold 12px "Trebuchet MS", Verdana, sans-serif'
      }
  },

  legend: {
      itemStyle: {
          font: '9pt Trebuchet MS, Verdana, sans-serif',
          color: 'white'
      },
      itemHoverStyle:{
          color: 'gray'
      }   
  }
};

// 使主题配置生效
highcharts.setOptions(theme);

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 中文版 element-ui 使用中号组件
Vue.use(ElementUI,{size: 'small'})

Vue.config.productionTip = false

export const eventBus = new Vue();

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
