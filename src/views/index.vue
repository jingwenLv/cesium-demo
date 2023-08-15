<!-- echarts -->

<template>
  <el-row ref="viewerContainer" class="demo-viewer">
    <vc-viewer shouldAnimate :skyAtmosphere="false" timeline  @ready="onViewerReady">
      <vc-navigation :offset="offset" @compass-evt="onNavigationEvt" :other-opts="otherOpts" @zoom-evt="onNavigationEvt">
      </vc-navigation>

      <SatelliteOrbit></SatelliteOrbit>
      <Tianditu></Tianditu>
    </vc-viewer>
    <el-row class="demo-toolbar">
      <el-button type="danger" round @click="unload">销毁</el-button>
      <el-button type="danger" round @click="load">加载</el-button>
      <el-button type="danger" round @click="reload">重载</el-button>
    </el-row>
  </el-row>
</template>
    
<script>
import { ref } from 'vue'
import Tianditu from './component/Tianditu.vue'
import SatelliteOrbit from './component/SatelliteOrbit.vue'
import { startup } from '../components/demo/echart.js'
export default {
  components: { Tianditu, SatelliteOrbit },
  setup() {
    const camera = ref({
      position: [107.033, 26.976, 5725046.53],
      heading: 14,
      pitch: -79,
      roll: 0.06
    })
    const offset = [10, 25]
    const otherOpts = {
      offset: [0, 32],
      position: 'bottom-right'
    }
    const onNavigationEvt = (e) => {
      console.log(e)
    }
    const onViewerReady = ({ Cesium, viewer, earth }) => {
      console.log(earth, 'echart')
      startup(earth)
    }
    const unload = () => {
      this.$refs.vcEcharts.echartOverlay.value.unload()
    }
    const load = () => {
      this.$refs.vcEcharts.echartOverlay.value.load()
    }
    const reload = () => {
      this.$refs.vcEcharts.echartOverlay.value.reload()
    }

    return {
      camera,
      offset,
      otherOpts,
      onViewerReady
    }
  }
}
</script>
    
<style></style>
    