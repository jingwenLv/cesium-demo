<!-- 超图 -->

<template>
    <el-row ref="viewerContainer" class="demo-viewer">
      <vc-viewer @ready="onViewerReady">
        <vc-layer-imagery :alpha="alpha" :brightness="brightness" :contrast="contrast">
          <vc-imagery-provider-supermap
            @ready-promise="onImageryProviderReady"
            ref="provider"
            url="https://www.supermapol.com/realspace/services/3D-dixingyingxiang/rest/realspace/datas/MosaicResult"
          ></vc-imagery-provider-supermap>
        </vc-layer-imagery>
      </vc-viewer>
      <div class="demo-toolbar">
        <el-row>
          <el-button type="danger" round @click="unload">销毁</el-button>
          <el-button type="danger" round @click="load">加载</el-button>
          <el-button type="danger" round @click="reload">重载</el-button>
        </el-row>
        <el-row>
          <el-col>
            <div class="block">
              <span class="demonstration">透明度</span>
              <el-slider v-model="alpha" :min="0" :max="1" :step="0.01"></el-slider>
              <span class="demonstration">亮度</span>
              <el-slider v-model="brightness" :min="0" :max="5" :step="0.01"></el-slider>
              <span class="demonstration">对比度</span>
              <el-slider v-model="contrast" :min="0" :max="5" :step="0.01"></el-slider>
            </div>
          </el-col>
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
          const alpha = ref(1)
          const brightness = ref(1)
          const contrast = ref(1)
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
          const onImageryProviderReady = imageryProvider => {
            viewer.camera.flyTo({ destination: imageryProvider.rectangle })
          }
          const onViewerReady = cesiumInstance => {
            viewer = cesiumInstance.viewer
          }
          return {
            provider,
            unload,
            reload,
            load,
            alpha,
            brightness,
            contrast,
            onImageryProviderReady,
            onViewerReady
          }
        }
      }
    </script>
    
    <style>
    
    </style>
    