<template>
  <!-- <Index /> -->
  <!-- 飞机 -->
  <!-- <GraphicsPath /> -->
  <!-- 绘制 -->
  <!-- <VcDrawings></VcDrawings> -->
  <!-- 量算 -->
  <!-- <VcMeasurements></VcMeasurements> -->
  <!-- 自定义元素 -->
  <!-- <VcOverlayHtml></VcOverlayHtml> -->
  <!-- 动态对象 -->
  <!-- <VcOverlayDynamic></VcOverlayDynamic> -->
  <!-- Echarts -->
  <!-- <VcOverlayEcharts></VcOverlayEcharts> -->
  <!-- 台风 -->
  <!-- <VcOverlayTyphoon></VcOverlayTyphoon> -->
  <!-- 超图 -->
  <!-- <VcImageryProviderSupermap></VcImageryProviderSupermap> -->
  <!-- 地形 -->
  <!-- <VcTerrainProviderCesium></VcTerrainProviderCesium> -->
  <!-- 卫星轨道 -->
  <!-- <VcDatasourceCzml></VcDatasourceCzml> -->
  <!-- 模型 -->
  <!-- <VcGraphicsModel></VcGraphicsModel> -->
  <!-- echartSdk -->
  <!-- <EchartSdk></EchartSdk> -->
  <!-- SuperMap -->
  <!-- <SuperMap></SuperMap> -->
  <!-- 雷达 -->
  <!-- <radar></radar> -->
  <!-- 视椎体 -->
  <!-- <centrumOpticus></centrumOpticus> -->
  <!-- <test></test> -->
  <!-- 原生CesiumJS API  -->
  <!-- <primitive></primitive> -->
  <!-- <superMapModel></superMapModel> -->
  <talent></talent>
</template>

<script>
import { defineComponent } from 'vue'
import Index from './views/index.vue'
import GraphicsPath from './components/demo/GraphicsPath.vue'
import VcDrawings from './components/demo/VcDrawings.vue' // 绘制
import VcMeasurements from './components/demo/VcMeasurements.vue' // 量算
import VcOverlayHtml from './components/demo/VcOverlayHtml.vue' // 自定义元素
import VcOverlayDynamic from './components/demo/VcOverlayDynamic.vue' // 动态对象
import VcOverlayEcharts from './components/demo/VcOverlayEcharts.vue' // Echarts
import VcOverlayTyphoon from './components/demo/VcOverlayTyphoon.vue' // 台风
import VcImageryProviderSupermap from './components/demo/VcImageryProviderSupermap.vue' // 超图
import VcTerrainProviderCesium from './components/demo/VcTerrainProviderCesium.vue' // 地形
import VcDatasourceCzml from './components/demo/VcDatasourceCzml.vue' // 卫星轨道
import VcGraphicsModel from './components/demo/VcGraphicsModel.vue' // 模型
import EchartSdk from './components/demo/EchartSdk.vue' // echartSdk
import SuperMap from './components/demo/SuperMap.vue' // SuperMap
import radar from './components/demo/radar.vue' // 雷达
import centrumOpticus from './components/demo/centrumOpticus.vue' // 雷达
import test from './components/demo/test.vue'
import primitive from './components/demo/primitive.vue'
import superMapModel from './components/demo/superMapModel.vue'
import talent from './components/talent/index.vue'

export default defineComponent({
  name: 'App',
  components: {
    Index,
    GraphicsPath,
    VcDrawings,
    VcMeasurements,
    VcOverlayHtml,
    VcOverlayDynamic,
    VcOverlayEcharts,
    VcOverlayTyphoon,
    VcImageryProviderSupermap,
    VcTerrainProviderCesium,
    VcDatasourceCzml,
    VcGraphicsModel,
    EchartSdk,
    SuperMap,
    radar,
    centrumOpticus,
    test,
    primitive,
    superMapModel,
    talent
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  /* margin-top: 60px; */
  width: 100%;
  height: 100%;
  margin: 0;
  overflow: hidden;
}
</style>
