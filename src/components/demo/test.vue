
<template>
  <el-row ref="viewerContainer" class="demo-viewer">
    <vc-viewer ref="vcViewer" :animation="animation" :base-layer-picker="baseLayerPicker" :timeline="timeline"
      :fullscreen-button="fullscreenButton" :fullscreen-element="fullscreenElement" :info-box="infoBox"
      :skyAtmosphere="false" :skyBox="false" :scene-mode-picker="true" :show-credit="showCredit"
      @cesium-ready="onCesiumReady" @ready="onViewerReady" @left-click="onLeftClick" @touch-end="onTouchEnd">
      <vc-navigation :offset="offset" @compass-evt="onNavigationEvt" :other-opts="otherOpts"
        @zoom-evt="onNavigationEvt"></vc-navigation>

      <vc-layer-imagery :sort-order="20" :alpha="1" :brightness="1" :contrast="1" :sortOrder="20">
        <vc-imagery-provider-tianditu map-style="img_c" token="436ce7e50d27eede2f2929307e6b33c0" :minimumLevel="0"
          :maximumLevel="17"></vc-imagery-provider-tianditu>
      </vc-layer-imagery>

    </vc-viewer>
    <el-row class="demo-toolbar">
      <el-row>
        <el-button type="danger" round @click="unload">销毁</el-button>
        <el-button type="danger" round @click="load">加载</el-button>
        <el-button type="danger" round @click="reload">重载</el-button>
      </el-row>
    </el-row>
  </el-row>
</template>
  
<script>
import { init } from './test.js'
export default {
  data() {
    return {
      loading: true,
      animation: true,
      timeline: true,
      baseLayerPicker: false,
      fullscreenButton: true,
      infoBox: true,
      showCredit: true,
      fullscreenElement: document.body,
      point: {
        pixelSize: 28,
        color: 'red'
      },
      label: {
        text: 'Hello World',
        pixelOffset: [0, 150]
      },
      billboard: {},
      offset: [50, 25],
      otherOpts: {
        offset: [0, 32],
        position: 'bottom-right'
      },
    }
  },
  watch: {
    timeline(val) {
      this.otherOpts.offset = val ? [0, 30] : this.fullscreenButton ? [30, 5] : [0, 5]
    },
    fullscreenButton(val) {
      if (!this.timeline && !val) {
        this.otherOpts.offset = [0, 5]
      } else if (!this.timeline && val) {
        this.otherOpts.offset = [30, 5]
      }
    }
  },
  mounted() {
    this.$refs.vcViewer.creatingPromise.then(({ Cesium, viewer }) => {
      console.log('viewer is loaded.')
    })
  },
  methods: {
    onViewerReady({ Cesium, viewer }) {
      this.loading = false
      // 初始化雷达
      init(Cesium, viewer)
      // viewer.scene.globe.enableLighting = true
    },
    onCesiumReady(e) {
      console.log(e)
    },
    onNavigationEvt(e) {
      console.log(e)
    },
    onEntityClick(e) {
      console.log(e)
    },
    onLeftClick(e) {
      console.log(e)
    },
    onTouchEnd(e) {
      console.log(e)
    },
    load() {
      this.$refs.vcViewer.load().then(e => {
        console.log(e)
        this.loading = false
      })
    },
    unload() {
      this.$refs.vcViewer.unload().then(e => {
        console.log(e)
        this.loading = true
      })
    },
    reload() {
      this.loading = true
      this.$refs.vcViewer.reload().then(e => {
        console.log(e)
        this.loading = false
      })
    }
  }
}
</script>
  
<style></style>
  