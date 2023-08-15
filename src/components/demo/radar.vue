
<template>
    <el-row ref="viewerContainer" class="demo-viewer">
      <vc-viewer @ready="onViewerReady">
        <vc-post-process-stage-scan ref="radar" type="radar" :options="options1"></vc-post-process-stage-scan>
        <vc-post-process-stage-scan ref="circle" type="circle" :options="options2"></vc-post-process-stage-scan>
        <!-- 底图 -->
        <vc-layer-imagery :sort-order="20">
          <vc-imagery-provider-tianditu map-style="cva_c" token="436ce7e50d27eede2f2929307e6b33c0"></vc-imagery-provider-tianditu>
        </vc-layer-imagery>
        <vc-layer-imagery :sort-order="10">
          <vc-imagery-provider-tianditu map-style="img_c" token="436ce7e50d27eede2f2929307e6b33c0"></vc-imagery-provider-tianditu>
        </vc-layer-imagery>
      </vc-viewer>
      <el-row class="demo-toolbar">
        <el-button type="danger" round @click="unload">销毁</el-button>
        <el-button type="danger" round @click="load">加载</el-button>
        <el-button type="danger" round @click="reload">重载</el-button>
      </el-row>
    </el-row>
    </template>
    
    <script>
      export default {
        data() {
          return {
            options1: {
              position: [117.217124, 31.809777],
              radius: 1500,
              interval: 1500,
              color: [255, 255, 0, 255]
            },
            options2: {
              position: [117.257124, 31.809777],
              radius: 1500,
              interval: 1500,
              color: [255, 0, 0, 255]
            }
          }
        },
        methods: {
          onViewerReady({ viewer }) {
            window.viewer = viewer
            viewer.scene.globe.depthTestAgainstTerrain = true
            viewer.camera.flyTo({
              destination: Cesium.Cartesian3.fromDegrees(117.237124, 31.809777, 10000.0),
              orientation: {
                heading: Cesium.Math.toRadians(0), // east, default value is 0.0 (north) //东西南北朝向
                pitch: Cesium.Math.toRadians(-90), // default value (looking down)  //俯视仰视视觉
                roll: 0.0 // default value
              },
              duration: 3 //3秒到达战场
            })
          },
          unload() {
            this.$refs.circle.unload()
            this.$refs.radar.unload()
          },
          load() {
            this.$refs.circle.load()
            this.$refs.radar.load()
          },
          reload() {
            this.$refs.circle.reload()
            this.$refs.radar.reload()
          }
        }
      }
    </script>
    
    <style>
    
    </style>
    