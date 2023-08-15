/*
 * @Author: zouyaoji@https://github.com/zouyaoji
 * @Date: 2021-12-29 13:45:20
 * @LastEditTime: 2021-12-29 13:47:20
 * @LastEditors: zouyaoji
 * @Description:
 * @FilePath: \vue-cesium-vite-starter\src\main.ts
 */
import { createApp } from 'vue'
import App from './App.vue'
import VueCesium from 'vue-cesium'
import 'vue-cesium/dist/index.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style/index.css'


if (typeof (window as any).global === 'undefined') {
  (window as any).global = window
}
const app = createApp(App)
app.use(ElementPlus)
app.use(VueCesium, {
  // cesiumPath 是指引用的Cesium.js路径，如
  cesiumPath: 'https://earthsdk.com/v/last/XbsjEarth/XbsjEarth.js'
  // cesiumPath: 'https://unpkg.com/cesium/Build/Cesium/Cesium.js'
  // cesiumPath: 'https://www.supermapol.com/earth/Build/Cesium/Cesium.js',
  // 使用Cesium ion的数据源需要到https://cesium.com/ion/申请一个账户，获取Access Token。不指定的话可能导致 CesiumIon 的在线影像、地形加载失败
  // accessToken: 'Your Cesium Ion defaultAccessToken'
})
app.mount('#app')
