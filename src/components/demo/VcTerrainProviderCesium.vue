<!-- 地形 -->
<template>
    <el-row ref="viewerContainer" class="demo-viewer">
      <vc-viewer @ready="onViewerReady" :imageryProvider="imageryProvider">
        <vc-terrain-provider-arcgis ref="provider"></vc-terrain-provider-arcgis>
      </vc-viewer>
      <div class="demo-toolbar">
        <el-row>
          <el-button type="danger" round @click="unload">销毁</el-button>
          <el-button type="danger" round @click="load">加载</el-button>
          <el-button type="danger" round @click="reload">重载</el-button>
        </el-row>
      </div>
    </el-row>
    </template>
    
    <script>
      import { ref, getCurrentInstance } from 'vue'
      export default {
        setup() {
          // state
          const instance = getCurrentInstance()
          const provider = ref(null)
          const imageryProvider = ref(null)
          let viewer = undefined
          // methods
          const unload = () => {
            provider.value.unload()
          }
          const reload = () => {
            provider.value.reload()
          }
          const load = () => {
            provider.value.load()
          }
          const onViewerReady = ({ Cesium, viewer }) => {
            imageryProvider.value = new Cesium.ArcGisMapServerImageryProvider({
              url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
            })
            var target = new Cesium.Cartesian3(300770.50872389384, 5634912.131394585, 2978152.2865545116)
            var offset = new Cesium.Cartesian3(6344.974098678562, -793.3419798081741, 2499.9508860763162)
            viewer.camera.lookAt(target, offset)
            viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY)
          }
          return {
            provider,
            unload,
            reload,
            load,
            imageryProvider,
            onViewerReady
          }
        }
      }
    </script>
    
    <style>
    
    </style>
    