<!-- 量算 -->

<template>
    <el-row ref="viewerContainer" class="demo-viewer">
      <vc-viewer>
        <!-- 修改定位 和 位置偏移 -->
        <vc-measurements
          @draw-evt="drawEvt"
          @active-evt="activeEvt"
          @editor-evt="editorEvt"
          @mouse-evt="mouseEvt"
          ref="measurementsRef"
          position="bottom-left"
          :clamp-to-ground="clampToGround"
          :main-fab-opts="measurementFabOptions1"
          :offset="[10, 65]"
          :editable="editable"
          @ready="drawingsReadyDefault"
          :point-measurement-opts="pointMeasurementOpts"
          :area-measurement-opts="areaMeasurementOpts"
        >
        </vc-measurements>
        <!-- 修改加载的量算实例 -->
        <vc-measurements
          ref="measurementsRef2"
          position="top-right"
          :main-fab-opts="measurementFabOptions2"
          :editable="editable"
          :measurements="measurements"
          active-color="yellow"
        >
        </vc-measurements>
        <!-- 修改量算风格和精度 -->
        <vc-measurements
          ref="measurementsRef3"
          position="top-left"
          :main-fab-opts="measurementFabOptions3"
          :distance-measurement-opts="distanceMeasurementOpts3"
          :component-distance-measurement-opts="componentDistanceMeasurementOpts3"
          :point-measurement-opts="pointMeasurementOpts3"
          :editable="editable"
          :offset="[20, 60]"
        >
        </vc-measurements>
        <!-- 结合 slot 改变默认 UI -->
        <vc-measurements ref="measurementsRef4" position="bottom-left" :main-fab-opts="measurementFabOptions4" :offset="[10, 30]" :editable="editable">
          <template #body="drawingActionInstances">
            <div class="custom-measurements">
              <el-row>
                <vc-btn
                  v-for="(drawingActionInstance, index) in drawingActionInstances"
                  :key="index"
                  :color="drawingActionInstance.isActive ? 'amber' : 'primary'"
                  @click="toggle(drawingActionInstance)"
                  rounded
                  >{{drawingActionInstance.tip.replace('量算', '')}}</vc-btn
                >
                <vc-btn rounded color="red" @click="clear">清除</vc-btn>
              </el-row>
            </div>
          </template>
        </vc-measurements>
        <vc-primitive-tileset
          url="https://zouyaoji.top/vue-cesium/SampleData/Cesium3DTiles/Tilesets/dayanta/tileset.json"
          @ready-promise="onTilesetReady"
        ></vc-primitive-tileset>
        <vc-layer-imagery>
          <vc-imagery-provider-tianditu map-style="img_c" :maximum-level="17" token="436ce7e50d27eede2f2929307e6b33c0"></vc-imagery-provider-tianditu>
        </vc-layer-imagery>
        <vc-terrain-provider-cesium v-if="addTerrain"></vc-terrain-provider-cesium>
      </vc-viewer>
      <el-row class="demo-toolbar">
        <el-button type="danger" round @click="unload">销毁</el-button>
        <el-button type="danger" round @click="load">加载</el-button>
        <el-button type="danger" round @click="reload">重载</el-button>
        <el-checkbox v-model="editable">可编辑</el-checkbox>
        <el-checkbox v-model="addTerrain">地形</el-checkbox>
        <el-checkbox v-model="clampToGround">贴地</el-checkbox>
      </el-row>
    </el-row>
    </template>
    
    <script>
      import { DistanceUnits, AngleUnits } from 'vue-cesium'
      export default {
        data() {
          return {
            addTerrain: false,
            editable: false,
            clampToGround: false,
            measurementFabOptions1: {
              direction: 'right'
            },
            measurementFabOptions2: {
              direction: 'left',
              color: 'accent'
            },
            measurementFabOptions3: {
              direction: 'right',
              modelValue: false,
              color: 'primary'
            },
            distanceMeasurementOpts3: {
              measureUnits: {
                distanceUnits: DistanceUnits.KILOMETERS,
                angleUnits: AngleUnits.RADIANS
              },
              decimals: {
                distance: 4,
                angle: 3
              }
            },
            componentDistanceMeasurementOpts3: {
              measureUnits: {
                distanceUnits: DistanceUnits.KILOMETERS,
                angleUnits: AngleUnits.RADIANS
              },
              decimals: {
                distance: 4,
                angle: 3
              }
            },
            pointMeasurementOpts: {
              preRenderDatas: [[108.9602, 34.21895, 500]],
              pointOpts: {
                color: 'red'
              }
            },
            areaMeasurementOpts: {
              preRenderDatas: [
                [
                  [108.95808, 34.21955, 30],
                  [108.95948, 34.22039, 20],
                  [108.9595, 34.21914, 25]
                ],
                [
                  [108.955, 34.21857],
                  [108.95573, 34.21856],
                  [108.95573, 34.21761],
                  [108.95499, 34.21761]
                ]
              ]
            },
            pointMeasurementOpts3: {
              measureUnits: {
                distanceUnits: DistanceUnits.METERS,
                angleUnits: AngleUnits.DEGREES_MINUTES_SECONDS,
                slopeUnits: AngleUnits.DEGREES
              },
              decimals: {
                lng: 3,
                lat: 3,
                height: 2,
                slope: 3
              }
            },
            measurements: ['component-distance', 'polyline', 'vertical', 'area', 'point'],
            measurementFabOptions4: {
              direction: 'right'
            }
          }
        },
        methods: {
          drawingsReadyDefault({ Cesium, viewer, cesiumObject }) {
            console.log('绘制选项参数：', cesiumObject)
            window.vm = this
          },
          clear() {
            this.$refs.measurementsRef4.clearAll()
          },
          toggle(drawingActionInstance) {
            this.$refs.measurementsRef4.toggleAction(drawingActionInstance.name)
          },
          onTilesetReady(tileset, viewer) {
            // const cartographic = Cesium.Cartographic.fromCartesian(tileset.boundingSphere.center)
            // const surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height)
            // const offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 5)
            // const translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3())
            // tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation)
            viewer.zoomTo(tileset)
            viewer.scene.globe.depthTestAgainstTerrain = true
            this.restoreCursorMove = 'auto'
            this.drawing = false
          },
          drawEvt(e, viewer) {
            console.log(e)
            const restoreCursor = getComputedStyle(viewer.canvas).cursor
            if (e.finished) {
              this.drawing = false
              if (e.type === 'move') {
                viewer.canvas.setAttribute('style', `cursor: ${this.restoreCursorMove}`)
              }
            } else {
              this.drawing = true
              if (e.type === 'move') {
                viewer.canvas.setAttribute('style', 'cursor: move')
              }
              if (e.type === 'new') {
                viewer.canvas.setAttribute('style', 'cursor: crosshair')
              }
            }
          },
          activeEvt(e, viewer) {
            console.log(e)
            viewer.canvas.setAttribute('style', `cursor: ${e.isActive ? 'crosshair' : 'auto'}`)
            if (!e.isActive) {
              this.drawing = false
              this.restoreCursorMove = 'auto'
            }
          },
          editorEvt(e, viewer) {
            console.log(e)
            if (e.type === 'move') {
              const restoreCursor = getComputedStyle(viewer.canvas).cursor
              viewer.canvas.setAttribute('style', 'cursor: move')
              this.drawing = true
            }
          },
          mouseEvt(e, viewer) {
            console.log(e)
            const restoreCursor = getComputedStyle(viewer.canvas).cursor
            if (!this.drawing) {
              if (e.type === 'onmouseover') {
                this.restoreCursorMove = restoreCursor
                viewer.canvas.setAttribute('style', 'cursor: pointer')
              } else {
                viewer.canvas.setAttribute('style', `cursor: ${this.restoreCursorMove || 'auto'}`)
              }
            }
          },
          unload() {
            this.$refs.measurementsRef.unload()
          },
          load() {
            this.$refs.measurementsRef.load()
          },
          reload() {
            this.$refs.measurementsRef.reload()
          }
        }
      }
    </script>
    
    <style>
    
    </style>
    